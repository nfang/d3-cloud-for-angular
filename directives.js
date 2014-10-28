var d3 = require('d3');
var format = require('format').format;
var d3Cloud = require('d3-cloud').cloud;
var _ = require('underscore');
var imgPath = 'nfang-d3-cloud-for-angular';
var ImgPool = require('./img-pool.js');

require('./module')
.directive('d3Cloud', function () {
  function controller($scope, $timeout, $window, controlPanel, signatureApi) {
    var opts = $scope.opts = {
      dispSize: [1080, 640],
      imgSize: [64, 32],
      printScale: 2,
      bgColor: 'grey',
      bgImg: imgPath + '/images/bg.png',
      imgLimit: 400,
      eraseRatio: 0.01,// erase x * 100% signatures when place failed
      drawInterval: 2000,
      repeat: false, // repeat existing signatures
      transPulseWidth: 1,// transition duration / draw interval

      /**
       * The duration for which a signature should stay on the screen before
       * transform animation starts.
       * @type {Number}
       */
      pauseDuration: 500,
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
        opts.imgLimit = Math.floor(tags.length * (1 - opts.eraseRatio));
      });
    }

    // TODO: define angular constant
    var cloud;
    var timer;
    var imgPool = new ImgPool();
    var stat = opts.stat = {};

    $scope.$watch('opts.repeat', function () {
      imgPool.option(_.pick(opts, 'repeat'));
    });
    $scope.$watchCollection('opts.imgSize', function () {
      imgPool.option(_.pick(opts, 'imgSize'));
    });

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
      signatureApi.reset();
      stat = opts.stat = {
        imgFailed: 0,
        imgPlaced: 0,
        imgTotal: 0,
        apiError: 0
      };
    };

    function step() {
      if (stat.imgPlaced > opts.imgLimit) {
        cloud.removeImg(stat.imgPlaced - opts.imgLimit);
      } else {
        cloud.addImg(imgPool.next());
      }
      timer = $timeout(step, opts.drawInterval);
    }

    // start cloud layout
    function start() {
      // auto fit to window size
      opts.dispSize = [
        $window.innerWidth,
        $window.innerHeight
      ];
      $scope.init();
      cloud = $scope.cloud = d3Cloud().size(opts.dispSize)
                   .spiral('rectangular')
                   .startPos('point')
                   .timeInterval(10)
                   .on('placed', update)
                   .on('failed', failed)
                   .on('erased', function (tags) {stat.imgPlaced = tags.length;});

      stat.stat = "playing";
      // TODO: fix the ugly callback for image async loading
      var bg = new Image();
      bg.src = opts.bgImg;
      bg.onload = function () {
        cloud.setBgImg({
          img: bg,
          color: opts.bgColor
        });
        cloud.start();
        step();
      };
    }

    // run simulation
    opts.simulate = function simulate() {
      reset();
      var images = _.range(1,3).map(function (d) {
        return format('%s/images/%d.png', imgPath, d);
      });
      imgPool.add(images);
      start();
    };

    // connect to remote server
    opts.connect = function connect() {
      reset();
      signatureApi
      .on('data', function (data) {
        var images = _.map(data, function (d) {
          return d.href;
        });
        imgPool.add(images);
        stat.imgTotal = imgPool.total();
      })
      .on('error', function () {
        stat.apiError ++;
      });
      signatureApi.poll();
      start();
    };

    opts.selectBg = function (files) {
      var file = files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        $scope.$apply(function () {
          opts.bgImg = e.target.result;
        });
      };
      reader.readAsDataURL(file);
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
      var size = {};

      scope.init = function () {
        size = {
          width: opts.dispSize[0],
          height: opts.dispSize[1]
        };
        var svg = sky.selectAll('svg').data([size]);
       svg.enter().append('svg').attr({
                    'xmlns': 'http://www.w3.org/2000/svg',
                    'xmlns:xmlns:xlink': 'http://www.w3.org/1999/xlink', // hack: doubling xmlns: so it doesn't disappear once in the DOM
                    'version': '1.1'
                });

        svg.attr('width', function (d) { return d.width;})
        .attr('height', function (d) { return d.height;})
        .style('background', opts.bgColor);

        svg.exit().remove();

        var offset = [size.width / 2, size.height / 2];
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
          .attr('transform', format('scale(%f)', size.width / d.img.width))
        .transition()
          .delay(opts.pauseDuration)
          .duration(opts.transDuration())
          .attr('transform', function(d) {
            return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
          });

        images.exit().transition().duration(opts.transDuration()).style('opacity', 0).remove();
      };

      scope.print = function () {
        var print = sky.selectAll('canvas').data(sky.selectAll('svg')[0]);

        print.enter().append('canvas').style('display', 'none');
        var width = size.width * opts.printScale,
            height = size.height * opts.printScale;
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
