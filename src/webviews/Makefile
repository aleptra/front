SHELL := /bin/bash

PROJECT := ios/FrontWebView.xcodeproj
SCHEME := FrontWebView
BUNDLE_ID := com.front.webviewpoc
DERIVED_DATA := ../.build/ios
DEVICE_NAME ?= Front iPhone
URL ?=
export FRONT_URL := $(URL)
XCODE_DEVELOPER_DIR ?=
DOWNLOAD_IOS_RUNTIME ?= 1

.PHONY: ios doctor clean

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
		echo "Full Xcode with iOS Simulator tools was not found."; \
		echo "Install Xcode, or set XCODE_DEVELOPER_DIR to its Contents/Developer path."; \
		exit 1; \
	fi; \
	echo "Using Xcode: $$XCODE"; \
	if ! "$$XCODE/usr/bin/xcodebuild" -checkFirstLaunchStatus >/dev/null 2>&1; then \
		echo "Running Xcode first-launch setup..."; \
		"$$XCODE/usr/bin/xcodebuild" -runFirstLaunch || { \
			echo "Xcode setup needs permission. Run: sudo $$XCODE/usr/bin/xcodebuild -runFirstLaunch"; \
			exit 1; \
		}; \
	fi; \
	SIMCTL="$$XCODE/usr/bin/simctl"; \
	DEVICE_ID=$$("$$SIMCTL" list devices available | awk -F '[()]' '/iPhone/ { print $$2; exit }'); \
	if [ -z "$$DEVICE_ID" ]; then \
		RUNTIME=$$("$$SIMCTL" list runtimes available | awk '/iOS/ { print $$NF; exit }'); \
		if [ -z "$$RUNTIME" ] && [ "$(DOWNLOAD_IOS_RUNTIME)" = "1" ]; then \
			echo "No iOS Simulator runtime found. Downloading one through Xcode..."; \
			DEVELOPER_DIR="$$XCODE" "$$XCODE/usr/bin/xcodebuild" -downloadPlatform iOS || { \
				echo "The iOS Simulator runtime download failed."; \
				exit 1; \
			}; \
			RUNTIME=$$("$$SIMCTL" list runtimes available | awk '/iOS/ { print $$NF; exit }'); \
		fi; \
		DEVICE_TYPE=$$("$$SIMCTL" list devicetypes | awk '/^[[:space:]]*iPhone/ { value=$$0; sub(/^.*[(]/, "", value); sub(/[)]$$/, "", value); print value; exit }'); \
		if [ -z "$$RUNTIME" ]; then \
			echo "No iOS Simulator runtime is installed."; \
			echo "Install an iOS Simulator runtime from Xcode > Settings > Components, or set DOWNLOAD_IOS_RUNTIME=1."; \
			exit 1; \
		fi; \
		if [ -z "$$DEVICE_TYPE" ]; then \
			echo "No iPhone Simulator device type is available."; \
			exit 1; \
		fi; \
		echo "Creating Simulator: $(DEVICE_NAME)"; \
		DEVICE_ID=$$("$$SIMCTL" create "$(DEVICE_NAME)" "$$DEVICE_TYPE" "$$RUNTIME"); \
	fi; \
	echo "Using Simulator: $$DEVICE_ID"; \
	cleanup() { "$$SIMCTL" shutdown "$$DEVICE_ID" >/dev/null 2>&1 || true; }; \
	trap cleanup EXIT; \
	"$$SIMCTL" boot "$$DEVICE_ID" >/dev/null 2>&1 || true; \
	"$$SIMCTL" bootstatus "$$DEVICE_ID" -b; \
	open -a Simulator; \
	DEVELOPER_DIR="$$XCODE" "$$XCODE/usr/bin/xcodebuild" -project "$(PROJECT)" -scheme "$(SCHEME)" -configuration Debug -sdk iphonesimulator -destination "id=$$DEVICE_ID" -derivedDataPath "$(DERIVED_DATA)" CODE_SIGNING_ALLOWED=NO FRONT_URL="$$FRONT_URL" build; \
	"$$SIMCTL" install "$$DEVICE_ID" "$(DERIVED_DATA)/Build/Products/Debug-iphonesimulator/FrontWebView.app"; \
	"$$SIMCTL" launch "$$DEVICE_ID" "$(BUNDLE_ID)"

clean:
	rm -rf "$(DERIVED_DATA)"

doctor:
	@set -u; \
	XCODE="$(XCODE_DEVELOPER_DIR)"; \
	if [ -z "$$XCODE" ]; then \
		for candidate in /Applications/Xcode*.app/Contents/Developer "$$(xcode-select -p 2>/dev/null || true)"; do \
			if [ -x "$$candidate/usr/bin/xcodebuild" ] && [ -x "$$candidate/usr/bin/simctl" ]; then \
				XCODE="$$candidate"; \
				break; \
			fi; \
		done; \
	fi; \
	status=0; \
	if [ -z "$$XCODE" ]; then \
		echo "[FAIL] Full Xcode with iOS Simulator tools: not found"; \
		echo "       Install Xcode or set XCODE_DEVELOPER_DIR=/path/Xcode.app/Contents/Developer"; \
		exit 1; \
	fi; \
	echo "[ OK ] Xcode: $$XCODE"; \
	"$$XCODE/usr/bin/xcodebuild" -version; \
	if "$$XCODE/usr/bin/xcodebuild" -checkFirstLaunchStatus >/dev/null 2>&1; then \
		echo "[ OK ] Xcode first-launch setup"; \
	else \
		echo "[WARN] Xcode first-launch setup is required"; \
		echo "       Run: sudo $$XCODE/usr/bin/xcodebuild -runFirstLaunch"; \
		status=1; \
	fi; \
	SIMCTL="$$XCODE/usr/bin/simctl"; \
	if [ -x "$$SIMCTL" ]; then \
		echo "[ OK ] simctl: $$SIMCTL"; \
	else \
		echo "[FAIL] simctl: not found"; \
		status=1; \
	fi; \
	echo "iOS runtimes:"; \
	if ! "$$SIMCTL" list runtimes available | awk '/iOS/ { found=1; print "  " $$0 } END { exit found ? 0 : 1 }'; then \
		echo "  none found"; \
		echo "  Install one from Xcode > Settings > Components/Platforms."; \
		status=1; \
	fi; \
	echo "iPhone devices:"; \
	if ! "$$SIMCTL" list devices available | awk -F '[()]' '/iPhone/ { found=1; print "  " $$1 "(" $$2 ")" } END { exit found ? 0 : 1 }'; then \
		echo "  none found; make ios will create one when an iOS runtime exists."; \
	fi; \
	if [ "$$status" -eq 0 ]; then echo "Doctor passed. Run: make ios"; else echo "Doctor found issues. Fix the items marked FAIL/WARN."; fi; \
	exit $$status
