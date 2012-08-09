/*!
 * pyy.js
 *
 * Copyright 2012 Tom Flanagan, Jake Wharton
 * Released under the GNU LGPL Version 3
 * - http://www.gnu.org/licenses/lgpl.html
 *
 */

var pyy = function() {
  alert('pyy!');
};

function(exports) {
/*
Basic JavaScript utility functions
*/

var U = exports.utils = {

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

  filter: function(obj, func, context) {
    context = context || null;
    var ret;
    if (obj instanceof Array) { ret = []; }
    else                      { ret = {}; }
    U.foreach(obj, function(v, k) {
      if (func.call(context, v, k)) {
        ret[k] = v;
      }
    });
    return ret;
  },

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

  args: function(args, n) {
    return Array.prototype.slice.call(args, n || args.length);
  }
};

})(pyy);

function(exports) {
//  HTML utility functions
// TODO:
// split this into
// - internal functions
// - api functions
// - api(tag, ...) functions that can be wrapped

var U = exports.utils;
var H = exports.html = {
  is_node: function(obj) {
    try       { return (obj instanceof Node); }
    catch (e) { return obj && obj.nodeType; }
  },

  css2js: function(name) {
    var upper = function(_, letter) { return letter.toUpperCase(); };
    return name.replace(/(?:-|_)(.)/g, upper);
  },

  css2js_obj: function(obj) {
    var js = {};
    U.foreach(obj, function(v, k) { js[H.css2js(k)] = v; });
    return js;
  },

  /**
   * Create an HTML tag method.
   *
   * @param {tag} HTML tag name.
   * @return {node} Function for creating corresponding DOM element.
   */
  create: function(tag) {
    var self = this;
    return function() {
      var element = document.createElement(tag);
      for (var j = 0; j < arguments.length; j++) {
        var argument = arguments[j];
        self.update(element, argument);
      }
      return element;
    };
  },

  bind: function(context) {
    U.mix(context || window, pyy.tags);
  },

  /**
   * Create a DOM text node.
   *
   * @param {text} Text contents.
   * @return {node} DOM element.
   */
  text: function(text) {
    return (typeof text === 'string') ? document.createTextNode(text) : null;
  },

  css: function(dom) {
    U.foreach(U.args(arguments, 1), function(css) {
      U.foreach(css, function(val, key) {
        dom.style[U.css2js(key)] = val;
      });
    });
  },


  update: function(dom) {
    var context = dom;

    for (var j = 1; j < arguments.length; j++) {
      var argument = arguments[j];

      var i, key;
      if (H.is_node(argument)) {
        dom.appendChild(argument);
      } else if (typeof argument === 'string') {
        dom.appendChild(document.createTextNode(argument));
      } else if (argument instanceof Array) {
        for (i = 0; i < argument.length; i++) {
          this.update(dom, argument[i]);
        }
      } else {
        if ((typeof argument === 'object') &&
            argument.hasOwnProperty('context')) {
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
            if (!value) { continue; }
            var classes = value.split(/\s+/);
            classes = clases.concat(dom.getAttribute('class').split(/\s+/));
            document.setAttribute('class', classes.join(' '));
          } else if (key === 'style') {
            // style: {background: '#000'}
            H.css(dom, value);
          } else if (key.slice(0, 2) === 'on') {
            // an event handler
            var f = value, args = [];
            if (typeof value !== 'function') {
              f = value.func;
              args = value.args;
            }
            args = [key.slice(2), f, dom, context].concat(args);
            Y.on.apply(Y, args); // TODO XXX fix this
          } else {
            // otherwise a regular attribute
            dom.setAttribute(key, value);
          }
        }
      }
    }
  }
};

})(pyy);

function(exports) {
// Create & bind HTML tag functions

var tag_names = [
  'a', 'address', 'article', 'aside', 'audio', 'blockquote', 'br', 'button',
  'canvas', 'caption', 'code', 'col', 'colgroup', 'dd', 'div', 'dl', 'dt',
  'em', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
  'h6', 'header', 'hgroup', 'hr', 'img', 'input', 'label', 'legend', 'li',
  'link', 'math', 'nav', 'ol', 'optgroup', 'option', 'output', 'p', 'pre',
  'progress', 'script', 'section', 'select', 'small', 'source', 'span',
  'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea',
  'tfoot', 'th', 'thead', 'time', 'tr', 'ul', 'video'
];

var U = exports.utils;
var H = exports.html;
var T = expotts.tags = {};

U.foreach(tags, function(tag) {
  T[tag] = H.create(tag);
});

})(pyy);

function(exports) {

var U = exports.utils;

var I = exports.io = {

  xhr: function(method, url, data, func, context) {
    context = context || null;
    var request = new XMLHttpRequest();
    request.open(method, url, true);
    request.addEventListener('readystatechange', function(e) {
      func.call(context, request.responseText, request, e);
    });
    request.send(data);
  },

  get: function(url, func, context) {
    I.xhr("GET", url, null, func, context);
  },

  post: function(url, data, func, context) {
    I.xhr("GET", url, data, func, context);
  };

};

})(pyy);

function(exports) {
// TODO this module is unfinished and untested

var U = exports.utils;
var B = exports.bind = function bind(obj) {
	var listeners = [];
	var binding = function(a, b) {
    if (binding instanceof Array) {
      if      (arguments.length === 0)  { return obj; }
      else if (arguments.length === 1)  { return obj[a]; }
      else                              { obj[a] = b; }
    } else {
      if (arguments.length === 0) { return obj; }
      else                        { obj = val;  }
    }

    U.foreach(listeners, function(cb) {
      cb.func.apply(cb.context, obj)
    });
  }

  binding.register = function(func, context) {
    listeners.push({func: func, context: context});
  };
  binding.unregister = function(func, contect) {
    listeners = U.remove(listeners, function(cb) {
      return (cb.func === func) && cb.context === context);
    });
  }
  return binding;
};

})(pyy);

function(exports) {
// TODO this module is unfinished and untested

var U = pyy.utils;

var W = exports.wrap = function wrap(element) {
    this.element = element;
    // TODO
    // wrap functions in html and binding for awesomeness.
    // ideas:
    /*
    var name = bind("Foo");
    body.div("name:").span(name);

    name("Bar"); // updates div

    */
};


})(pyy);
