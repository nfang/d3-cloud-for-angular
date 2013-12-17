example/bower: bower.json
	bower install

example/rogerz-d3-cloud-for-angular: example/build/d3-cloud-for-angular
	rm -rf example/rogerz-d3-cloud-for-angular
	cp -R example/build/d3-cloud-for-angular example/rogerz-d3-cloud-for-angular

example: example/bower example/build example/rogerz-d3-cloud-for-angular

example/build: components index.js module.js directives.js panel.html
	@component build -c -o example/build

components: component.json
	@component install --dev

clean:
	rm -fr example/{build,bower,rogerz-d3-cloud-for-angular} components 

.PHONY: clean example
