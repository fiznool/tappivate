/*!
 * Tappivate Zepto plugin
 * Makes your mobile tappable buttons and lists feel a little more native-y
 * The perfect companion to Zepto's touch module, also compatible with jQuery.
 * Author: @fiznool
 * Licensed under the MIT license
 *
 */

;(function ( $, window, document, undefined ) {

  var defaults = {
    listItemActivationDelay: 150,
    buttonDeactivationDelay: 100,
    onActivate: function($el) {
      $el.addClass('active');
    },
    onDeactivate: function($el) {
      $el.removeClass('active');
    },
    isActive: function($el) {
      return $el.hasClass('active');
    },
    onSelect: function($el) {
      $el.addClass('selected');
    },
    onDeselect: function($el) {
      $el.removeClass('selected');
    },
    isSelected: function($el) {
      return $el.hasClass('selected');
    }
  };

  // A base handler which shares common functionaity for buttons and lists
  var Handler = function() {
    this.timerId = null;
  };

  Handler.prototype.activate = function($el) {
    this.onActivate($el);
  };

  Handler.prototype.deactivate = function($el) {
    this.onDeactivate($el);
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

  var ButtonHandler = function(options) {
    this.delay = options.delay || defaults.buttonDeactivationDelay;
    this.onActivate = options.activate || defaults.onActivate;
    this.onDeactivate = options.deactivate || defaults.onDeactivate;
    this.isActive = options.isActive || defaults.isActive;
  };

  ButtonHandler.prototype = new Handler();

  ButtonHandler.prototype.touchstart = function($el) {
    this.cancelDelay(function() {
      this.activate($el);
    });
  };

  ButtonHandler.prototype.touchend = function($el) {
    var that = this;
    this.afterDelay(function() { that.deactivate($el); });
  };

  var ListHandler = function(options) {
    this.delay = options.delay || defaults.listItemActivationDelay;
    this.onActivate = options.activate || defaults.onActivate;
    this.onDeactivate = options.deactivate || defaults.onDeactivate;
    this.isActive = options.isActive || defaults.isActive;
    this.onSelect = options.select || defaults.onSelect;
    this.onDeselect = options.deselect || defaults.onDeselect;
    this.isSelected = options.isSelected || defaults.isSelected;
    this.isBeingTouched = false;
  };

  ListHandler.prototype = new Handler();

  ListHandler.prototype.activateEl = function($el) {
    var that = this;
    $el.siblings('.active').each(function() {
      that.deactivate($(this));
    });
    this.activate($el);
  };

  ListHandler.prototype.touchstart = function($el) {
    var that = this;
    this.isBeingTouched = true;
    this.afterDelay(function() {
      that.activateEl($el);
    });
  };

  ListHandler.prototype.touchmove = function($el) {
    var that = this;
    this.isBeingTouched = false;
    this.cancelDelay(function() {
      // if there are selected elements, re-activate them
      $el.siblings('.selected').each(function() {
        that.activate($(this));
      });
      // if this element is selected, activate it,
      // otherwise, deactivate it
      if (that.isSelected($el)) {
        that.activate($el);
      }
      else {
        that.deactivate($el);
      }
    });
  };

  ListHandler.prototype.touchend = function($el) {
    var that = this;
    if (this.isBeingTouched) {
      this.isBeingTouched = false;
      this.cancelDelay(function() {
        // deselect selected siblings and select and activate self
        $el.siblings('.selected').each(function() {
          that.onDeselect($(this));
        });
        this.onSelect($el);
        that.activateEl($el);
      });
    }
  };

  $.fn.tappivate = function(options) {

    options = options || {};

    var buttonHandler = new ButtonHandler(options);
    var listHandler = new ListHandler(options);

    // Use jQuery.on with the passed in parent element to match
    // all children with the selector passed as the second parameter.
    // The selectors match any element with the data-tap attribute set.
    // The ~= part of the selector is a whitespace-aware selector:
    // it allows the selector to match whole words but also can match
    // multiple words separated by whitespace.
    // This is useful for lists which you want to exhibit different behaviour.
    // e.g. <div data-tap="list nav"></div>
    // would be matched by both [data-tap~="list"] and [data-tap~="nav"]

    this.on('touchstart mousedown', '[data-tap~="btn"]', function(evt) {
      buttonHandler.touchstart($(this));
    });

    this.on('touchend touchleave touchcancel mouseup mouseout', '[data-tap~="btn"]', function() {
      buttonHandler.touchend($(this));
    });

    this.on('touchstart mousedown', '[data-tap~="list"] > li', function(evt) {
      listHandler.touchstart($(this));
    });

    this.on('touchmove mousemove', '[data-tap~="list"] > li', function() {
      listHandler.touchmove($(this));
    });

    this.on('touchend touchleave touchcancel mouseup mouseout', '[data-tap~="list"] > li', function() {
      listHandler.touchend($(this));
    });

    return this;
  };

})( window.Zepto || window.jQuery, window, document );