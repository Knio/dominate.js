
/*
pyy(elem) - return wrapped element

elem can be a DOM reference or a css selector string
*/

var pyy = function(arg) {
  var args = pyy.utils.args(arguments);
  if (pyy.utils.is_node(arg)) {
    return pyy.wrap(arg);
  }
  if (typeof arg === 'string') {
    return pyy.wrap2(Sizzle(arg));
  }
};
