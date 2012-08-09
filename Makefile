
all: pyy.js

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

build/%.js: src/%.js
	mkdir -p build/modules
	cat src/_header.js > $@
	cat $< >> $@
	cat src/_footer.js >> $@

.PHONY: clean
clean:
	-rm build/* -r
