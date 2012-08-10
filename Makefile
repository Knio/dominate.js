
all: pyy.js pyy.min.js

pyy.js: \
	src/pyy.js \
	build/utils.js \
	build/html.js \
	build/tags.js \
	build/io.js \
	build/binding.js \
	build/wrapper.js \
	Makefile

pyy.js:
	cat $(filter %.js,$^) > $@

%.min.js: %.js
	java -jar lib/compiler.jar --js $< > $@


# sudo easy_install http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz
build/%.js: src/%.js
	@cat src/_header.js > $@
	cat $< >> $@
	@cat src/_footer.js >> $@
	@# TODO make this error if there is output
	@# TODO and delete the file so make doesnt thinl it's built
	@-gjslint $@ | grep 'E:[0-9]\{4\}' | grep -v -f lint_ignore


.PHONY: clean
clean:
	-rm build/* -r
