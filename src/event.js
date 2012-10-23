
var event = function() {

  var listeners = [];

  var fire = function() {
    var args = U.args(arguments);
    U.foreach(listeners, function(sub) {
      var a = sub.args.concat(args);
      sub.apply(sub.context, a);
    });
  }

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

  fire.length = function() {
    return listeners.length;
  }

  return fire;

};

exports.utils.event = event;
