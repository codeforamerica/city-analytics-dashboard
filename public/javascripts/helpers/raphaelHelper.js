window.raphaelHelper = function() {
  var chart, options, elementHeight, data, yPos;
  function raphael(chart_) {
    chart = chart_;
    options = chart.options;
    data = chart.data;
    yPos = chart.elementHeight - options.padding;
  }
  raphael.redrawAllLabels = function() {
    var i, row, date,
    dataLength = data.length;
    for(i=0;i<dataLength;i++) {
      row = data[dataLength - 1 - i];
      date = row.src.date;
      if(raphael.shouldDrawLabelForDate(date)) {
        raphael.drawLabel(row._x, yPos, raphael.labelFormat(date));
      }
    }
  }
  raphael.labelFormat = function(date) {
    var label = timeFormat.format("%-I %p")(date);
    if(date.getHours() === 0) {
      label = timeFormat.format("%a %-I %p")(date);
    }
    return label;
  }
  raphael.shouldDrawLabelForDate = function(date) {
    return (date.getHours() % 6 === 0 && date.getMinutes() === 0);
  }
  raphael.drawLabel = function(x,y,text) {
    chart.raphael.text(x, y, text)
    .attr('font-size', options.gridTextSize)
    .attr('font-family', options.gridTextFamily)
    .attr('font-weight', options.gridTextWeight)
    .attr('fill', options.gridTextColor)
  }
  return raphael;
}
