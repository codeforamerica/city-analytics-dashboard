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
  deviceMinuteIntervalResults: function(result, interval, startDate, endDate) {
    var deviceTypeColumn = 0,
        dateColumn = 1,
        hourColumn = 2,
        minuteColumn = 3
        countColumn = 4;
    var dates = d3.time.minutes(d3.time.minute.offset(startDate,-1), endDate, interval)
    var results = this.deviceDateResult(dates);
    var resultLength = result.length;
    var timeFormatGoogle = d3.time.format('%Y%m%d%H%M%Z');
    var timeZone = "-0400"
    for(var j=0;j<resultLength;j++) {
      var currentResult = result[j];
      var hour = currentResult[hourColumn],
        minute = parseInt(currentResult[minuteColumn]),
        date = currentResult[dateColumn],
        count = parseInt(currentResult[countColumn]);
      var intervalMinute = interval*Math.floor(minute/interval);
      var dateString = date+hour+this.leadingZero(intervalMinute)+timeZone
      var dateInTimeZone = timeFormatGoogle.parse(dateString)
      var resultDate = results[dateInTimeZone]
      if(resultDate) {
        resultDate[currentResult[deviceTypeColumn]] += count;
      }
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
  deviceDateResult: function(dates) {
    var resultsLength = dates.length;
    var results = {};
    for(var i=0;i<resultsLength;i++) {
      d = dates[i];
      results[d] = {"desktop": 0, "mobile": 0, "tablet": 0, date: d };
    }
    return results;
  },
  leadingZero: function(number) {
    s = "0"+number;
    return s.substr(s.length-2)
  },
  arrayFromObject: function(transformObject) {
    var dataArray = new Array;
    for(var o in transformObject) {
        dataArray.push(transformObject[o]);
    }
    return dataArray;
  }
}
