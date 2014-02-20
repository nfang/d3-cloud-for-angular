module.exports = angular.module('rogerz/d3Cloud', [
  require('signature-api-legacy-for-angular').name
]).config(function ($compileProvider) {
  // the snapshot is created as blob
  $compileProvider.aHrefSanitizationWhitelist(/^blob:/);
  $compileProvider.imgSrcSanitizationWhitelist(/^(blob|http|data):/);
});
