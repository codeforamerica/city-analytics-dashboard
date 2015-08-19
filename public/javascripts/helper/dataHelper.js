window.dataHelper = {
  findWithUrl: function(data, url) {
    var i, dataLength = data.length;
    for(i=0;i<dataLength;i++) {
      result = data[i];
      if(result.url === url) {
        return result;
      }
    }
    return undefined;
  }
}
