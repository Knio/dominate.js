//  HTML utility functions
// TODO:
// split this into
// - internal functions
// - api functions
// - api(tag, ...) functions that can be wrapped


var U = exports.utils;

var css2js = function(name) {
  var upper = function(_, letter) { return letter.toUpperCase(); };
  return name.replace(/(?:-|_)(.)/g, upper);
};

var css2js_obj = function(obj) {
  var js = {};
  U.foreach(obj, function(v, k) { js[css2js(k)] = v; });
  return js;
};

var is_event_name = function(name) {
  return /^on/.test(name);
};

var H = exports.html = {

  empty: function(dom) {
    dom.innerHTML = '';
    return dom;
  },

  css: function(dom) {
    U.foreach(U.args(arguments, 1), function(css) {
      U.foreach(css, function(val, key) {
        dom.style[css2js(key)] = val;
      });
    });
    return dom;
  },

  // TODO
  // ----
  // show
  // hide
  // add_class
  // remove_class
  // set_class
  //
  // add all the above to the wrapper

  update: function(dom) {
    var context = dom;

    for (var j = 1; j < arguments.length; j++) {
      var argument = arguments[j];

      var i, key;
      if (U.is_node(argument)) {
        // child node
        dom.appendChild(argument);
      } else if (typeof argument === 'string' || typeof argument === 'number') {
        // text node
        dom.appendChild(document.createTextNode(argument));
      } else if (argument instanceof Array) {
        // array. flatten it
        for (i = 0; i < argument.length; i++) {
          H.update(dom, argument[i]);
        }
      } else if (typeof argument === 'function') {
          if (argument.hasOwnProperty('dom') && U.is_node(argument.dom)) {
            // is a pyy.wrap()ed node. add it like a child
            dom.appendChild(argument.dom);
          }
          else {
            // What do we do here??
            throw 'Not a DOM node';
          }
      } else {
        // object. update attributes
        if ((typeof argument === 'object') &&
            argument.hasOwnProperty('context')) {
          // grab special context property first
          context = argument.context;
        }
        for (key in argument) {
          if (!argument.hasOwnProperty(key)) {
            continue;
          }
          var value = argument[key];
          if (key === 'context') {
            // handled above - must be first
            continue;
          } else if (key === 'class' || key === 'cls') {
            // add a class
            if (!value) { continue; }
            var classes = value.split(/\s+/);
            classes = U.filter(classes.concat(dom.className.split(/\s+/)));
            dom.className = classes.join(' ');
          } else if (key === 'style') {
            // style: {background: '#000'}
            H.css(dom, value);
          } else if (is_event_name(key)) {
            // an event handler
            var type = key.slice(2);
            var f = value, args = [], ctx = context, capture = false;
            if (typeof value !== 'function') {
              f = value.func;
              args    = value.args    || args;
              ctx     = value.context || ctx;
              capture = value.capture || capture;
            }
            var wargs = (args.length !== 0);
            var wctx = (ctx !== dom);
            if (wargs) {
              var _f = f;
              f = function() {
                _f.apply(ctx, args.concat(U.args(arguments)));
              };
            } else if (wctx) {
              var _f = f;
              f = function() {
                _f.apply(ctx, arguments);
              };
            }
            dom.addEventListener(type, f, capture);
          } else {
            // otherwise a regular attribute
            dom.setAttribute(key, value);
          }
        }
      }
    }
    return dom;
  }
};
