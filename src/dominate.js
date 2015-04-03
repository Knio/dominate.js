
/*
dominate(elem) - return wrapped element

elem can be a DOM reference or a css selector string
*/

// if (window.Sizzle) {

//   var dominate = function(arg, ctx) {
//     return dominate.wrap_list(Sizzle(arg, ctx));
//   };

//   dominate.one = function(arg, ctx) {
//     if (dominate.utils.is_node(arg)) {
//       return dominate.wrap(arg);
//     }
//     if (typeof arg === 'string') {
//       var r = Sizzle(arg, ctx);
//       if (r.length >= 1) {
//           return dominate.wrap(r[0]);
//       }
//     }
//     return null;
//   };

// } else {

  var dominate = function(arg, ctx) {
    ctx = ctx || document;
    return dominate.wrap_list(U.args(ctx.querySelectorAll(arg)));
  };

  dominate.one = function(arg, ctx) {
    if (dominate.utils.is_node(arg)) {
      return dominate.wrap(arg);
    }
    if (typeof arg === 'string') {
      ctx = ctx || document;
      return dominate.wrap(ctx.querySelector(arg));
    }
    return null;
  };

// }
