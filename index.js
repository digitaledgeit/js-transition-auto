
//Source adapted from http://n12v.com/css-transition-to-from-auto/](http://n12v.com/css-transition-to-from-auto/

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
 */
function transitionToSize(element, property, size) {
  var repaintProperty = getRepaintProperty(property);

  //don't bother transitioning if we're already there or are mid transition
  if (element.style[property] === size) {
    return;
  }
  
  //change width/height from auto or whatever size we're at to the fixed amount
  var currentSize = getStyle(element)[property];
  element.style.transitionProperty = 'none'; //disable transitions
  element.style[property] = currentSize;
  element[repaintProperty]; // force repaint
  element.style.transitionProperty = ''; //enable transitions

  //set the width/height to the new size to start the transition
  console.log('setting size:', size);
  element.style[property] = size;

}

/**
 * Transitions to auto
 * @param {HTMLElement} element
 * @param {string}      property
 */
function transitionToAuto(element, property) {
  var repaintProperty = getRepaintProperty(property);

  //calculate what the width/height of the element will be without transitioning
  var currentSize, finalSize;
  element.style.transitionProperty = 'none'; //disable transitions
  currentSize = element.style[property];
  element.style[property] = 'auto';
  finalSize = getStyle(element)[property];
  element.style[property] = currentSize;
  element[repaintProperty]; // force repaint
  element.style.transitionProperty = ''; //enable transitions

  //don't bother transitioning if we're already there or are mid transition (it'll just cause issues if its run again)
  if (element.style[property] === 'auto' || element.style[property] === finalSize) {
    return;
  }

  //set the width/height of the element to the calculated width/height to start the transition
  element.style[property] = finalSize;
  element[repaintProperty]; // force repaint

  //after the transition is finished set the width/height of the element to auto (in case content is added to the element without transitioning)
  element.addEventListener('transitionend', function transitionEnd(event) {
    if (event.propertyName == property) {
      element.style.transitionProperty = 'none'; //disable transitions
      element[repaintProperty]; // force repaint
      element.style[property] = 'auto';
      element[repaintProperty]; // force repaint
      element.style.transitionProperty = '';  //enable transitions
      element.removeEventListener('transitionend', transitionEnd, false)
    }
  }, false);

}

module.exports = function(element, cssprop, tosize) {

  if (cssprop !== 'width' && cssprop !== 'height') {
    throw new Error('Cannot transition "'+cssprop+'" property');
  }

  if (tosize === 'auto') {
    transitionToAuto(element, cssprop, tosize);
  } else {
    transitionToSize(element, cssprop, tosize);
  }

};
