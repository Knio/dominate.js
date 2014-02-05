__pyy.js__ is a JavaScript library which is designed to facilitate the creation
of HTML elements in code without the need for either a templating language or
verbose method calls.

Tests
-----

See current test suite here: 

Installation
------------

Download the latest build here:

* <http://pyy.zkpq.ca/pyy.min.js>

Or include it directly on your page:

```html
<script type="text/javascript" src="http://pyy.zkpq.ca/pyy.min.js"></script>
```

Example Usage
-------------

<script type="text/javascript" src="http://pyy.zkpq.ca/pyy.min.js"></script>

`pyy.js` includes functions for building DOM nodes and trees. Each HTML tag name is implemented as a global function, so for example calling the `div` function creates and returns a `<div>` element (which we add to the page here):

```javascript
document.body.appendChild(
    div('Hello World!')
);
```

Tag functions accept many different arguments: *strings*, *DOM elements*, and *JavaScript objects*.

### Strings

Strings will be converted to `TextNodes` and added as children to the element. These strings do not need to be escaped, and there is no possibility of cross site scripting when adding content this way. For example:

```javascript
document.body.appendChild(
    div('I am a <div>')
);
```

Works as expected, and does not interperate `"<div>"` as another div element.

### DOM Elements

DOM Element arguments will simply be added as children to the created element. This allows you to nest DOM builder calls to create comples strictures and widgets in a single expression:

```javascript
document.body.appendChild(
    div(
        h1('Hello World'),
        span('Lorem Ipsum..')
    )
);
```

### JavaScript Objects

JavaScript object arguments are used to set attributes on the element, like so:

```javascript
document.body.appendChild(
    div({id:'links'},
        a({href: "https://github.com/Knio/pyy.js"}, 'Click here!')
    )
);
```

Many key names have special meanings, used to set other properties of the element:

* `cls` - same as 'class', as a convenience to avoid the JavaScript reserved word
* `style` - an object containing CSS declarations. Style names can be declared in both forms, such as `fontSize` and `font-size`
* `on*` - an event handler function 
* `context` - the context to use when calling event handlers

An example button showing these properties:

```javascript
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
```



Developing
----------

This library is built using `GNU Make`,
[Python][2], [Google Closure Lint][3], and
[Java][4]. The makefile assumes all programs are installed and accessible on your path.

Once built, the assembled library will be created in `./pyy.js` and `./pyy.min.js`


Authors
-------

`pyy.js` is developed by:

 * Tom Flanagan - <tom.m.flanagan@gmail.com>
 * Jake Wharton - <jakewharton@gmail.com>

And the homepage is located at [github.com/Knio/pyy.js](//github.com/Knio/pyy.js) 


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



 [1]: http://github.com/Knio/pyy.js
 [2]: http://www.python.org/getit/
 [3]: http://code.google.com/closure/utilities/docs/linter_howto.html
 [4]: http://www.java.com/en/download/
 [5]: http://code.google.com/closure/compiler/
