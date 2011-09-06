(function() {
  var tags = [
    'a', 'address', 'article', 'aside', 'audio', 'blockquote', 'br', 'button',
    'canvas', 'caption', 'code', 'col', 'colgroup', 'dd', 'div', 'dl', 'dt',
    'em', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
    'h6', 'header', 'hgroup', 'hr', 'img', 'input', 'label', 'legend', 'li',
    'link', 'math', 'nav', 'ol', 'optgroup', 'option', 'output', 'p', 'pre',
    'progress', 'script', 'section', 'select', 'small', 'source', 'span',
    'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea',
    'tfoot', 'th', 'thead', 'time', 'tr', 'ul', 'video'
  ];

  var U = pyy.utils;
  var H = {

    /**
     * Determine whether or not an object is a DOM node.
     *
     * @param {obj} Unknown object.
     * @return {boolean} Whether or not the object is a DOM node.
     */
    var is_node = function(obj)
    {
      try       { return (obj instanceof Node); }
      catch (e) { return obj && obj.nodeType; }
    },




  };


  /**
   * Converts all keys in dictionary from '_' or '-' to camelCase.
   *
   * @param {dict} Dictionary with style names as keys.
   * @return {dict} New dictionary with camelCase style name keys.
   */
  var css2js_style_names = function(dict) {
    var style_name, style_value;
    var new_styles = {};
    var mapping = {cls: 'class'};
    var upper = function(_, letter) { return letter.toUpperCase(); };
    U.foreach(dict, function(value, name) {
      name = name.replace(/(?:-|_)(.)/g, upper);
      if (mapping.hasOwnProperty(name)) {
        name = mapping[name];
      }
      new_styles[name] = value;
    });
    return new_styles;
  };

  pyy.tags = {
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

    /**
     * Bind HTML tag methods to an alternate object.
     *
     * @param {context} Object on which to bind the tag methods. If omitted the
     *   global window will be used.
     */
    bind: function(context) {
      context = context || window;
      for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        context[tag] = this[tag];
      }
      context['text'] = this.text;
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

    update: function(dom) {
      var context = dom;

      for (var j = 1; j < arguments.length; j++) {
        var argument = arguments[j];

        var i, key;
        if (is_node(argument)) {
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
              for (var c = 0; c < classes.length; c++) {
                Y.DOM.addClass(dom, classes[c]);
              }
            } else if (key === 'style') {
              // style: {background:'#000'}
              Y.DOM.setStyles(dom, css2js_style_names(value));
            } else if (key.slice(0, 2) === 'on') {
              // an event handler
              var f = value, args = [];
              if (typeof value !== 'function') {
                f = value.func;
                args = value.args;
              }
              args = [key.slice(2), f, dom, context].concat(args);
              Y.on.apply(Y, args);
            } else {
              // otherwise a regular attribute
              Y.DOM.setAttribute(dom, key, value);
            }
          }
        }
      }
    }
  };

  // Bind to pyy.tags directly
  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i];
    pyy.tags[tag] = pyy.tags.create(tag);
  }
}());
