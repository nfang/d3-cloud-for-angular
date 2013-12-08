
build: components index.js module.js directives.js panel.html
	@component build --use component-data-uri --dev -o example

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
