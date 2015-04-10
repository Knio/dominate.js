
all: dominate.js dominate.min.js

dominate.js: \
	src/dominate.js \
	build/utils.js \
	build/format.js \
	build/event.js \
	build/html.js \
	build/tags.js \
	build/io.js \
	build/binding.js \
	build/wrapper.js \
	build/api.js \
	Makefile

dominate.js:
	cat $(filter %.js,$^) > $@

%.min.js: %.js
	java -Xmx64m -XX:MaxPermSize=32m -jar lib/compiler.jar --js $< > $@


build/%.js: src/%.js
	@cat src/_header.js > $@
	cat $< >> $@
	@cat src/_footer.js >> $@
	@gjslint $@ | grep 'E:[0-9]\{4\}' \
		| grep -v -f lint_ignore  \
		| python -c 'import sys;l=list(sys.stdin);map(sys.stdout.write,l);sys.exit(bool(l))'


clean:
	-rm build/* -r
	-rm dominate.js dominate.min.js


.PHONY: clean
.DELETE_ON_ERROR:

depends:
	sudo easy_install http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz
	sudo apt-get install openjdk-7-jdk
