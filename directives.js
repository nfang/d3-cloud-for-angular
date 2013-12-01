var d3 = require('d3');
var format = require('format').format;
var d3Cloud = require('d3-cloud').cloud;
var _ = require('underscore');

require('./module')
.directive('d3Cloud', function () {
  function controller($scope, $timeout, controlPanel, signatureApi) {
    /**
     * Format url of built-in images
     */
    function builtInImage(name) {
      return format('build/rogerz-d3-cloud-for-angular/images/%s', name);
    }

    var opts = $scope.opts = {
      dispSize: [1080, 640],
      imgSize: [64, 32],
      bgImg: require('./images/bg.png'),
      imgLimit: 400,
      blankArea: 0.01,// keep at least 10% blank area
      drawInterval: 2000,
      pollInterval: 1000,
      transPulseWidth: 1,// transition duration / draw interval
      eventId: 118,
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

      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        self.images.push({
          img: img
        });
      };
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
    };

    ImgPool.prototype.getLength = function () {
      return this.images.length;
    };

    var timers = {};
    var imgPool = new ImgPool();
    var stat = opts.stat = {};

    /*
     * rest to ready status
     */
    var reset = opts.reset = function reset() {
      _.each(timers,function (d) {
        $timeout.cancel(d);
      });
      timers = {};
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
      timers.draw = $timeout(step, opts.drawInterval);
    }

    // start cloud layout
    function start() {
      // TODO: fix the ugly callback for image async loading
      var bg = new Image();
      bg.src = opts.bgImg;
      bg.onload = function () {
        cloud.setBgImg({
          img: bg
        });
        cloud.start();
        step();
      };
    }

    // run simulation
    opts.simulate = function simulate() {
      reset();
      imgPool.push(require('./images/1.png'));
      imgPool.push(require('./images/2.png'));
      start();
    };

    // connect to remote server
    opts.connect = function connect() {
      var init = false;
      function poll() {
        if (!init) {
          init = true;
          signatureApi.list(function (data) {
            imgPool.merge(data);
            stat.imgInPool = imgPool.getLength();
          });
        } else {
          signatureApi.update(function (data) {
            imgPool.merge(data);
            stat.imgInPool = imgPool.getLength();
          });
        }
        timers.poll = $timeout(poll, opts.pollInterval);
      }
      reset();
      poll();
      start();
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

      scope.$watchCollection('opts.dispSize', function (value) {
        var svg = sky.selectAll('svg').data([value])
                  .attr('width', function (d) { return d[0];})
                  .attr('height', function (d) { return d[1];});

        svg.enter().append('svg')
        .attr('width', function (d) { return d[0];})
        .attr('height', function (d) { return d[1];});

        svg.exit()
          .remove();

        var offset = [value[0] / 2, value[1] / 2];
        var g = svg.selectAll('g').data([offset])
                .attr('transform', function (d) { return format('translate(%s)', d);});

        g.enter().append('g')
        .attr('transform', function (d) { return format('translate(%s)', d);});

        g.exit().remove();
      });

      scope.draw = function (tags, bounds, d) {
        var g = sky.select('svg').select('g');
        var images = g.selectAll('image')
        .data(tags, function (d) { return d.id;});

        images.exit().transition().duration(opts.transDuration()).style('opacity', 0).remove();

        images.enter().append('svg:image')
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
      };
    }
  };
});