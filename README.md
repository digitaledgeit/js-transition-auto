# transition-auto

CSS transitions don't work on elements with `height: auto`. They can *kind of* be implemented with `max-height: some-fixed-height`
but the timing is never right. This function sets the width/height of an element to be the same as its computed value at `auto` so that your CSS width/height transition works (add the transition rule in your CSS).

    var transition = require('transition-auto');

    if (x) {
      transition(thing, 'height', 'auto');
    } else {
      transition(thing, 'height', 0);
    }

See [http://n12v.com/css-transition-to-from-auto/](http://n12v.com/css-transition-to-from-auto/) for more detail on the issue.