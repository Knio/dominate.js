// exposes the public API of dominate

window.D = dominate;
window.U = dominate.utils;
window.H = dominate.html;
window.I = dominate.io;

window.all = dominate;
window.one = dominate.one;

U.mix(window, dominate.tags);
