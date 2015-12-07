
/*
dominate(elem) - return wrapped element

elem can be a DOM reference or a css selector string
*/

// if (window.Sizzle) {

//   var dominate = function(arg, ctx) {
//     return dominate.wrap_list(Sizzle(arg, ctx));
//   };

//   dominate.one = function(arg, ctx) {
//     if (dominate.utils.is_node(arg)) {
//       return dominate.wrap(arg);
//     }
//     if (typeof arg === 'string') {
//       var r = Sizzle(arg, ctx);
//       if (r.length >= 1) {
//           return dominate.wrap(r[0]);
//       }
//     }
//     return null;
//   };

// } else {

  var dominate = function(arg, ctx) {
    ctx = ctx || document;
    return dominate.wrap_list(U.args(ctx.querySelectorAll(arg)));
  };
  dominate.all = dominate;

  dominate.one = function(arg, ctx) {
    if (dominate.utils.is_node(arg)) {
      return dominate.wrap(arg);
    }
    if (typeof arg === 'string') {
      ctx = ctx || document;
      return dominate.wrap(ctx.querySelector(arg));
    }
    return null;
  };

// }

(function(exports) {
/*
Basic JavaScript utility functions
*/

var U = exports.utils = {

  is_node: function(obj) {
    try       { return (obj instanceof Node); }
    catch (e) { return obj && obj.nodeType; }
  },

  foreach: function(obj, func, context) {
    context = context || null;
    var r;
    if (obj instanceof Array) {
      for (var i = 0; i < obj.length; i++) {
        r = func.call(context, obj[i], i);
        if (r !== undefined) { return r; }
      }
    } else {
      for (var k in obj) {
        if (!obj.hasOwnProperty(k)) { continue; }
        r = func.call(context, obj[k], k);
        if (r !== undefined) {
          return r;
        }
      }
    }
  },

  // returns a copy of the collection with
  // elements of func(value)
  map: function(obj, func, context) {
    context = context || null;
    var ret;
    if (obj instanceof Array) { ret = []; }
    else                      { ret = {}; }
    U.foreach(obj, function(v, k) {
      ret[k] = func.call(context, v, k);
    });
    return ret;
  },

  // returns a copy of the collection with
  // elements that do not match the predicate removed
  filter: function(obj, func, context) {
    context = context || null;
    func = func || function(x) { return !!x; };
    var ret;
    if (obj instanceof Array) {
      ret = [];
      U.foreach(obj, function(v, k) {
        if (func.call(context, v, k)) {
          ret.push(v);
        }
      });
    }
    else {
      ret = {};
      U.foreach(obj, function(v, k) {
        if (func.call(context, v, k)) {
          ret[k] = v;
        }
      });
    }
    return ret;
  },

  // returns a copy of the collection with
  // elements that match the predicate removed
  remove: function(obj, func, context) {
    context = context || null;
    return U.filter(obj, function(v, k) {
      return !func.call(context, v, k);
    });
  },

  mix: function(dst, src, override) {
    U.foreach(src, function(v, k) {
      if (!override && dst.hasOwnProperty(k)) { return; }
      dst[k] = v;
    });
    return dst;
  },

  dict: function(keys, values) {
    var obj = {};
    U.foreach(keys, function(k, i) {
      obj[k] = i && (values && values[i]);
    });
    return obj;
  },

  args: function(args, n) {
    return Array.prototype.slice.call(args, n || 0);
  },

  json: function(what) {
    if (typeof what === 'string') {
      return JSON.parse(what);
    }
    else {
      return JSON.stringify(what);
    }
  },

  values: function(obj) {
    var values = [];
    U.foreach(obj, function(v, k) {
      values.push(v);
    });
    return values;
  },

  keys: function(obj) {
    var keys = [];
    U.foreach(obj, function(v, k) {
      keys.push(k);
    });
    return keys;
  }

  // TODO
  // ----
  // make a simple event class

};

U.json.parse = JSON.parse;
U.json.stringify = JSON.stringify;

})(dominate);

(function(exports) {

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
};


exports.utils.format = format;

})(dominate);

(function(exports) {
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

})(dominate);

(function(exports) {
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

})(dominate);

(function(exports) {
// Create & bind HTML tag functions

var tag_names = exports.tag_names = [
  'a', 'address', 'article', 'aside', 'audio', 'blockquote', 'br', 'button',
  'canvas', 'caption', 'code', 'col', 'colgroup', 'dd', 'div', 'dl', 'dt',
  'em', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
  'h6', 'header', 'hgroup', 'hr', 'img', 'input', 'label', 'legend', 'li',
  'link', 'main', 'math', 'nav', 'ol', 'optgroup', 'option', 'output', 'p',
  'pre', 'progress', 'script', 'section', 'select', 'small', 'source', 'span',
  'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'template',
  'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'ul', 'video'
  // TODO add more here (svg, etc)
];

var H = exports.html;
var U = exports.utils;
var T = exports.tags = {};

/**
 * Create a DOM text node.
 *
 * @param {text} Text contents.
 * @return {node} DOM element.
 */
T.text = function(text) {
    return document.createTextNode('' + text);
};

/**
 * Create HTML tag methods
 * @return {node} Function for creating corresponding DOM element.
 */

T.create_tag = function(tag) {
  T[tag] = function() {
    var element = document.createElement(tag);
    H.update.apply(this, [element].concat(U.args(arguments)));
    return element;
    // TODO
    // could return wrapped element here, if wrapper gets good.
  };
};

U.foreach(tag_names, T.create_tag);

})(dominate);

(function(exports) {

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
  },

  form: function(data) {
    var formdata = new FormData();
    U.foreach(data, function(v, k) {
      formdata.append(k, v);
    });  
    return formdata;
  }

};

})(dominate);

(function(exports) {
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

})(dominate);

(function(exports) {

var U = exports.utils;
var H = exports.html;

var dom_events = [
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onhelp',
  'onmousedown',
  'onmousemove',
  'onmouseup',
  'onmouseout',
  'onclick',
  'ondblclick',
  'onfocus',
  'onblur',
  'onabort',
  'onerror',
  'onchange',
  'onload',
  'onselect',
  'onsubmit'
];


var wrapper = exports.wrapper = function(dom) {
  this.dom = dom;
};

var wrap = exports.wrap = function(dom) {
  if (!U.is_node(dom)) { return null; }
  return new wrapper(dom);
};

// add all html functions
var wrap_html = function(fn, name) {
  return function() {
    var args = U.args(arguments);
    args.unshift(this.dom);
    var ret = fn.apply(null, args);
    if (ret === undefined)  { return this; }
    if (U.is_node(ret))     { return wrap(ret); }
    return ret;
  };
};

// add all tags
var wrap_tag = function(fn, name) {
  return function() {
    var node = document.createElement(name);
    var args = U.args(arguments);
    args.unshift(node);
    H.update.apply(null, args);
    this.dom.appendChild(node);
    return new wrapper(node);
  };
};

U.mix(wrapper.prototype, U.map(exports.tags, wrap_tag));
U.mix(wrapper.prototype, U.map(exports.html, wrap_html));

wrapper.prototype.on = function(name, fn, context, capture) {
  var dom = this.dom;
  capture = capture || false;
  var listener = function(e) {
    var ctx = context || wrap(this);
    var ret = fn.call(ctx, e, listener);
    if (ret === false) {
      dom.removeEventListener(name, listener, capture);
    }
  };
  dom.addEventListener(name, listener, capture);
  return wrapper;
};

U.foreach(dom_events, function(name) {
  wrapper.prototype[name] = function(fn, context, capture) {
    return this.on(name.slice(2), fn, context, capture);
  };
});

wrapper.prototype.all = function(selector) {
  return exports.all(selector, this.dom);
};
wrapper.prototype.one = function(selector) {
  return exports.one(selector, this.dom);
};


// wrap a list of DOM elements with tag functions
var wrap_list = exports.wrap_list = function wrap_list(list) {

  // TODO we assume the list is of dom elements.
  // What other possibilities are there?

  var wrap_tag = function(fn, name) {
    return function() {
      var args = U.args(arguments);
      return wrap_list(U.map(list, function(dom, i) {
        var node = fn.apply(null, args);
        dom.appendChild(node);
        return node;
      }));
    };
  };

  var wrap_html = function(fn, name) {
    return function() {
      var args = U.args(arguments);
      var ret = U.map(list, function(dom, i) {
        var args2 = args.slice();
        args2.unshift(dom);
        return fn.apply(this, args2);
      });
      if (U.filter(ret).length !== 0) {
        return ret;
      }
      return list;
    };
  };

  var wrap_event = function(name) {
    list[name] = function(fn, context, capture) {
      return list.on(name.slice(2), fn, context, capture);
    };
  };

  list.on = function(name, fn, context, capture) {
    capture = capture || false;
    U.foreach(list, function(dom, i) {
      var listener = function(e) {
        var ctx = context || wrap(this);
        var ret = fn.call(ctx, e, listener);
        if (ret === false) {
          dom.removeEventListener(name, listener, capture);
        }
      };
      dom.addEventListener(name, listener, capture);
    });
    return list;
  };

  list.foreach = function(fn, ctx) {
    U.foreach(list, function(e, i) {
      fn.call(ctx, wrap(e), i);
    });
  };

  U.mix(list, U.map(exports.tags, wrap_tag));
  U.mix(list, U.map(exports.html, wrap_html));

  U.foreach(dom_events, wrap_event);

  // TODO events

  return list;
};

})(dominate);

(function(exports) {
// exposes the public API of dominate

window.D = dominate;
window.U = dominate.utils;
window.H = dominate.html;
window.I = dominate.io;

window.all = dominate;
window.one = dominate.one;

U.mix(window, dominate.tags);

})(dominate);
