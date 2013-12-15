module.exports = angular.module('rogerz/d3Cloud', [
  require('signature-api-legacy-for-angular').name
]).config(function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^data:/);
});
