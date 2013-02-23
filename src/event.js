var U = exports.utils;

var event = function() {
  var listeners = [];

  var fire = function() {
    var args = U.args(arguments);
    U.foreach(listeners, function(sub) {
      var a = sub.args.concat(args);
      sub.callback.apply(sub.context, a);
    });
  };

  fire.subscribe = function(callback, context) {
    listeners.push({
      callback: callback,
      context: context,
      args: U.args(arguments, 2)
    });
  };

  fire.unsubscribe = function(callback, context) {
    listeners = U.remove(listeners, function(sub) {
      return (sub.callback == callback) &&
        (sub.context == context);
    });
  };

  fire.len = function() {
    return listeners.length;
  };

  return fire;
};


var listen = function(event, listener) {
  event.subscribe(function(name) {
    var args = U.args(arguments, 1);
    var cb = this[name];
    if (cb) {
      cb.apply(this, args);
    }
  }, listener);
};

exports.utils.listen = listen;
exports.utils.event = event;
