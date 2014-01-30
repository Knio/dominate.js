
/*
pyy(elem) - return wrapped element

elem can be a DOM reference or a css selector string
*/

var pyy = function(arg) {
    return pyy.wrap_list(Sizzle(arg));
};

pyy.one = function(arg) {
    if (pyy.utils.is_node(arg)) {
        return pyy.wrap(arg);
    }   
    if (typeof arg === 'string') {
        return pyy.wrap(Sizzle(arg)[0]);
    }
};