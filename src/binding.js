// TODO this module is unfinished and untested

var U = exports.utils;

var B = exports.bind = function bind(obj) {
  var listeners = [];
  var binding = function binding(a, b) {
    if (obj instanceof Array) {
      if      (arguments.length === 0)  { return obj; }
      else if (arguments.length === 1)  { return obj[a]; }
      else                              { obj[a] = b; }
    } else {
      if (arguments.length === 0) { return obj; }
      else                        { obj = a; }
    }

    U.foreach(listeners, function(cb) {
      cb.func.call(cb.context, obj, a, b);
    });
  };

  binding.register = function(func, context) {
    listeners.push({func: func, context: context});
  };
  binding.unregister = function(func, contect) {
    listeners = U.remove(listeners, function(cb) {
      return (cb.func === func) && (cb.context === context);
    });
  };
  return binding;
};
