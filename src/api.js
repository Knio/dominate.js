// exposes the public API of pyy

window.P = pyy;
window.U = pyy.utils;
window.H = pyy.html;
window.I = pyy.io;

window.one = pyy.one;
window.all = pyy;

U.mix(window, pyy.tags);
