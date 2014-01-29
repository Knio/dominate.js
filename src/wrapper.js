// TODO this module is unfinished and untested

var U = exports.utils;
var H = exports.html;

// wrap a single DOM element with pyy functions
var wrap = exports.wrap = function wrap(dom) {


  // Calling the wrapped object calls D.update
  var wrapper = function() {
    var args = [dom].concat(U.args(arguments));
    H.update.apply(this, args);
    return wrapper;
  };
  wrapper.dom = dom;

  // add all html functions
  var wrap_html = function(fn, name) {
    return function() {
      var args = U.args(arguments);
      args.unshift(dom);
      var ret = fn.apply(null, args);
      if (ret !== undefined) {
        if (U.is_node(ret)) {
          return wrap(ret);
        }
        return ret;
      }
      return this;
    }
  };

  // add all tags
  var wrap_tag = function(fn, name) {
    return function() {
      var node = fn.apply(null, U.args(arguments));
      dom.appendChild(node);
      return wrap(node);
    };
  };

  U.mix(wrapper, U.map(exports.tags, wrap_tag));
  U.mix(wrapper, U.map(exports.html, wrap_html));

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
var wrap_list = exports.wrap_list = function wrap(list) {

  // TODO we assume the list is of dom elements.
  // What other possibilities are there?
  
  var wrap_tag = function(fn, name) {
    return function() {
      var args = U.args(arguments);
      return wrap_list(U.map(list, function(dom, i) {
        var node = fn.apply(null, args);
        dom.appendChild(node);
        return node;
      }));
    }
  };

  var wrap_html = function(fn, name) {
    return function() {
      var args = U.args(arguments);
      var ret = U.map(list, function(dom, i) {
        var args2 = args.slice();
        args2.unshift(dom);
        return fn.apply(this, args2);
      });
      return list;
    };
  };

  U.mix(list, U.map(exports.tags, wrap_tag));
  U.mix(list, U.map(exports.html, wrap_html));

  // TODO events

  return list;
};
