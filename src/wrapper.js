// TODO this module is unfinished and untested

var U = pyy.utils;

var W = exports.wrap = function wrap(dom) {
    var wrapper = function() {
        var args = [dom].concat(U.args(arguments));
        pyy.html.update.apply(this, args);
    }
    wrapper.dom = dom;

    wrapper.css = function(css) {
        pyy.html.css(dom, css);
    }

    U.mix(wrapper, pyy.tags);
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
