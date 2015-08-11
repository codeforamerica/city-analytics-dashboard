window.helper = {
  deviceHourResults: function(result) {
    var resultsLength = 24;
    var results = this.deviceResult(resultsLength);
    var resultLength = result.length;
    for(var j=0;j<resultLength;j++) {
      var currentResult = result[j],
        deviceTypeColumn = 0,
        hourColumn = 1,
        countColumn = 2;
      var hour = parseInt(currentResult[hourColumn]),
        count = parseInt(currentResult[countColumn]);
      results[currentResult[deviceTypeColumn]][hour] = count;
    }
    return results;
  },
  deviceMinuteInterval: function(result, interval) {
    var resultsLength = Math.round(60/interval*24);
    var results = this.deviceResult(resultsLength);
    var resultLength = result.length;
    for(var j=0;j<resultLength;j++) {
      var currentResult = result[j],
        deviceTypeColumn = 0,
        hourColumn = 1,
        minuteColumn = 2
        countColumn = 3;
      var hour = parseInt(currentResult[hourColumn]),
        minute = parseInt(currentResult[minuteColumn]),
        count = parseInt(currentResult[countColumn]);
      var column = (hour*60/interval)+Math.floor(minute/interval);
      results[currentResult[deviceTypeColumn]][column] += count;
    }
    return results;
  },
  deviceResult: function(resultsLength) {
    var results = {"desktop": new Array(resultsLength), "mobile": new Array(resultsLength)};
    for(var i=0;i<resultsLength;i++) {
      results.desktop[i] = 0;
      results.mobile[i] = 0;
    }
    return results;
  },
  leadingZero: function(number) {
    s = "0"+number;
    return s.substr(s.length-2)
  }
}
