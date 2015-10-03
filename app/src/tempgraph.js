/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;


  kj.module.directive('temperatureGraph', function($window, temperatureService, voiceService) {

    function link(scope, element) {
      var margin = {top: 24, right: 24, bottom: 24, left: 56},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .ticks(d3.time.minutes, 5);

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.temperature); })
          .interpolate('cardinal');

      var svg = d3.select(element[0]).select("#chartView").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      function leastSquares(xSeries, ySeries) {
        var reduceSumFunc = function(prev, cur) { return prev + cur; };

        var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
        var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

        var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
            .reduce(reduceSumFunc);

        var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
            .reduce(reduceSumFunc);

        var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
            .reduce(reduceSumFunc);

        var slope = ssXY / ssXX;
        var intercept = yBar - (xBar * slope);
        var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

        return [slope, intercept, rSquare];
      }

      var first = false;
      function loadAndDraw(voiceModel) {
        temperatureService.getLatestMeasurements().then(function(measurements) {
          var upperLimit = parseFloat(scope.upperLimit);
          var yExtent = d3.extent(measurements, function(d) { return d.temperature; });
          if (!first) {
            if (yExtent[1] > upperLimit) {
              voiceService.play('Yes, it is ready. Current temperature is: ' + yExtent[1] + ' celsius.', voiceModel);
            } else {
              var xSeries = measurements.map(function(d) {return d.date.getTime()});
              var ySeries = measurements.map(function(d) {return d.temperature});

              var ls = leastSquares(xSeries, ySeries);
              var targetTime = (upperLimit - ls[1])/ls[0];
              voiceService.play('No, it is not ready yet. Current temperature is: ' + yExtent[1] + ' celsius.' + ' It will be ready in ' + moment.duration(targetTime - Date.now(), 'milliseconds').humanize(), voiceModel);
            }

          }
          yExtent[1] = Math.max(upperLimit, yExtent[1]);
          first = true;
          x.domain(d3.extent(measurements, function(d) { return d.date; }));
          y.domain(yExtent);

          d3.select(element[0]).select("#chartView").select("svg").remove();
          svg = d3.select(element[0]).select("#chartView").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("T (\u2103)");

          svg.append("path")
              .datum(measurements)
              .attr("class", "line")
              .attr("d", line);
          $window.setTimeout(loadAndDraw, 5000);
        })
      }
      scope.$watch('voiceModel', loadAndDraw);
    }

    return {
      restrict: 'E',
      template: '<div id="chartView"></div>',
      scope: {
        upperLimit: '@',
        voiceModel: '@'
      },
      link: link
    };
  });
})();