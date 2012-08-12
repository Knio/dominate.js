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
