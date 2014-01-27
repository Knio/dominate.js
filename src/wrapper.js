// TODO this module is unfinished and untested

var U = exports.utils;
var H = exports.html;

// wrap a single DOM element with pyy functions
var W = exports.wrap = function wrap(dom) {


    // Calling the wrapped object calls D.update
    var wrapper = function() {
        var args = [dom].concat(U.args(arguments));
        H.update.apply(this, args);
        return wrapper;
    };
    wrapper.dom = dom;

    // add all html functions
    var wrapped_html = function(fn) {
        return function() {
            var ret = fn.apply(this, U.args(arguments));
            if (U.is_node(ret)) {
                dom.appendChild(ret);
                return W(ret);
            }
            if (ret === undefined) {
                return this;
            }
            return ret;
        }
    };
    U.mix(wrapper, U.map(exports.tags, wrapped_html));
    U.mix(wrapper, U.map(exports.html, wrapped_html));

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


// wrap a list of DOM elements with pyy tag functions
var W2 = exports.wrap2 = function wrap(list) {

    // TODO we assume the list is of dom elements.
    // What other possibilities are there?
    var bind = function(fn, name) {
        list[name] = function() {
            var args = U.args(arguments);
            return exports.wrap2(U.map(list, function(dom) {
                var args2 = [dom];
                args2.push.apply(args2, args);
                var ret = fn.apply(dom, args2);
                if (U.is_node(ret)) {
                    dom.appendChild(ret);
                }
                if (ret === undefined) {
                    return dom;
                }
                return ret;
            }, this));
        };
    };

    U.foreach(exports.tags, bind);
    U.foreach(exports.html, bind);

    // TODO events
    return list;
};
