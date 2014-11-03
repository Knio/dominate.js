
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
        var r = Sizzle(arg);
        if (r.length >= 1) {
            return dominate.wrap(r[0]);
        }
        return null;
    }
};
