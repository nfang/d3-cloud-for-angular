
build: components index.js module.js directives.js panel.html
	@component build --dev -o example/build

components: component.json
	@component install --dev

clean:
	rm -fr example/build components

.PHONY: clean
