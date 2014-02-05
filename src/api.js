// exposes the public API of pyy

window.P = pyy;
window.U = pyy.utils;
window.H = pyy.html;
window.I = pyy.io;

window.all = pyy;
window.one = pyy.one;

U.mix(window, pyy.tags);
