
/*
dominate(elem) - return wrapped element

elem can be a DOM reference or a css selector string
*/

var dominate = function(arg) {
    return dominate.wrap_list(Sizzle(arg));
};

dominate.one = function(arg) {
    if (dominate.utils.is_node(arg)) {
        return dominate.wrap(arg);
    }
    if (typeof arg === 'string') {
        return dominate.wrap(Sizzle(arg)[0]);
    }
};
