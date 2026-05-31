SHELL := /bin/bash

SRC = src
JS_FILE = $(SRC)/front.js
JS_MIN_FILE = front.min.js
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

release:
	@if ! command -v gh &> /dev/null; then echo "Error: gh (GitHub CLI) is required. Install with: brew install gh"; exit 1; fi
	@if ! gh auth status &> /dev/null; then echo "Error: Not authenticated. Run: gh auth login"; exit 1; fi
	@if [ -z "$(VERSION)" ]; then echo "Error: Could not extract version from $(JS_FILE)"; exit 1; fi
	@if [ -d "$(VERSION)" ]; then echo "Error: $(VERSION) already exists."; exit 1; fi
	@echo "Release $(VERSION) from $(SRC)?"
	@read -p "Confirm [y/n]: " ans && [ "$$ans" = "y" ] || exit 1
	@mkdir -p $(VERSION)
	@cp -fr $(SRC)/* $(VERSION)/
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
	@echo "Released $(VERSION)"

%:
	@:
