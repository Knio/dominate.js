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
    var child;
    while (child=dom.lastChild) {
      dom.removeChild(child);
    }
  },

  add: function(dom) {
    for (var i = 1; i < arguments.length; i++) {
      var a = arguments[i];
      if (a instanceof exports.wrapper) {
        dom.appendChild(a.dom);
      } else {
        dom.appendChild(a);
      }
    }
  },

  css: function(dom) {
    U.foreach(U.args(arguments, 1), function(css) {
      U.foreach(css, function(val, key) {
        dom.style[css2js(key)] = val;
      });
    });
  },

  get_classes: function(dom) {
    var c = dom.className;
    if (c === '') { return []; }
    return c.split(/\s+/);
  },

  add_class: function(dom) {
    var classes = U.dict(H.get_classes(dom));
    U.mix(classes, U.dict(U.args(arguments, 1)));
    dom.className = U.keys(classes).join(' ');
  },

  remove_class: function(dom) {
    var classes = U.dict(H.get_classes(dom));
    U.foreach(U.args(arguments, 1), function(cls) { delete classes[cls]; });
    dom.className = U.keys(classes).join(' ');
  },

  toggle_class: function(dom) {
    var classes = U.dict(H.get_classes(dom));
    U.foreach(U.args(arguments, 1), function(cls) {
      if (classes.hasOwnProperty(cls)) {
        delete classes[cls];
      } else {
        classes[cls] = true;
      }
    });
    dom.className = U.keys(classes).join(' ');
  },

  has_class: function(dom) {
    var classes = U.dict(H.get_classes(dom));
    return U.filter(U.args(arguments, 1), function(cls) {
      return classes.hasOwnProperty(cls);
    }).length === (arguments.length - 1);
  },

  'class': function(dom) {
    dom.className = U.args(arguments, 1).join(' ');
  },

  // TODO
  // ----
  // show
  // hide

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
            // is a wrap()ed node. add it like a child
            dom.appendChild(argument.dom);
          } else if (argument.name === 'binding') {
            // dominate binding
            var n = document.createTextNode(argument());
            argument.register(function(v) { this.nodeValue = v; }, n);
            dom.appendChild(n);
          } else {
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
  }
};
