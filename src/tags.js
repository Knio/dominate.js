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
