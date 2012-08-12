/*!
 * pyy.js
 *
 * Copyright 2012 Tom Flanagan, Jake Wharton
 * Released under the GNU LGPL Version 3
 * - http://www.gnu.org/licenses/lgpl.html
 *
 */

var pyy = function(arg) {
  var args = pyy.utils.args(arguments);
  if (pyy.html.is_node(arg)) {
    return pyy.wrap(arg);
  }
};
