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

  var sparklineGraph = function(el, options){
    var width = options.width || 600,
        height = options.height || 120,
        padding = options.padding || 20,
        data = options.data || [],
        slOptions = {
          width: width - padding,
          height: height - padding,
          data: data
        },
        svg = d3.select(el).append('svg:svg')
          .attr('width', width)
          .attr('height', height),
        sl = svg.append('svg:svg')
          .attr('x', padding)
          .attr('clip-path', 'url(#clip)'),
        slObj = sparkline(sl[0][0], slOptions);

    svg.append('svg:clipPath')
      .attr('id', 'clip')
    .append('svg:rect')
      .attr('x', padding)
      .attr('y', '0')
      .attr('width', width - padding)
      .attr('height', height - padding);

    var scale = makeScales(data, width - padding, height - padding);

    // Not sure I really understand why the range of the x-axis is set as it is
    // by makeScales, but modifying it to something more sensible here.
    scale.x.range([0, width]);

    var xAxis = d3.svg.axis().scale(scale.x).ticks(0).tickSize(0),
        yAxis = d3.svg.axis().scale(scale.y).ticks(0).tickSize(0).orient('left');

    svg.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + padding + ',' + (height - padding) + ')')
      .call(xAxis);

    svg.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + padding + ',0)')
      .call(yAxis);

    var xLab = svg.append('text')
          .attr('class', 'x label')
          .attr('text-anchor', 'end')
          .attr('x', width)
          .attr('y', height)
          .text('last 1h'),
        yLab = svg.append('text')
          .attr('class', 'y label')
          .attr('x', 0)
          .attr('y', 0)
          .attr('transform', 'rotate(90)')
          .text(d3.format(',')(d3.max(data)));

    return {
      update: function(newData){
        slObj.update(newData);
        yLab.text(d3.format(',')(d3.max(data)));
      }
    };
  };

  root.matrix.sparkline = sparkline;
  root.matrix.sparklineGraph = sparklineGraph;
}).call(this);
