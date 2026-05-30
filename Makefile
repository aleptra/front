SHELL := /bin/bash

SRC = src
JS_FILE = $(SRC)/front.js
VERSION := $(shell grep 'frontVersion' $(JS_FILE) | grep -oE '[0-9]+' | head -3 | paste -sd '.' -)

release:
	@if [ -z "$(VERSION)" ]; then echo "Error: Could not extract version from $(JS_FILE)"; exit 1; fi
	@if [ -d "dist/$(VERSION)" ]; then echo "Error: dist/$(VERSION) already exists."; exit 1; fi
	@echo "Release $(VERSION) from $(SRC)?"
	@read -p "Confirm [y/n]: " ans && [ "$$ans" = "y" ] || exit 1
	@mkdir -p dist/$(VERSION)
	@cp -fr $(SRC)/* dist/$(VERSION)/
	@git add . && git commit -m "Release $(VERSION)" && git push
	@git tag -a v$(VERSION) -m "v$(VERSION)" && git push origin v$(VERSION)
	@echo "Released $(VERSION)"

%:
	@:
