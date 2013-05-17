(function(){
  "use strict";
  var root = this,
      $ = root.jQuery;

  if(typeof root.matrix === 'undefined'){ root.matrix = {}; }

  var makeScales = function(data, width, height) {
    var maxY = d3.max(data),
        minY = d3.min(data);

    maxY = maxY + (maxY * 0.01);
    minY = minY - (minY * 0.01);

    var x = d3.scale.linear().domain([0, data.length-1]).range([-(width/data.length), width+(width/data.length)]),
        y = d3.scale.linear().domain([minY, maxY]).range([height, 0]);

    return {x: x, y: y};
  };

  var sparkline = function(el, options){
    var width = options.width || 200,
        height = options.height || 20,
        data = options.data || [],
        svg = d3.select(el)
          .append('svg:svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'sparkline'),
        scale = makeScales(data, width, height),
        line = d3.svg.line()
          .interpolate('basis')
          .x(function(d, i) { return scale.x(i); })
          .y(function(d, i) { return scale.y(d); }),
        path = svg.append('svg:path')
          .data([data])
          .attr('d', line);

    return {
      update: function(newData){
        scale = makeScales(newData, width, height);
        svg.selectAll('path')
        .data([newData])
          .attr("transform", "translate(" + scale.x(1) + ")")
          .attr('d', line)
          .transition()
          .duration(500)
          .ease('linear')
          .attr("transform", "translate(" + scale.x(0) + ")");
      }
    };
  };

  root.matrix.sparkline = sparkline;
}).call(this);
