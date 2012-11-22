__pyy.js__ is a JavaScript library which is designed to facilitate the creation
of HTML elements in code without the need for either a templating language or
verbose method calls.



Example Usage
-------------

`pyy.js` implements functions for each HTML tag name. For example, calling the `div` function creates and returns a `<div>` element:

    document.body.appendChild(
        div('Hello World!')
    );


Tag functions accept many different arguments: strings, DOM elements, and objects.

Strings will be added as TextNodes to the element. These strings do not need to be escaped, for example:

    document.body.appendChild(
        div('I am a <div>')
    ); 

Works as expected.


Element arguments will be added as children to the created element. This allows you to nest pyy calls to create more complicated widgets:

    document.body.appendChild( 
        div(
            h1('Hello World'), 
            span('Lorem Ipsum..')
        )
    );

Object arguments set attributes on the html element:

    document.body.appendChild(
        div({id:'links'},
            a({href: "https://github.com/Knio/pyy.js"}, 'Click here!')
        )
    );


Some keys have special meanings in pyy:

* `cls` - same as 'class', to avoid the javascript reserved word
* `style` - an object containing CSS declarations. Style names can be written as both `fontSize` and `font-size`
* `on*` - event handler function. 
* `context` - the context to use when calling event handlers

An example button showing these properties:

    document.body.appendChild(
        div('Button1', {
            cls: 'button', 
            style: {border: '1px solid #000', backgroundColor: '#ccc', 'border-radius': '3px'},
            onclick: function(e) {
                alert(this + ' was clicked!');
            },
            context: 'Button1'
        })
    );



Building
--------

The library is built using `GNU Make`. 
You must have [Python][2], [Google Closure Lint][3], and
[Java][4] installed and accessible on your path.

Once built, the assembled library will be created in `/pyy.js` and `/pyy.min.js`


Developed By
------------

 * Tom Flanagan - <tom.m.flanagan@gmail.com>
 * Jake Wharton - <jakewharton@gmail.com>



License
-------

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.



 [1]: http://pyyjs.com/
 [2]: http://www.python.org/getit/
 [3]: http://code.google.com/closure/utilities/docs/linter_howto.html
 [4]: http://www.java.com/en/download/
 [5]: http://code.google.com/closure/compiler/
