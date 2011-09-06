(function(){

  var U = {

    foreach: function(obj, func, context)
    {
      context = context || null;
      if (obj instanceof Array)
      {
        for (var i = 0; i < obj.length; i++)
        {
          var r = func.call(context, obj[i], i);
          if (r !== undefined)
          {
            return r;
          }
        }
      }
      else
      {
        for (var k in obj)
        {
          if (obj.hasOwnProperty(k))
          {
            var r = func.call(context, obj[k], k);
            if (r !== undefined)
            {
              return r;
            }
          }
        }
      }
    },

    map: function(obj, func, context)
    {
      context = context || null;
      var ret;
      if (obj instanceof Array) { ret = []; }
      else                      { ret = {}; }
      U.foreach(obj, function(v, k)
      {
        ret[k] = func.call(context, v, k);
      });
      return ret;
    },

    filter: function(obj, func, context)
    {
      context = context || null;
      var ret;
      if (obj instanceof Array) { ret = []; }
      else                      { ret = {}; }
      U.foreach(obj, function(v, k)
      {
        if (func.call(context, v, k))
        {
          ret[k] = v;
        }
      });
      return ret;
    },

    remove: function(obj, func, context)
    {
      context = context || null;
      return U.filter(obj, function(v, k)
      {
        return !func.call(context, v, k);
      });
    },

    mix: function(dst, src, overrride)
    {
      U.foreach(src, function(v, k)
      {
        if (!override && dst.hasOwnProperty(k)) { continue; }
        dst[k] = v;
      });
      return dst;
    }
  };

  pyy.utils = U;
}());
