function ImgPool (opts) {
  this.images = [];
  this.opts = opts;
};

ImgPool.prototype.random = function () {
  return this.images[Math.floor(Math.random() * this.images.length)];
};

ImgPool.prototype.push = function (image) {
  var self = this;
  var img = new Image();


  img.onload = function () {
    self.images.push({
      img: img
    });
  };

  if(/^https?:\/\//.test(image)) {
    img.crossOrigin = 'Anonymous';
  }
  img.src = image;
  if (this.opts.imgSize) {
    img.width = this.opts.imgSize[0];
    img.height = this.opts.imgSize[1];
  }
};

ImgPool.prototype.merge = function (images) {
  var self = this;
  images.forEach (function (image) {
    self.push(image.href);
  });
};

ImgPool.prototype.reset = function () {
  this.images = [];
};

ImgPool.prototype.total = function () {
  return this.images.length;
};

exports = module.exports = ImgPool;