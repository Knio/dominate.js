
var U = exports.utils;

var I = exports.io = {

  xhr: function(method, url, data, func, context) {
    context = context || null;
    var request = new XMLHttpRequest();
    request.open(method, url, true);
    request.addEventListener('readystatechange', function(e) {
      if (request.readyState === 4) {
        func.call(context, request.responseText, request, e);
      }
    });
    request.send(data);
  },

  get: function(url, func, context) {
    I.xhr('GET', url, null, func, context);
  },

  post: function(url, data, func, context) {
    I.xhr('POST', url, data, func, context);
  }

};
