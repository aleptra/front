SHELL := /bin/bash

OUTPUT_CSS = dist/front.css
OUTPUT_CSS_MINI = dist/front.min.css
COPY_JS = dist/front.js
COPY_JS_LIBS = dist/lib/

default:
	cat src/css/*.css > ${OUTPUT_CSS}
	rsync src/js/front.js ${COPY_JS}
	rsync --exclude 'front.js' src/js/* ${COPY_JS_LIBS}

compress: default
	cat ${OUTPUT_CSS} | tr -d "\t\n" | tr -s "[:blank:]" " " > ${OUTPUT_CSS_MINI}

git:
	make
	git add . && git commit -m "Experimental" && git push
serve:
	python -m SimpleHTTPServer 8000

watch:
	@fswatch -r -1 ./src/ | xargs -0 -n 1 -I {} echo "File {} changed" && make && make watch
