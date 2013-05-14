(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var sparkline = function(el, options){
    var width = options.width || 200,
        height = options.height || 20,
        data = options.data || [],
        svg = d3.select(el)
          .append('svg:svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'sparkline'),
        maxY = d3.max(data),
        maxY = maxY + (maxY * 0.01),
        minY = d3.min(data),
        minY = minY - (minY * 0.01),
        x = d3.scale.linear().domain([0, data.length-1]).range([-(width/data.length), width+(width/data.length)]),
        y = d3.scale.linear().domain([minY, maxY]).range([height, 0]), // flipped so zero is along the bottom
        line = d3.svg.line()
          .interpolate('basis')
          .x(function(d, i) { return x(i); })
          .y(function(d, i) { return y(d); }),
        path = svg.append('svg:path')
          .data([data])
          .attr('d', line);

    return {
      update: function(newData){
        var maxY = d3.max(newData),
            minY = d3.min(newData);
        maxY = maxY + (maxY * 0.01);
        minY = minY - (minY * 0.01);

        x = d3.scale.linear().domain([0, newData.length-1]).range([-(width/newData.length), width+(width/newData.length)]),
        y = d3.scale.linear().domain([minY, maxY]).range([height, 0]);

        svg.selectAll('path')
        .data([newData])
          .attr("transform", "translate(" + x(1) + ")")
          .attr('d', line)
          .transition()
          .duration(500)
          .ease('linear')
          .attr("transform", "translate(" + x(0) + ")");
      }
    }
  }

  root.matrix.sparkline = sparkline;
}).call(this);
