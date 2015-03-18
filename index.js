//Source adapted from http://n12v.com/css-transition-to-from-auto/](http://n12v.com/css-transition-to-from-auto/

var afterTransition = require('after-transition');
var transition = require('transition-info');

/**
 * Gets the computed element styles
 * @param   {HTMLElement} element
 * @returns {CSSStyleDeclaration}
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
 * @param   {CSSStyleDeclaration} style
 * @param   {string}              property
 * @returns {boolean}
 */
function hazTransitions(style, property) {
  return transition(style).duration(property) > 0;
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
 * Get whether the element is hidden i.e. a parent element has `display:none`
 * @param   {HTMLElement} element
 * @returns {boolean}
 */
function isHidden(element) {
  return element.offsetParent === null || (element.offsetWidth === 0 && element.offsetHeight === 0);
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
  var currentComputedStyle = getStyle(element);
  var currentComputedSize = currentComputedStyle[property];

  //don't bother transitioning if we're already there or are mid transition
  if (!isHidden(element) && (element.style[property] === size || currentComputedSize === size)) {
    if (callback) callback(); //call the callback //TODO: if we're mid transition we probably shouldn't call the callback until the transition ends???
    return;
  }

  //change width/height from auto or whatever size we're at to the fixed amount
  element.style.transitionProperty = 'none'; //disable transitions
  element.style[property] = currentComputedSize;
  element[repaintProperty]; // force repaint
  element.style.transitionProperty = ''; //enable transitions

  if (hazTransitions(currentComputedStyle, property) && !isHidden(element)) { //don't use transitions if the element is hidden (offset width/height is 0)
    var timeout;

    afterTransition.once(element, function transitionEnd() {
      window.clearTimeout(timeout);
      if (callback) callback(); //call the callback
    });

    //set a timeout in case crappy browsers like Chrome don't fire the transitionend event e.g. when a parent element is hidden (display:none) mid-transition
    var duration = transition(currentComputedStyle).duration(property)+100;
    timeout = window.setTimeout(function() {
      window.clearTimeout(timeout);
      if (callback) callback(); //call the callback
    }, duration);

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
  var currentSize, currentComputedStyle, currentComputedSize, finalSize;
  currentComputedStyle = getStyle(element);
  currentComputedSize = currentComputedStyle[property];
  element.style.transitionProperty = 'none'; //disable transitions
  currentSize = element.style[property];
  element.style[property] = 'auto';
  finalSize = getStyle(element)[property];
  element.style[property] = currentSize;
  element[repaintProperty]; // force repaint
  element.style.transitionProperty = ''; //enable transitions

  //don't bother transitioning if we're already there or are mid transition (it'll just cause issues if its run again)
  if ((!isHidden(element) && element.style[property] === '' && currentComputedSize === finalSize) || element.style[property] === 'auto' || (!isHidden(element) && element.style[property] === finalSize)) {
    if (callback) callback(); //call the callback //TODO: if we're mid transition we probably shouldn't call the callback until the transition ends???
    return;
  }

  if (hazTransitions(currentComputedStyle, property) && !isHidden(element)) { //don't use transitions if the element is hidden
    var timeout;

    function whenTransitionFinished() {
      window.clearTimeout(timeout);
      element.style.transitionProperty = 'none'; //disable transitions
      element[repaintProperty]; // force repaint
      element.style[property] = 'auto';
      element[repaintProperty]; // force repaint
      element.style.transitionProperty = '';  //enable transitions
      if (callback) callback(); //call the callback
    }

    //after the transition is finished set the width/height of the element to auto (in case content is added to the element without transitioning)
    afterTransition.once(element, function transitionEnd() {
      whenTransitionFinished()
    });

    //set a timeout in case crappy browsers like Chrome don't fire the transitionend event e.g. when a parent element is hidden (display:none) mid-transition
    var duration = transition(currentComputedStyle).duration(property)+100;
    timeout = window.setTimeout(function() {
      whenTransitionFinished();
    }, duration);

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
