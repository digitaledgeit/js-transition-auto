//Source adapted from http://n12v.com/css-transition-to-from-auto/](http://n12v.com/css-transition-to-from-auto/

var afterTransition = require('after-transition');

/**
 * Gets the computed element styles
 * @param   {HTMLElement} element
 * @returns {object}
 */
function getStyle(element) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(element);
  } else {
    return element.currentStyle; //IE8
  }
}

/**
 * Get whether transitions are set on the element
 * @param   {HTMLElement} element
 * @returns {Boolean}
 */
function hazTransitions(element) {
  var style = getStyle(element)
  var duration = style.transitionDuration;
  return duration !== '' && parseFloat(duration) !== 0;
}

/**
 * Gets the name of the property used to force a repaint of CSS
 * @param   {string} property
 * @returns {string}
 */
function getRepaintProperty(property) {
  return 'offset'+property.charAt(0).toUpperCase()+property.substr(1);
}

/**
 * Transitions to a specific size
 * @param {HTMLElement} element
 * @param {string}      property
 * @param {string}      size
 * @param {function}    [callback]
 */
function transitionToSize(element, property, size, callback) {
  var repaintProperty = getRepaintProperty(property);

  //browser returns sizes in px so transform the user's size too
  if (size == '0') {
    size = '0px';
  }

  //get the current computed size
  var currentComputedSize = getStyle(element)[property];

  //don't bother transitioning if we're already there or are mid transition
  if (element.style[property] === size || currentComputedSize === size) {
    if (callback) callback(); //call the callback //TODO: if we're mid transition we probably shouldn't call the callback until the transition ends???
    return;
  }

  //change width/height from auto or whatever size we're at to the fixed amount
  element.style.transitionProperty = 'none'; //disable transitions
  element.style[property] = currentComputedSize;
  element[repaintProperty]; // force repaint
  element.style.transitionProperty = ''; //enable transitions

  if (hazTransitions(element) && (element.offsetWidth !== 0 || element.offsetHeight !== 0)) { //don't use transitions if the element is hidden (offset width/height is 0)

    afterTransition.once(element, function transitionEnd() {
      if (callback) callback(); //call the callback
    });

    //set the width/height to the new size to start the transition
    element.style[property] = size;
    element[repaintProperty]; // force repaint

  } else {

    //set the width/height to the new size to start the transition
    element.style[property] = size;
    element[repaintProperty]; // force repaint

    if (callback) callback(); //call the callback

  }
}

/**
 * Transitions to auto
 * @param {HTMLElement} element
 * @param {string}      property
 * @param {function}    [callback]
 */
function transitionToAuto(element, property, callback) {
  var repaintProperty = getRepaintProperty(property);

  //calculate what the width/height of the element will be without transitioning
  var currentSize, currentComputedSize, finalSize;
  currentComputedSize = getStyle(element)[property];
  element.style.transitionProperty = 'none'; //disable transitions
  currentSize = element.style[property];
  element.style[property] = 'auto';
  finalSize = getStyle(element)[property];
  element.style[property] = currentSize;
  element[repaintProperty]; // force repaint
  element.style.transitionProperty = ''; //enable transitions

  //don't bother transitioning if we're already there or are mid transition (it'll just cause issues if its run again)
  if ((element.style[property] === '' && currentComputedSize === finalSize) || element.style[property] === 'auto' || element.style[property] === finalSize) {
    if (callback) callback(); //call the callback //TODO: if we're mid transition we probably shouldn't call the callback until the transition ends???
    return;
  }

  if (hazTransitions(element) && (element.offsetWidth !== 0 || element.offsetHeight !== 0)) { //don't use transitions if the element is hidden (offset width/height is 0)

    //after the transition is finished set the width/height of the element to auto (in case content is added to the element without transitioning)
    afterTransition.once(element, function transitionEnd() {
      element.style.transitionProperty = 'none'; //disable transitions
      element[repaintProperty]; // force repaint
      element.style[property] = 'auto';
      element[repaintProperty]; // force repaint
      element.style.transitionProperty = '';  //enable transitions
      element.removeEventListener('transitionend', transitionEnd, false)
      if (callback) callback(); //call the callback
    });

    //set the width/height of the element to the calculated width/height to start the transition
    element.style[property] = finalSize;
    element[repaintProperty]; // force repaint

  } else {

    //set the width/height of the element to the calculated width/height to start the transition
    element.style[property] = 'auto';
    element[repaintProperty]; // force repaint

    if (callback) callback(); //call the callback

  }

}

module.exports = function(element, cssprop, tosize, callback) {

  if (cssprop !== 'width' && cssprop !== 'height') {
    throw new Error('Cannot transition "'+cssprop+'" property');
  }

  if (tosize === 'auto') {
    transitionToAuto(element, cssprop, callback);
  } else {
    transitionToSize(element, cssprop, tosize, callback);
  }

};
