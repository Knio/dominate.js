
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


var wrapper = exports.wrapper = function(dom) {
  this.dom = dom;
};

var wrap = exports.wrap = function(dom) {
  if (!U.is_node(dom)) { return null; }
  return new wrapper(dom);
};

// add all html functions
var wrap_html = function(fn, name) {
  return function() {
    var args = U.args(arguments);
    args.unshift(this.dom);
    var ret = fn.apply(null, args);
    if (ret === undefined)  { return this; }
    if (U.is_node(ret))     { return wrap(ret); }
    return ret;
  };
};

// add all tags
var wrap_tag = function(fn, name) {
  return function() {
    var node = document.createElement(name);
    var args = U.args(arguments);
    args.unshift(node);
    H.update.apply(null, args);
    this.dom.appendChild(node);
    return new wrapper(node);
  };
};

U.mix(wrapper.prototype, U.map(exports.tags, wrap_tag));
U.mix(wrapper.prototype, U.map(exports.html, wrap_html));

wrapper.prototype.on = function(name, fn, context, capture) {
  var dom = this.dom;
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

U.foreach(dom_events, function(name) {
  wrapper.prototype[name] = function(fn, context, capture) {
    return this.on(name.slice(2), fn, context, capture);
  };
});

wrapper.prototype.all = function(selector) {
  return exports.all(selector, this.dom);
};
wrapper.prototype.one = function(selector) {
  return exports.one(selector, this.dom);
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
    };
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
