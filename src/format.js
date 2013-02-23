
var U = exports.utils;

var pad = function(str, sz, p) {
  p = p || ' ';
  var d = Math.max(0, Math.abs(sz) - str.length);
  var pad = new Array(d + 1).join(p);
  if (sz < 0) {
    return pad + str;
  } else {
    return str + pad;
  }
};


var format = function(format) {

  named_args = {};
  pos_args = [];
  U.foreach(U.args(arguments, 1), function(arg) {
    if (typeof arg == 'string' || typeof arg === 'number') {
      pos_args.push(arg);
    } else if (typeof arg == 'object') {
      U.mix(named_args, arg, true);
    }
  });

  return format.replace(/%(\((\w+)\))?(-?(\d*)(\.(\d+))?)?([sdf])/gi,
    function(str, _1, name, _2, sz, _3, precision, type) {
      var z = (sz && sz.charAt(0) === '0');
      sz = (sz || 0) - 0;
      precision = (precision || 0) - 0;

      var arg;
      if (name) {
        arg = named_args[name];
      } else {
        arg = pos_args.shift();
      }

      switch (type) {
        case 's':
          arg = ('' + arg);
          return pad(arg, sz);

        case 'd':
          arg = '' + Math.floor(arg - 0);
        case 'f':
          arg = (arg - 0).toFixed(precision);
          return pad(arg, -sz, z && '0');

        default:
          return str;
      }
  });
}


exports.utils.format = format;
