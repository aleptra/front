SHELL := /bin/bash

.DEFAULT_GOAL := default
.PHONY: default latest release test test\:minify test\:unit test\:integration test\:performance ios doctor

SRC = src
MINIFY_TOOL = $(SRC)/tools/minify/minify
JS_FILE = $(SRC)/front.js
JS_MIN_FILE = front.min.js
README_FILE = README.md
TEST_QUERY = $(if $(TEST),?test=$(TEST),)
NOW = python3 -c 'import time;print(time.time())'
SINCE = python3 -c "import sys,time;print('%.1f' % (time.time() - float(sys.argv[1])))"
MINIFY ?= 0
TEST_RUNTIME ?= $(if $(filter 1 true yes,$(MINIFY)),$(SRC)/.build/web/$(JS_MIN_FILE),$(SRC)/front.js)
TAG := $(shell grep -o 'build:[[:space:]]*[0-9]*' $(JS_FILE) | awk -F':' '{ print $$2+1 }')
VERSION := $(shell grep 'frontVersion' $(JS_FILE) | grep -oE '[0-9]+' | head -3 | paste -sd '.' -)
BUILD_CHANGES := $(shell git diff --name-only HEAD -- Makefile $(SRC)/front.js $(SRC)/modules $(SRC)/plugins $(SRC)/tools/minify; git ls-files --others --exclude-standard -- Makefile $(SRC)/front.js $(SRC)/modules $(SRC)/plugins $(SRC)/tools/minify)


define run_browser_test
	@echo ""; echo "=== $(1) Tests ($(TEST_RUNTIME)) ==="; \
	START=$$($(NOW)); \
	CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; \
	PORT=$(3); \
	TEST_ROOT=$$(mktemp -d /tmp/front-test-$(2).XXXXXX); \
	PID=""; \
	cleanup() { if [ -n "$$PID" ]; then kill "$$PID" 2>/dev/null || true; wait "$$PID" 2>/dev/null || true; fi; rm -rf "$$TEST_ROOT"; }; \
	trap cleanup EXIT; \
	rsync -a --exclude='.build/' "$(SRC)/" "$$TEST_ROOT/"; \
	cp "$(TEST_RUNTIME)" "$$TEST_ROOT/front.js"; \
	python3 -c "from pathlib import Path; root=Path('$$TEST_ROOT/tests/auto'); [p.write_text(p.read_text().replace('../../../front.js', '../../../front.js?run=$$START')) for p in root.glob('*/index.html')]"; \
	python3 -m http.server $$PORT -d "$$TEST_ROOT" &>/dev/null & PID=$$!; \
	sleep 0.5; \
	"$$CHROME" --headless=new --incognito --disable-gpu --disable-cache --disk-cache-size=0 --virtual-time-budget=10000 --dump-dom --no-sandbox \
		"http://localhost:$$PORT/tests/auto/$(2)/$(TEST_QUERY)" 2>/dev/null | tr -d '\n' > /tmp/front_test_$(2).html; \
	ELAPSED=$$($(SINCE) $$START); \
	SUMMARY=$$(grep -o 'Total: [^<]*' /tmp/front_test_$(2).html); \
	grep -oE '(✅|❌|⚠️)[^<]*' /tmp/front_test_$(2).html; \
	echo ""; echo "$$SUMMARY"; \
	echo "$$SUMMARY" | grep -q "Failed: 0" && echo "✅ $(2) passed ($${ELAPSED}s)" || { echo "❌ $(2) failed ($${ELAPSED}s)"; exit 1; }
endef

default:
	@if git diff --quiet && git diff --cached --quiet && [ -z "$$(git ls-files --others --exclude-standard)" ]; then \
		echo "Nothing to do"; \
	else \
		$(MAKE) latest; \
	fi

latest: test
ifeq ($(strip $(BUILD_CHANGES)),)
	@echo "No distributable JavaScript changes; skipping latest build."
	@git add . && git commit --allow-empty-message -m "" && git push
else
	@sed -i '' -E 's/(build:[[:space:]]+)[0-9]+/\1$(TAG)/g' $(JS_FILE)
	@echo "Build: $(TAG) (v$(VERSION))"
	@rsync -av --exclude='/tests/' --delete --delete-excluded $(SRC)/ nightly/
	@$(MINIFY_TOOL) "$(JS_FILE)" "nightly/$(JS_MIN_FILE)"
	@echo "Built latest"
	@read -p "Deploy? [y/n]: " ans; \
	if [ "$$ans" != "y" ]; then \
		files=$$(git ls-files 'src/front*.js' 'nightly/front*.js'); \
		if [ -n "$$files" ]; then \
			git restore --staged -- $$files; \
			git restore --worktree -- $$files; \
		fi; \
		echo "Reverted."; \
		exit 1; \
	fi
	@git add -- $(BUILD_CHANGES) && \
	git commit --only -m "Build $(TAG)" -- $(BUILD_CHANGES) && \
	git add . && \
	if ! git diff --cached --quiet; then \
		git commit --allow-empty-message -m ""; \
	fi && \
	git push
	@echo "✅ Deployed latest: $(TAG)"
endif

release: test
	@if ! command -v gh &> /dev/null; then echo "Error: gh (GitHub CLI) is required. Install with: brew install gh"; exit 1; fi
	@if ! gh auth status &> /dev/null; then echo "Error: Not authenticated. Run: gh auth login"; exit 1; fi
	@if [ -z "$(VERSION)" ]; then echo "Error: Could not extract version from $(JS_FILE)"; exit 1; fi
	@if [ -d "$(VERSION)" ]; then echo "Error: $(VERSION) already exists."; exit 1; fi
	@echo "Release $(VERSION) from $(SRC)?"
	@read -p "Confirm [y/n]: " ans && [ "$$ans" = "y" ] || exit 1
	@mkdir -p $(VERSION)
	@rsync -av --exclude=tests $(SRC)/ $(VERSION)/
	@$(MINIFY_TOOL) "$(JS_FILE)" "$(VERSION)/$(JS_MIN_FILE)"
	@echo ""
	@echo "Prepared $(VERSION):"
	@ls $(VERSION)/
	@echo ""
	@read -p "Commit and tag v$(VERSION)? [y/n]: " ans; \
	if [ "$$ans" != "y" ]; then rm -rf $(VERSION); echo "Reverted."; exit 1; fi
	@sed -i '' -E -e 's/Stable \(v[0-9]+\.[0-9]+\.[0-9]+\)/Stable (v$(VERSION))/g' -e 's#(https://cdn\.front\.nu/)[0-9]+\.[0-9]+\.[0-9]+(/front\.js)#\1$(VERSION)\2#g' -e 's#(\]\(/)[0-9]+\.[0-9]+\.[0-9]+(/front\.js\))#\1$(VERSION)\2#g' $(README_FILE)
	@git add . && git commit -m "Release $(VERSION)" && git push
	@git tag -a v$(VERSION) -m "v$(VERSION)" && git push origin v$(VERSION)
	@zip -r front-$(VERSION).zip $(VERSION)
	@printf "## What's included\n- Runtime\n- Modules\n- Plugins\n\n## CDN\n- https://cdn.front.nu/$(VERSION)/front.js\n- https://cdn.front.nu/$(VERSION)/$(JS_MIN_FILE) (minified)\n\n## Documentation\nhttps://www.front.nu/documentation\n" | gh release create v$(VERSION) --title "$(VERSION)" --notes-file - front-$(VERSION).zip
	@echo "✅ Released $(VERSION)"

app:
	@echo "===================="
	@echo ""
	@echo -e "Available commands:"
	@echo "make app:create DIR=<dir>  - Create new app project in specified directory"
	@echo "make app:run               - Start development server"
	@echo ""

test:
	@FAIL=0; START=$$($(NOW)); TOTAL=0; \
	for SUITE in unit integration performance; do \
		OUT=$$($(MAKE) test:$$SUITE 2>&1); STATUS=$$?; echo "$$OUT"; FAIL=$$((FAIL + STATUS)); \
		PASSED=$$(echo "$$OUT" | grep -o 'Passed: [0-9]*' | grep -o '[0-9]*' | head -1); PASSED=$${PASSED:-0}; TOTAL=$$((TOTAL + PASSED)); \
	done; \
	ELAPSED=$$($(SINCE) $$START); \
	if [ $$FAIL -eq 0 ]; then echo ""; echo "================================"; echo "✅ $$TOTAL tests passed in $${ELAPSED}s"; echo "================================"; \
	else echo ""; echo "================================"; echo "❌ Some tests failed ($${ELAPSED}s)"; echo "================================"; exit 1; fi

test\:minify:
	@set -e; \
	TMP_RUNTIME="$(SRC)/.build/web/$(JS_MIN_FILE)"; \
	mkdir -p "$(SRC)/.build/web"; \
	MINIFY_OUTPUT=$$($(MINIFY_TOOL) "$(JS_FILE)" "$$TMP_RUNTIME"); \
	$(MAKE) test MINIFY=1 TEST_RUNTIME="$$TMP_RUNTIME"; \
	echo "$$MINIFY_OUTPUT"

test\:unit:
	$(call run_browser_test,Unit,unit,9225)

test\:integration:
	$(call run_browser_test,Integration,integration,9226)

test\:performance:
	$(call run_browser_test,Performance,performance,9227)

app\:create:
	@set -e; \
	DIR="$(DIR)"; \
	if [ -z "$$DIR" ]; then \
		read -p "Enter project name: " DIR || true; \
	fi; \
	if [ -z "$$DIR" ]; then \
		echo "Error: project name is required."; \
		exit 1; \
	fi; \
	PROJECTDIR=~/front/$$DIR; \
	PROJECTDIR=$$(eval echo $$PROJECTDIR); \
	if [ -d "$$PROJECTDIR" ]; then \
		echo "Error: $$PROJECTDIR already exists"; \
		exit 1; \
	fi; \
	USE_CDN="$(USE_CDN)"; \
	if [ -z "$$USE_CDN" ]; then \
		read -p "Use Front CDN? [Y/n]: " CDN_ANSWER || true; \
		case "$$CDN_ANSWER" in \
			n|N|no|NO) USE_CDN=0 ;; \
			*) USE_CDN=1 ;; \
		esac; \
	fi; \
	LATEST_VERSION="$(VERSION)"; \
	if [ "$$USE_CDN" = "1" ]; then echo "✓ Using v$$LATEST_VERSION from CDN"; else echo "✓ Using local Front runtime"; fi; \
	echo "Creating app project in $$PROJECTDIR..."; \
	mkdir -p "$$PROJECTDIR"; \
	if [ "$$USE_CDN" = "1" ]; then \
		SCRIPT_URL="https://cdn.front.nu/$$LATEST_VERSION/front.min.js"; \
	else \
		mkdir -p "$$PROJECTDIR/src"; \
		cp -R "$$LATEST_VERSION" "$$PROJECTDIR/src/"; \
		SCRIPT_URL="src/$$LATEST_VERSION/front.js"; \
	fi; \
	cp -R "$(SRC)/tools/boilerplate/." "$$PROJECTDIR/"; \
	find "$$PROJECTDIR" -type f -name '*.html' -print0 | while IFS= read -r -d '' HTML_FILE; do \
		HTML_TMP="$$HTML_FILE.tmp"; \
		sed "s|__FRONT_SCRIPT__|$$SCRIPT_URL|g" "$$HTML_FILE" > "$$HTML_TMP"; \
		mv "$$HTML_TMP" "$$HTML_FILE"; \
	done; \
	echo "✓ App project created in $$PROJECTDIR"; \

app\:run:
	@PS3="Select project: "; \
	select PROJECTDIR in $$(ls -d ~/front/*/ 2>/dev/null | xargs -n1 basename); do \
		cd ~/front/$$PROJECTDIR && python3 -m http.server 8000; break; \
	done

ios:
	@$(MAKE) -C $(SRC)/webviews ios

doctor:
	@$(MAKE) -C $(SRC)/webviews doctor

%:
	@:
