/*
 * Based on: JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
  var date = stamp.fromISOString(time),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      day_diff = Math.floor(diff / 86400);
      
  if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 ) {
    if ( day_diff < 0 ){
      return 'the future';
    } else {
      return 'ages ago';
    }
  }

  return day_diff == 0 && (
      diff < 60 && "just now" ||
      diff < 120 && "1 minute ago" ||
      diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
      diff < 7200 && "1 hour ago" ||
      diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
    day_diff == 1 && "Yesterday" ||
    day_diff < 7 && day_diff + " days ago" ||
    day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}

// If jQuery is included in the page, adds a jQuery plugin to handle it as well
if ( typeof jQuery != "undefined" ) {
  jQuery.fn.prettyDate = function(){
    return this.each(function(){
      var date = prettyDate(this.title);
      if ( date )
        jQuery(this).text( date );
    });
  };
}

/*
  Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
  Available via Academic Free License >= 2.1 OR the modified BSD license.
  see: http://dojotoolkit.org/license for details
*/
// http://svn.dojotoolkit.org/src/dojo/trunk/date/stamp.js

var stamp = {};
stamp.fromISOString = function(formattedString){
  // summary:
  //    Returns a Date object given a string formatted according to a subset of the ISO-8601 standard.
  //
  // description:
  //    Accepts a string formatted according to a profile of ISO8601 as defined by
  //    [RFC3339](http://www.ietf.org/rfc/rfc3339.txt), except that partial input is allowed.
  //    Can also process dates as specified [by the W3C](http://www.w3.org/TR/NOTE-datetime)
  //    The following combinations are valid:
  //
  //    - dates only
  //      - yyyy
  //      - yyyy-MM
  //      - yyyy-MM-dd
  //    - times only, with an optional time zone appended
  //      - THH:mm
  //      - THH:mm:ss
  //      - THH:mm:ss.SSS
  //    - and "datetimes" which could be any combination of the above
  //
  //    timezones may be specified as Z (for UTC) or +/- followed by a time expression HH:mm
  //    Assumes the local time zone if not specified.  Does not validate.  Improperly formatted
  //    input may return null.  Arguments which are out of bounds will be handled
  //    by the Date constructor (e.g. January 32nd typically gets resolved to February 1st)
  //    Only years between 100 and 9999 are supported.
    // formattedString:
  //    A string such as 2005-06-30T08:05:00-07:00 or 2005-06-30 or T08:05:00
  // defaultTime:
  //    Used for defaults for fields omitted in the formattedString.
  //    Uses 1970-01-01T00:00:00.0Z by default.

  if(!stamp._isoRegExp){
    stamp._isoRegExp =
      /^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/;
  }

  var match = stamp._isoRegExp.exec(formattedString),
    result = null;

  if(match){
    match.shift();
    if(match[1]){match[1]--;} // Javascript Date months are 0-based
    if(match[6]){match[6] *= 1000;} // Javascript Date expects fractional seconds as milliseconds

    result = new Date(match[0]||1970, match[1]||0, match[2]||1, match[3]||0, match[4]||0, match[5]||0, match[6]||0); //TODO: UTC defaults
    if(match[0] < 100){
      result.setFullYear(match[0] || 1970);
    }

    var offset = 0,
      zoneSign = match[7] && match[7].charAt(0);
    if(zoneSign != 'Z'){
      offset = ((match[8] || 0) * 60) + (Number(match[9]) || 0);
      if(zoneSign != '-'){ offset *= -1; }
    }
    if(zoneSign){
      offset -= result.getTimezoneOffset();
    }
    if(offset){
      result.setTime(result.getTime() + offset * 60000);
    }
  }

  return result; // Date or null
};
stamp.toISOString = function(/*Date*/ dateObject, /*__Options?*/ options){
  // summary:
  //    Format a Date object as a string according a subset of the ISO-8601 standard
  //
  // description:
  //    When options.selector is omitted, output follows [RFC3339](http://www.ietf.org/rfc/rfc3339.txt)
  //    The local time zone is included as an offset from GMT, except when selector=='time' (time without a date)
  //    Does not check bounds.  Only years between 100 and 9999 are supported.
  //
  // dateObject:
  //    A Date object

  var _ = function(n){ return (n < 10) ? "0" + n : n; };
  options = options || {};
  var formattedDate = [],
    getter = options.zulu ? "getUTC" : "get",
    date = "";
  if(options.selector != "time"){
    var year = dateObject[getter+"FullYear"]();
    date = ["0000".substr((year+"").length)+year, _(dateObject[getter+"Month"]()+1), _(dateObject[getter+"Date"]())].join('-');
  }
  formattedDate.push(date);
  if(options.selector != "date"){
    var time = [_(dateObject[getter+"Hours"]()), _(dateObject[getter+"Minutes"]()), _(dateObject[getter+"Seconds"]())].join(':');
    var millis = dateObject[getter+"Milliseconds"]();
    if(options.milliseconds){
      time += "."+ (millis < 100 ? "0" : "") + _(millis);
    }
    if(options.zulu){
      time += "Z";
    }else if(options.selector != "time"){
      var timezoneOffset = dateObject.getTimezoneOffset();
      var absOffset = Math.abs(timezoneOffset);
      time += (timezoneOffset > 0 ? "-" : "+") +
        _(Math.floor(absOffset/60)) + ":" + _(absOffset%60);
    }
    formattedDate.push(time);
  }
  return formattedDate.join('T'); // String
};
