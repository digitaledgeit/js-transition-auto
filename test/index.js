var assert = require('assert');
var transition = require('..');

var element;
describe('transition-auto', function() {

  describe('.transitionToAuto()', function() {

    beforeEach(function() {
      element = document.createElement('div');
      element.innerHTML = 'This is a thing!<br/>It spans over multiple lines.';
      element.style.height = '0';
      element.style.transition = 'height 1s';
      element.style.backgroundColor = '#ccbbdd';
      element.style.overflow = 'hidden';
      document.body.appendChild(element);
    });

    afterEach(function() {
      document.body.removeChild(element);
      element = null;
    });

    it('should call the callback after the transition finishes', function(done) {
      var start = Date.now();

      transition(element, 'height', 'auto', function() {
        var end = Date.now();
        assert(end-1000>=start, 'callback was called too soon');
        assert(start+1100>=end, 'Callback was called too late');
        done();
      });

    });

    it('should call the callback after the transition finishes even when the element is hidden mid-transition', function(done) {
      var start = Date.now();

      transition(element, 'height', 'auto', function() {
        var end = Date.now();
        assert(end-1000>=start, 'callback was called too soon');
        assert(start+1200>=end, 'Callback was called too late');
        done();
      });

      setTimeout(function() {
        element.style.display = 'none';
      }, 250);

    });

    it('should call the callback straight away when the element is hidden', function(done) {
      var start = Date.now();

      element.style.display = 'none';

      transition(element, 'height', 'auto', function() {
        var end = Date.now();
        assert(end-0>=start, 'callback was called too soon');
        assert(start+100>=end, 'Callback was called too late');
        done();
      });

    });

    it('should call the callback straight away when there are no transitions applied', function(done) {
      var start = Date.now();

      element.style.transitionDuration = '0s';

      transition(element, 'height', 'auto', function() {
        var end = Date.now();
        assert(end-0>=start, 'callback was called too soon');
        assert(start+100>=end, 'Callback was called too late');
        done();
      });

    });

  });

  describe('.transitionToSize()', function() {

    beforeEach(function() {
      element = document.createElement('div');
      element.innerHTML = 'This is a thing!<br/>It spans over multiple lines.';
      element.style.height = 'auto';
      element.style.transition = 'height 1s';
      element.style.backgroundColor = '#ccbbdd';
      element.style.overflow = 'hidden';
      document.body.appendChild(element);
    });

    afterEach(function() {
      document.body.removeChild(element);
      element = null;
    });

    it('should call the callback after the transition finishes', function(done) {
      var start = Date.now();

      transition(element, 'height', '0px', function() {
        var end = Date.now();
        assert(end-1000>=start, 'callback was called too soon');
        assert(start+1100>=end, 'Callback was called too late');
        done();
      });

    });

    it('should call the callback after the transition finishes even when the element is hidden mid-transition', function(done) {
      var start = Date.now();

      transition(element, 'height', '0px', function() {
        var end = Date.now();
        assert(end-1000>=start, 'callback was called too soon');
        assert(start+1200>=end, 'Callback was called too late');
        done();
      });

      setTimeout(function() {
        element.style.display = 'none';
      }, 250);

    });

    it('should call the callback straight away when the element is hidden', function(done) {
      var start = Date.now();

      element.style.display = 'none';

      transition(element, 'height', '0px', function() {
        var end = Date.now();
        assert(end-0>=start, 'callback was called too soon');
        assert(start+100>=end, 'Callback was called too late');
        done();
      });

    });

    it('should call the callback straight away when there are no transitions applied', function(done) {
      var start = Date.now();

      element.style.transitionDuration = '0s';

      transition(element, 'height', '0px', function() {
        var end = Date.now();
        assert(end-0>=start, 'callback was called too soon');
        assert(start+100>=end, 'Callback was called too late');
        done();
      });

    });

  });

});