var d3 = require('d3');
var format = require('format').format;
var d3Cloud = require('d3-cloud').cloud;
var _ = require('underscore');
var imgPath = 'rogerz-d3-cloud-for-angular';

require('./module')
.directive('d3Cloud', function () {
  function controller($scope, $timeout, controlPanel, signatureApi) {
    var opts = $scope.opts = {
      dispSize: [1080, 640],
      imgSize: [64, 32],
      printScale: 2,
      bgColor: 'black',
      bgImg: imgPath + '/images/bg.png',
      imgLimit: 400,
      blankArea: 0.01,// keep at least 10% blank area
      drawInterval: 2000,
      transPulseWidth: 1,// transition duration / draw interval
      transDuration: function () {return opts.drawInterval * opts.transPulseWidth;}
    };

    function update(tags, bounds, d) {
      // TODO: remove wrap
      $scope.draw(tags, bounds, d);
      stat.imgPlaced = tags.length;
    }

    function failed(tags) {
      stat.imgFailed++;
      $scope.$apply(function () {
        opts.imgLimit = Math.floor(tags.length * (1 - opts.blankArea));
      });
    }

    // TODO: define angular constant
    var cloud = $scope.cloud = d3Cloud().size(opts.dispSize)
                   .spiral('rectangular')
                   .startPos('point')
                   .timeInterval(10)
                   .on('placed', update)
                   .on('failed', failed)
                   .on('erased', function (tags) {stat.imgPlaced = tags.length;});


    function ImgPool() {
      this.images = [];
    }

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
      img.width = opts.imgSize[0];
      img.height = opts.imgSize[1];
    };

    ImgPool.prototype.merge = function (images) {
      var self = this;
      images.forEach (function (image) {
        self.push(image.href);
      });
    };

    ImgPool.prototype.reset = function () {
      this.images = [];
      signatureApi.reset();
    };

    ImgPool.prototype.getLength = function () {
      return this.images.length;
    };

    var timer;
    var imgPool = new ImgPool();
    var stat = opts.stat = {};

    var pause = opts.pause = function pause() {
      stat.stat = "paused";
      $timeout.cancel(timer);
    }

    var resume = opts.resume = function resume() {
      stat.stat = "playing";
      step();
    }

    /*
     * rest to ready status
     */
    var reset = opts.reset = function reset() {
      pause();
      imgPool.reset();
      stat = opts.stat = {
        imgFailed: 0,
        imgPlaced: 0,
        imgInPool: 0
      };
    };

    function step() {
      if (stat.imgPlaced > opts.imgLimit) {
        cloud.removeImg(stat.imgPlaced - opts.imgLimit);
      } else if (imgPool.getLength()) {
        cloud.addImg(imgPool.random());
      }
      timer = $timeout(step, opts.drawInterval);
    }

    // start cloud layout
    function start() {
      $scope.init();
      stat.stat = "playing";
      // TODO: fix the ugly callback for image async loading
      var bg = new Image();
      bg.src = opts.bgImg;
      bg.onload = function () {
        cloud.setBgImg({
          img: bg,
          color: opts.bgColorqq
        });
        cloud.start();
        step();
      };
    }

    // run simulation
    opts.simulate = function simulate() {
      reset();
      imgPool.push(imgPath + '/images/1.png');
      imgPool.push(imgPath + '/images/2.png');
      start();
    };

    // connect to remote server
    opts.connect = function connect() {
      reset();
      signatureApi.on('data', function (data) {
        imgPool.merge(data);
        stat.imgInPool = imgPool.getLength();
      });
      signatureApi.poll();
      start();
    };

    opts.print = function () {
      $scope.print();
    };

    controlPanel.add('cloud', 'glyphicon-th', require('./panel.html'), opts);
  }

  return {
    controller: controller,
    scope: {},
    restrict: 'E',
    link: function (scope, elem) {
      var sky = d3.select(elem[0]);// cloud must be in the sky :)
      var opts = scope.opts;

      scope.init = function () {
        var dispSize = opts.dispSize;
        var svg = sky.selectAll('svg').data([dispSize]);

        svg.enter().append('svg').attr({
                    'xmlns': 'http://www.w3.org/2000/svg',
                    'xmlns:xmlns:xlink': 'http://www.w3.org/1999/xlink', // hack: doubling xmlns: so it doesn't disappear once in the DOM
                    'version': '1.1'
                });

        svg.attr('width', function (d) { return d[0];})
        .attr('height', function (d) { return d[1];})
        .style('background', opts.bgColor);

        svg.exit().remove();

        var offset = [dispSize[0] / 2, dispSize[1] / 2];
        var g = svg.selectAll('g').data([offset])
                .attr('transform', function (d) { return format('translate(%s)', d);});

        g.enter().append('g')
        .attr('transform', function (d) { return format('translate(%s)', d);});

        g.exit().remove();
      };

      scope.draw = function (tags, bounds, d) {
        var g = sky.select('svg').select('g');
        var images = g.selectAll('image')
        .data(tags, function (d) { return d.id;});

        images.enter()
        .append('svg:image')
          .attr('xlink:href', function (d) { return d.img.src;})
          .attr('x', function (d) { return -d.img.width / 2;})
          .attr('y', function (d) { return -d.img.height / 2;})
          .attr('width', function (d) { return d.img.width;})
          .attr('height', function (d) { return d.img.height;})
          .attr('transform', format('scale(%f)', opts.dispSize[0] / d.img.width))
        .transition().duration(opts.transDuration())
          .attr('transform', function(d) {
            return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
          });

        images.exit().transition().duration(opts.transDuration()).style('opacity', 0).remove();
      };

      scope.print = function () {
        var print = sky.selectAll('canvas').data(sky.selectAll('svg')[0]);

        print.enter().append('canvas').style('display', 'none');
        var width = opts.dispSize[0] * opts.printScale,
            height = opts.dispSize[1] * opts.printScale;
        print
        .attr('width', width)
        .attr('height', height)
        .each(function (svg) {
          var canvas = this;
          // http://svgopen.org/2010/papers/62-From_SVG_to_Canvas_and_Back/
          var svg_xml = (new XMLSerializer()).serializeToString(svg);
          var ctx = this.getContext('2d');
          var img = new Image();
          img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
          img.onload = function () {
            // http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
            // Store the current transformation matrix
            ctx.save();

            // Use the identity matrix while clearing the canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Restore the transform
            ctx.restore();
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(function (blob) {
              var url = URL.createObjectURL(blob);
              scope.$apply(function () {
                opts.snapshot = url;
              });
            });
          }
        });
      }
    }
  };
});
