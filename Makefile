SHELL := /bin/bash
ARGS = $(filter-out $@,$(MAKECMDGOALS))

SERVE_PORT = 8081
SERVE_DIR = $$PWD

BIN_PHP = $(shell which php)
BIN_PYTHON2 = $(shell which python)
BIN_PYTHON3 = $(shell which python3)

USE_PORT=$(or $(PORT),$(SERVE_PORT))
SERVE_ACTIVE_PORT=$(shell lsof -t -i:$(USE_PORT))

OUTPUT_CSS = dist/front.css
OUTPUT_CSS_MINI = dist/front.min.css
COPY_JS = dist/front.js
COPY_JS_LIBS = dist/lib/
COPY_JS_PLUGS = dist/plug/
BOILERPLATE = $$HOME/front/

CYPRESS_DIR = test/cypress/
CYPRESS_SERVE_PORT = 3030
CYPRESS_ARGS = -P test -C cypress/cypress.config.js

default:
	@echo "[ Copying and merging CSS files ] ..."
	@cat src/css/*.css > ${OUTPUT_CSS}
	@echo "[ Copying JS files ] ..."
	@rsync src/js/front.js ${COPY_JS}
	@rsync --exclude 'front.js' --exclude src/js/lib/* ${COPY_JS_LIBS}
	@echo "[ Removing comments ] ..."
	@sed -i '' -e '/^[[:space:]]*\*\//d' -e '/^[[:space:]]*\/\*\*/d' -e '/^[[:space:]]*\*/d' ${COPY_JS}
	@sed -i '' -e '/^[[:space:]]*\/\/[:space:]*/d' ${COPY_JS}

compress: default
	cat ${OUTPUT_CSS} | tr -d "\t\n" | tr -s "[:blank:]" " " > ${OUTPUT_CSS_MINI}

.PHONY: test
test:
	@make serve PORT=$(CYPRESS_SERVE_PORT)
	@cp -fr src/* ${CYPRESS_DIR}fixtures
	@echo -en '\n\nexport { core, app, dom, socket, client }' >> ${CYPRESS_DIR}fixtures/js/front.js
	@if [ $(ARGS) ] && [ $(ARGS) == "headed" ] ; then \
		cypress open $(CYPRESS_ARGS) ; \
	else \
		cypress run $(CYPRESS_ARGS) ; \
	fi;

git:
	make
	git add . && git commit -m "Experimental" && git push

serve:
	@if [ $(SERVE_ACTIVE_PORT) ] ; then \
		kill -9 $(SERVE_ACTIVE_PORT) ; \
	fi;

	@if [ $(BIN_PYTHON3) ] ; then \
		python3 -m http.server -d $(SERVE_DIR) $(USE_PORT) & \
	elif [ $(BIN_PYTHON2) ] ; then \
		python -m SimpleHTTPServer -d $(SERVE_DIR) $(USE_PORT) & \
	elif [ $(BIN_PHP) ] ; then \
		php -S localhost:$(USE_PORT) -t $(SERVE_DIR) & \
	fi;

watch:
	@fswatch -r -1 ./src/ ./marketplace/ | xargs -0 -n 1 -I {} echo "File {} changed" && make && make watch

git%release:
	@$(eval JS_FILE="dist/front-$(tag).js")
	@echo -e "\n*----------* \033[33m Push Release to GitHub \033[0m *----------*\n";
	@echo -e "TAG: \033[1;33m$(tag)\033[0m";
	@echo -e "FILE: \033[1;33m$(JS_FILE)\033[0m\n";
	@echo -en "\033[1;33mAre you sure you want to continue?\033[0m \033[1;36m[y/n]\033[0m: " ; \
	read RESPONSE ; \
	if [[ $$RESPONSE = [yY] ]] ; then \
		cp $(COPY_JS) $(JS_FILE) ; \
		sed -r 's/(name="version" content=")[^"]+"/\1'$(tag)'"/g' index.html > index.html~ ; \
		mv index.html~ index.html ; \
		git reset ; \
		git add $(JS_FILE) ; \
		git add index.html ; \
		git commit -m "Alpha Release ($(tag))" ; \
		git status ; \
	fi;

#: Revert to specific commit hash and push to master.
git%revert:
	@echo -en "\033[1;33mEnter commit hash\033[0m: " ; \
	read HASH ; \
	git reset --hard $$HASH ; \
	echo -en "\033[1;33mAre you sure you want to continue?\033[0m \033[1;36m[y/n]\033[0m: " ; \
	read RESPONSE ; \
	if [[ $$RESPONSE = [yY] ]] ; then \
		git push origin master -f ; \
	else \
		git reset --hard HEAD~1 ; \
		git pull ; \
		exit 0 ; \
	fi;

#: Create a new project from a boilerplate.
app%create:
	@echo -e "\n*----------* \033[33m Create app \033[0m *----------*\n";
	@echo -en "Name of project: " ; \
	read NAME ; \
	echo -en "Install in $(BOILERPLATE)$$NAME ?\033[0m \033[1;36m[y/n]\033[0m: " ; \
	read RESPONSE ; \
	if [[ $$RESPONSE = [yY] ]] ; then \
		mkdir -p $(BOILERPLATE)$$NAME ; \
		cp -r assets/boilerplate/ $(BOILERPLATE)$$NAME && echo -e '\033[33mBoilerplate project created\033[0m'; \
	else \
		exit 0 ; \
	fi; \
	make app:start DIR=$(BOILERPLATE)$$NAME ; \

#: Open an existing project.
app%open:
	@echo -e "\n*----------* \033[33m Open app \033[0m *----------*\n";
	@ls -1 $(BOILERPLATE) ; \
	echo ; \
	echo -en "Name of project: " ; \
	read NAME ; \
	make app:start DIR=$(BOILERPLATE)$$NAME; \

app%start:
	@echo -en "Start application ?\033[0m \033[1;36m[y/n]\033[0m: " ; \
	read RESPONSE ; \
	if [[ $$RESPONSE = [yY] ]] ; then \
		open -a 'Visual Studio Code' $(DIR) --fresh ; \
		make serve SERVE_DIR=$(DIR) \
		| open -a 'Google Chrome' http://localhost:$(SERVE_PORT) ; \
	else \
		exit 0 ; \
	fi; \

#: This help.
help:
	@grep -B1 -E "^[%a-zA-Z0-9_-]+\:([^\=]|$$)" Makefile \
	| grep -v -- -- \
	| sed 's/%/:/g' \
	| sed 'N;s/\n/###/' \
	| sed -n 's/^#: \(.*\)###\(.*\):.*/\2###\1/p' \
	| column -t -s '###' \

%:
	@:
