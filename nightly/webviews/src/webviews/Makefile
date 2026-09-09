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
IOS_APP_NAME ?= Front WebView
IOS_XCODE_DEVELOPER_DIR ?=
IOS_DOWNLOAD_IOS_RUNTIME ?= 1
IOS_SHUTDOWN_SIMULATOR ?= 0
IOS_DERIVED_DATA ?= ../.build/ios
PROJECT ?= ios/FrontWebView.xcodeproj
SCHEME ?= FrontWebView
IOS_BUNDLE_IDENTIFIER ?= com.front.webviewpoc
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

.PHONY: install\:webviews app\:run app\:run\:ios ios

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
	nested_makefile="$(WEBVIEWS_DIR)/Makefile"; \
	if [ -f Makefile ] && [ "$(WEBVIEWS_DIR)" = "src/webviews" ]; then \
		cp Makefile "$$nested_makefile"; \
	fi; \
	project_file="$(WEBVIEWS_DIR)/ios/FrontWebView.xcodeproj/project.pbxproj"; \
	if [ ! -f "../front.js" ]; then \
		echo "Error: repository runtime ../front.js was not found." >&2; \
		exit 1; \
	fi; \
	sed -i '' 's#path = ../../front.js;#path = ../../../../front.js;#' "$$project_file"
	@$(MAKE) -C src/webviews ios CONFIG_FILE="$(abspath $(CONFIG_FILE))" CONFIGURATION="$(IOS_CONFIGURATION)" URL="$(IOS_URL)" DEVICE_NAME="$(IOS_DEVICE_NAME)" XCODE_DEVELOPER_DIR="$(IOS_XCODE_DEVELOPER_DIR)" DOWNLOAD_IOS_RUNTIME="$(IOS_DOWNLOAD_IOS_RUNTIME)" SHUTDOWN_SIMULATOR="$(IOS_SHUTDOWN_SIMULATOR)" DERIVED_DATA="$(IOS_DERIVED_DATA)"

ios:
	@set -e; \
	XCODE="$(XCODE_DEVELOPER_DIR)"; \
	if [ -z "$$XCODE" ]; then \
		for candidate in /Applications/Xcode*.app/Contents/Developer "$$(xcode-select -p 2>/dev/null || true)"; do \
			if [ -x "$$candidate/usr/bin/xcodebuild" ] && [ -x "$$candidate/usr/bin/simctl" ]; then \
				XCODE="$$candidate"; \
				break; \
			fi; \
		done; \
	fi; \
	if [ -z "$$XCODE" ]; then \
		echo "Full Xcode with iOS Simulator tools was not found." >&2; \
		echo "Install Xcode or set IOS_XCODE_DEVELOPER_DIR to its Contents/Developer path." >&2; \
		exit 1; \
	fi; \
	echo "Using Xcode: $$XCODE"; \
	if ! "$$XCODE/usr/bin/xcodebuild" -checkFirstLaunchStatus >/dev/null 2>&1; then \
		echo "Running Xcode first-launch setup..."; \
		"$$XCODE/usr/bin/xcodebuild" -runFirstLaunch || { \
			echo "Xcode setup needs permission. Run: sudo $$XCODE/usr/bin/xcodebuild -runFirstLaunch" >&2; \
			exit 1; \
		}; \
	fi; \
	SIMCTL="$$XCODE/usr/bin/simctl"; \
	DEVICE_ID=$$("$$SIMCTL" list devices available | awk -F '[()]' '/iPhone/ { print $$2; exit }'); \
	if [ -z "$$DEVICE_ID" ]; then \
		RUNTIME=$$("$$SIMCTL" list runtimes available | awk '/iOS/ { print $$NF; exit }'); \
		if [ -z "$$RUNTIME" ] && [ "$(if $(DOWNLOAD_IOS_RUNTIME),$(DOWNLOAD_IOS_RUNTIME),$(IOS_DOWNLOAD_IOS_RUNTIME))" = "1" ]; then \
			echo "No iOS Simulator runtime found. Downloading one through Xcode..."; \
			DEVELOPER_DIR="$$XCODE" "$$XCODE/usr/bin/xcodebuild" -downloadPlatform iOS || { \
				echo "The iOS Simulator runtime download failed." >&2; \
				exit 1; \
			}; \
			RUNTIME=$$("$$SIMCTL" list runtimes available | awk '/iOS/ { print $$NF; exit }'); \
		fi; \
		DEVICE_TYPE=$$("$$SIMCTL" list devicetypes | awk '/^[[:space:]]*iPhone/ { value=$$0; sub(/^.*[(]/, "", value); sub(/[)]$$/, "", value); print value; exit }'); \
		if [ -z "$$RUNTIME" ]; then \
			echo "No iOS Simulator runtime is installed." >&2; \
			exit 1; \
		fi; \
		if [ -z "$$DEVICE_TYPE" ]; then \
			echo "No iPhone Simulator device type is available." >&2; \
			exit 1; \
		fi; \
		echo "Creating Simulator: $(if $(DEVICE_NAME),$(DEVICE_NAME),$(IOS_DEVICE_NAME))"; \
		DEVICE_ID=$$("$$SIMCTL" create "$(if $(DEVICE_NAME),$(DEVICE_NAME),$(IOS_DEVICE_NAME))" "$$DEVICE_TYPE" "$$RUNTIME"); \
	fi; \
	echo "Using Simulator: $$DEVICE_ID"; \
	if [ "$(if $(SHUTDOWN_SIMULATOR),$(SHUTDOWN_SIMULATOR),$(IOS_SHUTDOWN_SIMULATOR))" = "1" ]; then \
		cleanup() { "$$SIMCTL" shutdown "$$DEVICE_ID" >/dev/null 2>&1 || true; }; \
		trap cleanup EXIT; \
	fi; \
	BUILD_CONFIGURATION="$(if $(CONFIGURATION),$(CONFIGURATION),$(IOS_CONFIGURATION))"; \
	APP_PATH="$(if $(DERIVED_DATA),$(DERIVED_DATA),$(IOS_DERIVED_DATA))/Build/Products/$${BUILD_CONFIGURATION}-iphonesimulator/FrontWebView.app"; \
	"/usr/bin/plutil" -replace CFBundleDisplayName -string "$(IOS_APP_NAME)" "ios/FrontWebView/Info.plist"; \
	"$$SIMCTL" boot "$$DEVICE_ID" >/dev/null 2>&1 || true; \
	"$$SIMCTL" bootstatus "$$DEVICE_ID" -b; \
	open -a Simulator >/dev/null 2>&1 || true; \
	sleep 2; \
	DEVELOPER_DIR="$$XCODE" "$$XCODE/usr/bin/xcodebuild" -project "$(PROJECT)" -scheme "$(SCHEME)" -configuration "$$BUILD_CONFIGURATION" -sdk iphonesimulator -destination "id=$$DEVICE_ID" -derivedDataPath "$(if $(DERIVED_DATA),$(DERIVED_DATA),$(IOS_DERIVED_DATA))" CODE_SIGNING_ALLOWED=NO PRODUCT_BUNDLE_IDENTIFIER="$(IOS_BUNDLE_IDENTIFIER)" FRONT_URL="$(if $(URL),$(URL),$(IOS_URL))" build; \
	"$$SIMCTL" install "$$DEVICE_ID" "$$APP_PATH"; \
	if ! "$$SIMCTL" launch "$$DEVICE_ID" "$(IOS_BUNDLE_IDENTIFIER)"; then \
		echo "Simulator app launch was not ready; retrying..."; \
		sleep 2; \
		"$$SIMCTL" launch "$$DEVICE_ID" "$(IOS_BUNDLE_IDENTIFIER)"; \
	fi
