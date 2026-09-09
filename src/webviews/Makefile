SHELL := /bin/sh

CONFIG_FILE ?= config
-include $(CONFIG_FILE)

WEBVIEWS_URL ?= https://cdn.front.nu/src/webviews
WEBVIEWS_DIR ?= src/webviews
WEBVIEWS_REFRESH ?= 0
IOS_MODE ?= local
IOS_LOCAL_URL ?= http://127.0.0.1:8080
IOS_PRODUCTION_URL ?=
IOS_DEVICE_NAME ?= Front iPhone
IOS_XCODE_DEVELOPER_DIR ?=
IOS_DOWNLOAD_IOS_RUNTIME ?= 1
IOS_SHUTDOWN_SIMULATOR ?= 0
IOS_DERIVED_DATA ?= ../.build/ios
WEB_HOST ?= 127.0.0.1
WEB_PORT ?= 8080
WEB_URL ?= http://$(WEB_HOST):$(WEB_PORT)

ifeq ($(IOS_MODE),local)
IOS_CONFIGURATION ?= Debug
IOS_URL ?=
else ifeq ($(IOS_MODE),localhost)
IOS_CONFIGURATION ?= Debug
IOS_URL ?= $(IOS_LOCAL_URL)
else ifeq ($(IOS_MODE),production)
IOS_CONFIGURATION ?= Release
IOS_URL ?= $(IOS_PRODUCTION_URL)
ifeq ($(strip $(IOS_URL)),)
$(error IOS_PRODUCTION_URL must be set when IOS_MODE=production)
endif
else
$(error Unsupported IOS_MODE '$(IOS_MODE)'; use local, localhost, or production)
endif

WEBVIEWS_FILES := \
	404.html \
	Makefile \
	bridge.js \
	index.html \
	logo.svg \
	ios/FrontWebView.xcodeproj/project.pbxproj \
	ios/FrontWebView/AppDelegate.swift \
	ios/FrontWebView/Info.plist \
	ios/FrontWebView/LaunchScreen.storyboard \
	ios/FrontWebView/SceneDelegate.swift \
	ios/FrontWebView/ViewController.swift

.PHONY: install\:webviews app\:run app\:run\:ios

install\:webviews:
	@set -eu; \
	command -v curl >/dev/null 2>&1 || { echo "Error: curl is required to download webviews." >&2; exit 1; }; \
	for file in $(WEBVIEWS_FILES); do \
		destination="$(WEBVIEWS_DIR)/$$file"; \
		mkdir -p "$$(dirname "$$destination")"; \
		if [ "$(WEBVIEWS_REFRESH)" = "1" ] || [ ! -f "$$destination" ]; then \
			echo "Downloading $(WEBVIEWS_URL)/$$file"; \
			curl --fail --silent --show-error --location "$(WEBVIEWS_URL)/$$file" --output "$$destination"; \
		else \
			echo "Using existing $$destination"; \
		fi; \
	done
	@echo "Webviews downloaded to $(WEBVIEWS_DIR)"

app\:run:
	@set -eu; \
	command -v python3 >/dev/null 2>&1 || { echo "Error: python3 is required to run the web app." >&2; exit 1; }; \
	python3 -m http.server "$(WEB_PORT)" --bind "$(WEB_HOST)" & \
	server_pid=$$!; \
	cleanup() { kill "$$server_pid" >/dev/null 2>&1 || true; }; \
	trap cleanup INT TERM EXIT; \
	sleep 1; \
	open "$(WEB_URL)"; \
	wait "$$server_pid"

app\:run\:ios:
	@set -eu; \
	missing=0; \
	for file in $(WEBVIEWS_FILES); do \
		if [ ! -f "$(WEBVIEWS_DIR)/$$file" ]; then missing=1; break; fi; \
	done; \
	if [ "$$missing" -eq 1 ] || [ "$(WEBVIEWS_REFRESH)" = "1" ]; then \
		$(MAKE) install:webviews; \
	else \
		echo "Using existing WebViews in $(WEBVIEWS_DIR)"; \
	fi; \
	project_file="$(WEBVIEWS_DIR)/ios/FrontWebView.xcodeproj/project.pbxproj"; \
	if [ ! -f "../front.js" ]; then \
		echo "Error: repository runtime ../front.js was not found." >&2; \
		exit 1; \
	fi; \
	sed -i '' 's#path = ../../front.js;#path = ../../../../front.js;#' "$$project_file"
	@$(MAKE) -C src/webviews ios CONFIG_FILE="$(abspath $(CONFIG_FILE))" CONFIGURATION="$(IOS_CONFIGURATION)" URL="$(IOS_URL)" DEVICE_NAME="$(IOS_DEVICE_NAME)" XCODE_DEVELOPER_DIR="$(IOS_XCODE_DEVELOPER_DIR)" DOWNLOAD_IOS_RUNTIME="$(IOS_DOWNLOAD_IOS_RUNTIME)" SHUTDOWN_SIMULATOR="$(IOS_SHUTDOWN_SIMULATOR)" DERIVED_DATA="$(IOS_DERIVED_DATA)"