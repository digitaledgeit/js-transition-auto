# transition-auto

CSS transitions don't work on elements with `height: auto`. They can *kind of* be implemented with `max-height: some-fixed-height`
but the transition timing is never right. This function sets the width/height of an element to be the same as its computed
value at `auto` so that your CSS width/height transition works (add the transition rule in your CSS).

## Installation

Browserify:
 
    npm install --save @digitaledgeit/transition-auto
  
Component

    component install digitaledgeit/js-transition-auto

## Usage

    var transition = require('transition-auto');

    if (x) {
      transition(thing, 'height', 'auto');
    } else {
      transition(thing, 'height', 0);
    }

See `test/example.html` for a working example.

See [http://n12v.com/css-transition-to-from-auto/](http://n12v.com/css-transition-to-from-auto/) for more detail on the issue.

## License

The MIT License (MIT)

Copyright (c) 2015 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.