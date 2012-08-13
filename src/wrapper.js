// TODO this module is unfinished and untested

var U = exports.utils;
var H = exports.html;

var W = exports.wrap = function wrap(dom) {
    var wrapper = function() {
        var args = [dom].concat(U.args(arguments));
        H.update.apply(this, args);
        return wrapper;
    }
    wrapper.dom = dom;

    wrapper.css = function(css) {
        H.css(dom, css);
        return wrapper;
    }

    var wrapped_create = function(create) {
        return function() {
            var node = create.apply(this, U.args(arguments));
            dom.appendChild(node);
            return W(node);
        }
    };
    U.mix(wrapper, U.map(exports.tags, wrapped_create));

    // TODO
    // wrap functions in html and binding for awesomeness.
    // ideas:
    /*
    var name = bind("Foo");
    body.div("name:").span(name);

    name("Bar"); // updates div

    */

    return wrapper;
};

var W2 = exports.wrap2 = function wrap(list) {

    // TODO we assume the list is of dom elements.
    // What other possibilities are there?
    U.foreach(exports.tags, function bind(func, name) {
        list[name] = function() {
            var args = U.args(arguments);
            return exports.wrap2(U.map(list, function(dom) {
                var n = func.apply(this, args);
                dom.appendChild(n);
                return n;
            }, this));
        };
    }, this);

    list.css = function() {
        var args = [null].concat(U.args(arguments));
        U.foreach(list, function(dom) {
            args[0] = dom;
            H.css.apply(this, args);
        }, this);
        return list;
    };

    // TODO events

    return list;
};
