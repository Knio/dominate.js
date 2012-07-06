//  HTML utility functions
// TODO:
// split this into
// - internal functions
// - api functions
// - api(tag, ...) functions that can be wrapped
(function() {

  var U = pyy.utils;
  var H = {
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

  pyy.html = H;
}());
