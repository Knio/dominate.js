
/*
pyy(elem) - return wrapped element

elem can be a DOM reference or a css selector string
*/

var pyy = function(arg, el) {
  return pyy.wrap_list(Sizzle(arg, el));
};

pyy.one = function(arg, el) {
  if (pyy.utils.is_node(arg)) {
    return pyy.wrap(arg);
  }   
  if (typeof arg === 'string') {
    var nodes = Sizzle(arg, el);
    return nodes.length === 0 ? null : pyy.wrap(nodes[0]);
  }
};