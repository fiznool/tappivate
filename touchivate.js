/*!
 * Touchivate jQuery / Zepto plugin
 * Makes your mobile tappable buttons and lists feel a little more native-y
 * The perfect companion to Zepto's touch module
 * Author: @fiznool
 * Licensed under the MIT license
 *
 */

;(function ( $, window, document, undefined ) {

  // Default delays
  var listItemActivationDelay = 150;
  var buttonDeactivationDelay = 100;

  // A base handler which shares common functionaity for buttons and lists
  var Handler = function(options) {
    this.delay = options.delay;
    this.timerId = null;
    this.active = false;
  };

  Handler.prototype.activate = function($el) {
    if (!this.active) {
      $el.addClass('active');
      this.active = true;
    }
  };

  Handler.prototype.deactivate = function($el) {
    if (this.active) {
      $el.removeClass('active');
      this.active = false;
    }
  };

  Handler.prototype.cancelTimeout = function() {
    if (this.timerId) {
        clearTimeout(this.timerId);
    }
  };

  Handler.prototype.afterDelay = function(callback) {
    this.cancelTimeout();
    this.timerId = setTimeout(callback, this.delay);
  };

  Handler.prototype.cancelDelay = function(callback) {
    this.cancelTimeout();
    callback.apply(this);
  };

  // Override these three in the subclasses
  Handler.prototype.touchstart = function($el) {};
  Handler.prototype.touchmove = function($el) {};
  Handler.prototype.touchend = function($el) {};

  
  var ButtonHandler = function() {};

  ButtonHandler.prototype = new Handler({ delay: buttonDeactivationDelay });
  
  ButtonHandler.prototype.touchstart = function($el) {
    this.cancelDelay(function() { this.activate($el); });
  };

  ButtonHandler.prototype.touchend = function($el) {
    var that = this;
    this.afterDelay(function() { that.deactivate($el); });
  };


  var ListHandler = function() {};

  ListHandler.prototype = new Handler({ delay: listItemActivationDelay });

  ListHandler.prototype.touchstart = function($el) {
    var that = this;
    this.afterDelay(function() { that.activate($el); });
  };

  ListHandler.prototype.touchmove = function($el) {
    this.cancelDelay(function() { this.deactivate($el); });
  };

  ListHandler.prototype.touchend = function($el) {
    this.cancelDelay(function() { this.deactivate($el); });
  };

  var buttonHandler = new ButtonHandler();
  var listHandler = new ListHandler();

  $.fn.touchivate = function() {

    // Use jQuery.on with the passed in parent element to match
    // all children with the selector passed as the second parameter.
    // The selectors match any element with the data-tap attribute set.
    // The ~= part of the selector is a whitespace-aware selector:
    // it allows the selector to match whole words but also can match
    // multiple words separated by whitespace.
    // This is useful for lists which you want to exhibit different behaviour.
    // e.g. <div data-tap="list nav"></div>
    // would be matched by both [data-tap~="list"] and [data-tap~="nav"]
  

    this.on('touchstart', '[data-tap~="btn"]', function() {
      buttonHandler.touchstart($(this));
    });

    this.on('touchend', '[data-tap~="btn"]', function() {
      buttonHandler.touchend($(this));
    });

    this.on('touchstart', '[data-tap~="list"]', function() {
      listHandler.touchstart($(this));
    });

    this.on('touchmove', '[data-tap~="list"]', function() {
      listHandler.touchmove($(this));
    });

    this.on('touchend', '[data-tap~="nav"]', function() {
      listHandler.touchend($(this));
    });

  };

})( window.jQuery || window.Zepto, window, document );
