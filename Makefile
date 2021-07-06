SHELL := /bin/bash

OUTPUT_CSS = dist/front.css
OUTPUT_CSS_MINI = dist/front.min.css
COPY_JS = dist/front.js
COPY_JS_LIBS = dist/lib/
COPY_JS_PLUGS = dist/plug/

default:
	cat src/css/*.css > ${OUTPUT_CSS}
	rsync src/js/front.js ${COPY_JS}
	rsync --exclude 'front.js' --exclude 'marketplace/' src/js/lib/* ${COPY_JS_LIBS}
	rsync -r marketplace/plugin/ ${COPY_JS_PLUGS}

compress: default
	cat ${OUTPUT_CSS} | tr -d "\t\n" | tr -s "[:blank:]" " " > ${OUTPUT_CSS_MINI}

git:
	make
	git add . && git commit -m "Experimental" && git push

serve:
	python -m SimpleHTTPServer 8000

watch:
	@fswatch -r -1 ./src/ ./marketplace/ | xargs -0 -n 1 -I {} echo "File {} changed" && make && make watch

release:
	@$(eval FILE="dist/front-$(tag).js")
	@echo -e "\n*----------* \033[33m Push Release to GitHub \033[0m *----------*\n";
	@echo -e "TAG: \033[1;33m$(tag)\033[0m";
	@echo -e "FILE: \033[1;33m$(FILE)\033[0m $(DB_LOCAL_PORT)\n";
	@echo -en "\033[1;33mAre you sure you want to continue?\033[0m \033[1;36m[y/n]\033[0m: " ; \
	read RESPONSE ; \
	if [[ $$RESPONSE = [yY] ]] ; then \
		cp $(COPY_JS) $(FILE) ; \
		sed -r 's/(name="version" content=")[^"]+"/\1'$(tag)'"/g' index.html > index.html~ ; \
		mv index.html~ index.html ; \
		git reset ; \
		git add $(FILE) ; \
	fi;