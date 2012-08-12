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
    return document.createTextNode('' + text);
  },

  css: function(dom) {
    U.foreach(U.args(arguments, 1), function(css) {
      U.foreach(css, function(val, key) {
        dom.style[H.css2js(key)] = val;
      });
    });
  },

  update: function(dom) {
    var context = dom;

    for (var j = 1; j < arguments.length; j++) {
      var argument = arguments[j];

      var i, key;
      if (H.is_node(argument)) {
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
          if (argument.hasOwnProperty('dom')) {
            // is a pyy.wrap()ed node. add it like a child
            dom.appendChild(argument.dom);
          }
          else {
            // What do we do here??
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
            classes = clases.concat(dom.getAttribute('class').split(/\s+/));
            document.setAttribute('class', classes.join(' '));
          } else if (key === 'style') {
            // style: {background: '#000'}
            H.css(dom, value);
          } else if (key.slice(0, 2) === 'on') {
            // an event handler
            var type = key.slice(2);
            var f = value, args = [], ctx = context, capture = false;
            if (typeof value !== 'function') {
              f = value.func;
              args    = value.args    || args;
              ctx     = value.context || ctx;
              capture = value.capture || capture;
              if (args.length !== 0) {
                f = function() {
                  value.func.apply(ctx, args.concat(U.args(arguments)));
                }
              } else {
                f = value.func;
              }
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
