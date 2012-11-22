/*
Basic JavaScript utility functions
*/

var U = exports.utils = {

  is_node: function(obj) {
    try       { return (obj instanceof Node); }
    catch (e) { return obj && obj.nodeType; }
  },

  foreach: function(obj, func, context) {
    context = context || null;
    var r;
    if (obj instanceof Array) {
      for (var i = 0; i < obj.length; i++) {
        r = func.call(context, obj[i], i);
        if (r !== undefined) { return r; }
      }
    } else {
      for (var k in obj) {
        if (!obj.hasOwnProperty(k)) { continue; }
        r = func.call(context, obj[k], k);
        if (r !== undefined) {
          return r;
        }
      }
    }
  },

  // returns a copy of the collection with
  // elements of func(value)
  map: function(obj, func, context) {
    context = context || null;
    var ret;
    if (obj instanceof Array) { ret = []; }
    else                      { ret = {}; }
    U.foreach(obj, function(v, k) {
      ret[k] = func.call(context, v, k);
    });
    return ret;
  },

  // returns a copy of the collection with
  // elements that do not match the predicate removed
  filter: function(obj, func, context) {
    context = context || null;
    func = func || function(x) { return !!x; };
    var ret;
    if (obj instanceof Array) { ret = []; }
    else                      { ret = {}; }
    U.foreach(obj, function(v, k) {
      if (func.call(context, v, k)) {
        ret[k] = v;
      }
    });
    return ret;
  },

  // returns a copy of the collection with
  // elements that match the predicate removed
  remove: function(obj, func, context) {
    context = context || null;
    return U.filter(obj, function(v, k) {
      return !func.call(context, v, k);
    });
  },

  mix: function(dst, src, override) {
    U.foreach(src, function(v, k) {
      if (!override && dst.hasOwnProperty(k)) { return; }
      dst[k] = v;
    });
    return dst;
  },

  args: function(args, n) {
    return Array.prototype.slice.call(args, n || 0);
  },

  json: function(what) {
    if (typeof what === 'string') {
      return JSON.parse(what);
    }
    else {
      return JSON.stringify(what);
    }
  },

  values: function(obj) {
    var values = [];
    U.foreach(obj, function(v, k) {
      values.push(v);
    });
    return values;
  },

  keys: function(obj) {
    var keys = [];
    U.foreach(obj, function(v, k) {
      keys.push(k);
    });
    return keys;
  }

  // TODO
  // ----
  // make a simple event class

};

U.json.parse = JSON.parse;
U.json.stringify = JSON.stringify;
