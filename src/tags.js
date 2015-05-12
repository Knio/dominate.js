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
