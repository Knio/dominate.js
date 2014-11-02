
var U = exports.utils;
var H = exports.html;

var dom_events = [
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onhelp',
  'onmousedown',
  'onmousemove',
  'onmouseup',
  'onmouseout',
  'onclick',
  'ondblclick',
  'onfocus',
  'onblur',
  'onabort',
  'onerror',
  'onchange',
  'onload',
  'onselect',
  'onsubmit'
];

// wrap a single DOM element with html functions
var wrap = exports.wrap = function wrap(dom) {


  // Calling the wrapped object calls D.update
  var wrapper = function() {
    var args = [dom].concat(U.args(arguments));
    H.update.apply(dom, args);
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
      return wrapper;
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

  wrapper.on = function(name, fn, context, capture) {
    capture = capture || false;
    var listener = function(e) {
      var ctx = context || wrap(this);
      var ret = fn.call(ctx, e, listener);
      if (ret === false) {
        dom.removeEventListener(name, listener, capture);
      }
    };
    dom.addEventListener(name, listener, capture);
    return wrapper;
  };

  var wrap_event = function(name) {
    wrapper[name] = function(fn, context, capture) {
      return wrapper.on(name.slice(2), fn, context, capture);
    };
  };

  U.mix(wrapper, U.map(exports.tags, wrap_tag));
  U.mix(wrapper, U.map(exports.html, wrap_html));

  U.foreach(dom_events, wrap_event);

  wrapper.all = function(selector) {
    return exports(selector, dom);
  };
  wrapper.one = function(selector) {
    return exports.one(selector, dom);
  };

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


// wrap a list of DOM elements with tag functions
var wrap_list = exports.wrap_list = function wrap_list(list) {

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
      if (U.filter(ret).length !== 0) {
        return ret;
      }
      return list;
    };
  };

  var wrap_event = function(name) {
    list[name] = function(fn, context, capture) {
      return list.on(name.slice(2), fn, context, capture);
    };
  };

  list.on = function(name, fn, context, capture) {
    capture = capture || false;
    U.foreach(list, function(dom, i) {
      var listener = function(e) {
        var ctx = context || wrap(this);
        var ret = fn.call(ctx, e, listener);
        if (ret === false) {
          dom.removeEventListener(name, listener, capture);
        }
      };
      dom.addEventListener(name, listener, capture);
    });
    return list;
  };

  list.foreach = function(fn, ctx) {
    U.foreach(list, function(e, i) {
      fn.call(ctx, wrap(e), i);
    });
  };

  U.mix(list, U.map(exports.tags, wrap_tag));
  U.mix(list, U.map(exports.html, wrap_html));

  U.foreach(dom_events, wrap_event);

  // TODO events

  return list;
};
