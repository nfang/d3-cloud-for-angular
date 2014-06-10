'use strict';
var _ = require('underscore');

function ImgPool (opts) {
  this.queue = [];
  this.pool = [];
  this.opts = opts || {
    repeat: false,
    imgSize: [64, 32]
  };
}

ImgPool.prototype.option = function (opts) {
  this.opts = _.extend(this.opts, opts);
};

// Pick a random image from pool
ImgPool.prototype.random = function () {
  var pool = this.pool;
  if (pool.length) {
    return this.pool[Math.floor(Math.random() * pool.length)];
  } else {
    return null;
  }
};

ImgPool.prototype.addBySrc = function (imgSrc) {
  var self = this;
  var img = new Image();

  img.onload = function () {
    self.queue.push({
      img: img
    });
  };

  if(/^https?:\/\//.test(imgSrc)) {
    img.crossOrigin = 'Anonymous';
  }
  img.src = imgSrc;
  if (this.opts.imgSize) {
    img.width = this.opts.imgSize[0];
    img.height = this.opts.imgSize[1];
  }
};

ImgPool.prototype.next = function () {
  var queue = this.queue,
      obj = null;

  if (this.queue.length) {
    obj = queue.shift();
    this.pool.push(obj);
  } else if (this.opts.repeat){
    obj = this.random();
  }

  return obj;
};

ImgPool.prototype.add = function (images) {
  var self = this;
  images.forEach (function (image) {
    self.addBySrc(image);
  });
};

ImgPool.prototype.reset = function () {
  this.pool = [];
  this.queue = [];
};

ImgPool.prototype.total = function () {
  return this.pool.length + this.queue.length;
};

exports = module.exports = ImgPool;
