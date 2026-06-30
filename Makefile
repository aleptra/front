SHELL := /bin/bash

.PHONY: nightly test test\:unit test\:integration test\:performance

SRC = src
JS_FILE = $(SRC)/front.js
JS_MIN_FILE = front.min.js
TAG := $(shell grep -o 'build:[[:space:]]*[0-9]*' $(JS_FILE) | awk -F':' '{ print $$2+1 }')
VERSION := $(shell grep 'frontVersion' $(JS_FILE) | grep -oE '[0-9]+' | head -3 | paste -sd '.' -)

define minify
	sed -E 's#//.*$$##' $(1) \
	| sed -E '/\/\*/,/\*\//d' \
	| sed -E 's/^[[:space:]]+//' \
	| sed -E 's/[[:space:]]+$$//' \
	| sed -E 's/[[:space:]]+/ /g' \
	| sed -E '/^$$/d' \
	| perl -0777 -pe 's/([{,;])\n\s*/$$1/g' \
	| perl -0777 -pe 's/}\n\s*}/}}/g' \
	> $(2)
endef

nightly:
	@sed -i '' -E 's/(build:[[:space:]]+)[0-9]+/\1$(TAG)/g' $(JS_FILE)
	@echo "Build: $(TAG) (v$(VERSION))"
	@rsync -av --exclude=test $(SRC)/ nightly/
	@$(call minify,$(JS_FILE),nightly/$(JS_MIN_FILE))
	@echo "Built nightly"
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
	@git add . && git commit -m "Build $(TAG)" && git push
	@echo "✅ Deployed nightly"

release:
	@if ! command -v gh &> /dev/null; then echo "Error: gh (GitHub CLI) is required. Install with: brew install gh"; exit 1; fi
	@if ! gh auth status &> /dev/null; then echo "Error: Not authenticated. Run: gh auth login"; exit 1; fi
	@if [ -z "$(VERSION)" ]; then echo "Error: Could not extract version from $(JS_FILE)"; exit 1; fi
	@if [ -d "$(VERSION)" ]; then echo "Error: $(VERSION) already exists."; exit 1; fi
	@echo "Release $(VERSION) from $(SRC)?"
	@read -p "Confirm [y/n]: " ans && [ "$$ans" = "y" ] || exit 1
	@mkdir -p $(VERSION)
	@rsync -av --exclude=test $(SRC)/ $(VERSION)/
	@$(call minify,$(JS_FILE),$(VERSION)/$(JS_MIN_FILE))
	@echo ""
	@echo "Prepared $(VERSION):"
	@ls $(VERSION)/
	@echo ""
	@read -p "Commit and tag v$(VERSION)? [y/n]: " ans; \
	if [ "$$ans" != "y" ]; then rm -rf $(VERSION); echo "Reverted."; exit 1; fi
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
	@FAIL=0; START=$$(date +%s); TOTAL=0; \
	OUT=$$($(MAKE) test:unit 2>&1); FAIL=$$((FAIL + $$?)); echo "$$OUT"; \
	TOTAL=$$((TOTAL + $$(echo "$$OUT" | grep -o 'Passed: [0-9]*' | grep -o '[0-9]*'))); \
	OUT=$$($(MAKE) test:integration 2>&1); FAIL=$$((FAIL + $$?)); echo "$$OUT"; \
	TOTAL=$$((TOTAL + $$(echo "$$OUT" | grep -o 'Passed: [0-9]*' | grep -o '[0-9]*'))); \
	OUT=$$($(MAKE) test:performance 2>&1); FAIL=$$((FAIL + $$?)); echo "$$OUT"; \
	TOTAL=$$((TOTAL + $$(echo "$$OUT" | grep -o 'Passed: [0-9]*' | grep -o '[0-9]*'))); \
	END=$$(date +%s); ELAPSED=$$((END - START)); \
	if [ $$FAIL -eq 0 ]; then echo ""; echo "================================"; echo "✅ $$TOTAL tests passed in $${ELAPSED}s"; echo "================================"; \
	else echo ""; echo "================================"; echo "❌ Some tests failed ($${ELAPSED}s)"; echo "================================"; exit 1; fi

test\:unit:
	@echo ""; echo "=== Unit Tests ==="; \
	START=$$(date +%s); \
	CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; \
	PORT=9225; \
	python3 -m http.server $$PORT -d $(SRC) &>/dev/null & PID=$$!; \
	sleep 0.5; \
	"$$CHROME" --headless=new --disable-gpu --virtual-time-budget=10000 --dump-dom --no-sandbox \
		"http://localhost:$$PORT/test/auto/unit/" 2>/dev/null | tr -d '\n' > /tmp/front_test_unit.html; \
	kill $$PID 2>/dev/null; wait $$PID 2>/dev/null; \
	END=$$(date +%s); ELAPSED=$$((END - START)); \
	SUMMARY=$$(grep -o 'Total: [^<]*' /tmp/front_test_unit.html); \
	grep -oE '(✅|❌)[^<]*' /tmp/front_test_unit.html; \
	echo ""; echo "$$SUMMARY"; \
	echo "$$SUMMARY" | grep -q "Failed: 0" && echo "✅ unit passed ($${ELAPSED}s)" || { echo "❌ unit failed ($${ELAPSED}s)"; exit 1; }

test\:integration:
	@echo ""; echo "=== Integration Tests ==="; \
	START=$$(date +%s); \
	CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; \
	PORT=9226; \
	python3 -m http.server $$PORT -d $(SRC) &>/dev/null & PID=$$!; \
	sleep 0.5; \
	"$$CHROME" --headless=new --disable-gpu --virtual-time-budget=10000 --dump-dom --no-sandbox \
		"http://localhost:$$PORT/test/auto/integration/" 2>/dev/null | tr -d '\n' > /tmp/front_test_integration.html; \
	kill $$PID 2>/dev/null; wait $$PID 2>/dev/null; \
	END=$$(date +%s); ELAPSED=$$((END - START)); \
	SUMMARY=$$(grep -o 'Total: [^<]*' /tmp/front_test_integration.html); \
	grep -oE '(✅|❌)[^<]*' /tmp/front_test_integration.html; \
	echo ""; echo "$$SUMMARY"; \
	echo "$$SUMMARY" | grep -q "Failed: 0" && echo "✅ integration passed ($${ELAPSED}s)" || { echo "❌ integration failed ($${ELAPSED}s)"; exit 1; }

test\:performance:
	@echo ""; echo "=== Performance Tests ==="; \
	START=$$(date +%s); \
	CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; \
	PORT=9227; \
	python3 -m http.server $$PORT -d $(SRC) &>/dev/null & PID=$$!; \
	sleep 0.5; \
	"$$CHROME" --headless=new --disable-gpu --virtual-time-budget=10000 --dump-dom --no-sandbox \
		"http://localhost:$$PORT/test/auto/performance/" 2>/dev/null | tr -d '\n' > /tmp/front_test_performance.html; \
	kill $$PID 2>/dev/null; wait $$PID 2>/dev/null; \
	END=$$(date +%s); ELAPSED=$$((END - START)); \
	SUMMARY=$$(grep -o 'Total: [^<]*' /tmp/front_test_performance.html); \
	grep -oE '(✅|❌)[^<]*' /tmp/front_test_performance.html; \
	echo ""; echo "$$SUMMARY"; \
	echo "$$SUMMARY" | grep -q "Failed: 0" && echo "✅ performance passed ($${ELAPSED}s)" || { echo "❌ performance failed ($${ELAPSED}s)"; exit 1; }

app\:create:
	@if [ -z "$(DIR)" ]; then \
		read -p "Enter project name: " DIR; \
	fi; \
	PROJECTDIR=~/front/$$DIR; \
	PROJECTDIR=$$(eval echo $$PROJECTDIR); \
	if [ -d "$$PROJECTDIR" ]; then \
		echo "Error: $$PROJECTDIR already exists"; exit 1; \
	fi; \
	LATEST_VERSION="$(VERSION)"; \
	echo "Creating app project in $$PROJECTDIR..."; \
	mkdir -p $$PROJECTDIR/src $$PROJECTDIR/dist; \
	echo '<!DOCTYPE html>' > $$PROJECTDIR/index.html; \
	echo '<html lang="en">' >> $$PROJECTDIR/index.html; \
	echo '<head>' >> $$PROJECTDIR/index.html; \
	echo '  <meta charset="UTF-8">' >> $$PROJECTDIR/index.html; \
	echo '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' >> $$PROJECTDIR/index.html; \
	echo '  <title>FTML App</title>' >> $$PROJECTDIR/index.html; \
	echo '</head>' >> $$PROJECTDIR/index.html; \
	echo '<body>' >> $$PROJECTDIR/index.html; \
	echo '  <h1 settext="FTML is running successfully!"></h1>' >> $$PROJECTDIR/index.html; \
	echo '  <script src="https://cdn.front.nu/'$$LATEST_VERSION'/front.min.js"></script>' >> $$PROJECTDIR/index.html; \
	echo '</body>' >> $$PROJECTDIR/index.html; \
	echo '</html>' >> $$PROJECTDIR/index.html; \
	echo "✓ App project created in $$PROJECTDIR"; \
	echo "✓ Using v$$LATEST_VERSION from CDN"; \

app\:run:
	@PS3="Select project: "; \
	select PROJECTDIR in $$(ls -d ~/front/*/ 2>/dev/null | xargs -n1 basename); do \
		cd ~/front/$$PROJECTDIR && python3 -m http.server 8000; break; \
	done

%:
	@:
