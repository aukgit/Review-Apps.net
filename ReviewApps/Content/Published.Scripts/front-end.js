///#source 1 1 /JavaScript-Mvc-framework/libs/DevOrgPlugins/byId.js
/**!
 * Written by Alim Ul Karim
 * Email: devorg.bd{at}gmail.com
 * Dated : 10 Jun 2015
 * Version : 1.0
 * Performance test against jQuery http://jsperf.com/jquery-vs-fasterjquery
 * @param {string} elementIdString 
 * @returns a jQuery object. 
 */
;$.byId = function (elementIdString) {
    /// <summary>
    /// Get your element by id, there is no need to use #.
    /// However if there is a hash then it will be removed.
    /// </summary>
    /// <param name="findElementById">Your element id, there is no need to use #</param>
    /// <returns>jQuery object , check length property to understand if any exist</returns>
    if (elementIdString !== undefined && elementIdString !== null && elementIdString !== "" && typeof elementIdString === 'string') {
        var elementsById;
        if (elementIdString.charAt(0) !== "#") {
            elementsById = document.getElementById(elementIdString);
            return $(elementsById);
        } else {
            var newId = elementIdString.slice(1, elementIdString.length);
            elementsById = document.getElementById(newId);
            return $(elementsById);
        }
    }
    return $(null);
}

///#source 1 1 /JavaScript-Mvc-framework/libs/bootstrap.js
/*
 * Bootstrap v3.3.4 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.4
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.4
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.4'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.4
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.4'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.4
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.4'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.4
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.4'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.4
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.4'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.4
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.4'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.4
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.4'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.4
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.4'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.4
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.4'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.4
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.4'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.4
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.4'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $(document.body).height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

///#source 1 1 /JavaScript-Mvc-framework/libs/star-rating.js
/*
 * @copyright &copy; Kartik Visweswaran, Krajee.com, 2014
 * @version 3.0.0
 *
 * A simple yet powerful JQuery star rating plugin that allows rendering
 * fractional star ratings and supports Right to Left (RTL) input.
 * 
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
(function ($) {
    var DEFAULT_MIN = 0;
    var DEFAULT_MAX = 5;
    var DEFAULT_STEP = 0.5;

    var isEmpty = function (value, trim) {
        return typeof value === 'undefined' || value === null || value === undefined || value == []
            || value === '' || trim && $.trim(value) === '';
    };

    var validateAttr = function ($input, vattr, options) {
        var chk = isEmpty($input.data(vattr)) ? $input.attr(vattr) : $input.data(vattr);
        if (chk) {
            return chk;
        }
        return options[vattr];
    };

    var getDecimalPlaces = function (num) {
        var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) {
            return 0;
        }
        return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
    };

    var applyPrecision = function (val, precision) {
        return parseFloat(val.toFixed(precision));
    };

    // Rating public class definition
    var Rating = function (element, options) {
        this.$element = $(element);
        this.init(options);
    };

    Rating.prototype = {
        constructor: Rating,
        _parseAttr: function (vattr, options) {
            var self = this, $input = self.$element;
            if ($input.attr('type') === 'range' || $input.attr('type') === 'number') {
                var val = validateAttr($input, vattr, options);
                var chk = DEFAULT_STEP;
                if (vattr === 'min') {
                    chk = DEFAULT_MIN;
                }
                else if (vattr === 'max') {
                    chk = DEFAULT_MAX;
                }
                else if (vattr === 'step') {
                    chk = DEFAULT_STEP;
                }
                var final = isEmpty(val) ? chk : val;
                return parseFloat(final);
            }
            return parseFloat(options[vattr]);
        },
        /**
         * Listens to events
         */
        listen: function () {
            var self = this;
            self.$rating.on("click", function (e) {
                if (self.inactive) {
                    return;
                }
                var w = e.pageX - self.$rating.offset().left;
                self.setStars(w);
                self.$element.trigger('change');
                self.$element.trigger('rating.change', [self.$element.val(), self.$caption.html()]);
                self.starClicked = true
            });
            self.$rating.on("mousemove", function (e) {
                if (!self.hoverEnabled || self.inactive) {
                    return;
                }
                self.starClicked = false;
                var pos = e.pageX - self.$rating.offset().left, out = self.calculate(pos);
                self.toggleHover(out);
                self.$element.trigger('rating.hover', [out.val, out.caption, 'stars']);
            });
            self.$rating.on("mouseleave", function (e) {
                if (!self.hoverEnabled || self.inactive || self.starClicked) {
                    return;
                }
                var out = self.cache;
                self.toggleHover(out);
                self.$element.trigger('rating.hoverleave', ['stars']);
            });
            self.$clear.on("mousemove", function (e) {
                if (!self.hoverEnabled || self.inactive || !self.hoverOnClear) {
                    return;
                }
                self.clearClicked = false;
                var caption = '<span class="' + self.clearCaptionClass + '">' + self.clearCaption + '</span>',
                    val = self.clearValue, width = self.getWidthFromValue(val), out;
                out = { caption: caption, width: width, val: val };
                self.toggleHover(out);
                self.$element.trigger('rating.hover', [val, caption, 'clear']);
            });
            self.$clear.on("mouseleave", function (e) {
                if (!self.hoverEnabled || self.inactive || self.clearClicked || !self.hoverOnClear) {
                    return;
                }
                var out = self.cache;
                self.toggleHover(out);
                self.$element.trigger('rating.hoverleave', ['clear']);
            });
            self.$clear.on("click", function (e) {
                if (!self.inactive) {
                    self.clear();
                    self.clearClicked = true;
                }
            });
            $(self.$element[0].form).on("reset", function (e) {
                if (!self.inactive) {
                    self.reset();
                }
            });
        },
        initSlider: function (options) {
            var self = this;
            if (isEmpty(self.$element.val())) {
                self.$element.val(0);
            }
            self.initialValue = self.$element.val();
            self.min = (typeof options.min !== 'undefined') ? options.min : self._parseAttr('min', options);
            self.max = (typeof options.max !== 'undefined') ? options.max : self._parseAttr('max', options);
            self.step = (typeof options.step !== 'undefined') ? options.step : self._parseAttr('step', options);
            if (isNaN(self.min) || isEmpty(self.min)) {
                self.min = DEFAULT_MIN;
            }
            if (isNaN(self.max) || isEmpty(self.max)) {
                self.max = DEFAULT_MAX;
            }
            if (isNaN(self.step) || isEmpty(self.step) || self.step == 0) {
                self.step = DEFAULT_STEP;
            }
            self.diff = self.max - self.min;
        },
        /**
         * Initializes the plugin
         */
        init: function (options) {
            var self = this;
            self.options = options;
            self.hoverEnabled = options.hoverEnabled;
            self.hoverChangeCaption = options.hoverChangeCaption;
            self.hoverChangeStars = options.hoverChangeStars;
            self.hoverOnClear = options.hoverOnClear;
            self.starClicked = false;
            self.clearClicked = false;
            self.initSlider(options);
            self.checkDisabled();
            $element = self.$element;
            self.containerClass = options.containerClass;
            self.glyphicon = options.glyphicon;
            var defaultStar = (self.glyphicon) ? '\ue006' : '\u2605';
            self.symbol = isEmpty(options.symbol) ? defaultStar : options.symbol;
            self.rtl = options.rtl || self.$element.attr('dir');
            if (self.rtl) {
                self.$element.attr('dir', 'rtl');
            }
            self.showClear = options.showClear;
            self.showCaption = options.showCaption;
            self.size = options.size;
            self.stars = options.stars;
            self.defaultCaption = options.defaultCaption;
            self.starCaptions = options.starCaptions;
            self.starCaptionClasses = options.starCaptionClasses;
            self.clearButton = options.clearButton;
            self.clearButtonTitle = options.clearButtonTitle;
            self.clearButtonBaseClass = !isEmpty(options.clearButtonBaseClass) ? options.clearButtonBaseClass : 'clear-rating';
            self.clearButtonActiveClass = !isEmpty(options.clearButtonActiveClass) ? options.clearButtonActiveClass : 'clear-rating-active';
            self.clearCaption = options.clearCaption;
            self.clearCaptionClass = options.clearCaptionClass;
            self.clearValue = options.clearValue;
            self.$element.removeClass('form-control').addClass('form-control');
            self.$clearElement = isEmpty(options.clearElement) ? null : $(options.clearElement);
            self.$captionElement = isEmpty(options.captionElement) ? null : $(options.captionElement);
            if (typeof self.$rating == 'undefined' && typeof self.$container == 'undefined') {
                self.$rating = $(document.createElement("div")).html('<div class="rating-stars"></div>');
                self.$container = $(document.createElement("div"));
                self.$container.before(self.$rating);
                self.$container.append(self.$rating);
                self.$element.before(self.$container).appendTo(self.$rating);
            }
            self.$stars = self.$rating.find('.rating-stars');
            self.generateRating();
            self.$clear = !isEmpty(self.$clearElement) ? self.$clearElement : self.$container.find('.' + self.clearButtonBaseClass);
            self.$caption = !isEmpty(self.$captionElement) ? self.$captionElement : self.$container.find(".caption");
            self.setStars();
            self.$element.hide();
            self.listen();
            if (self.showClear) {
                self.$clear.attr({ "class": self.getClearClass() });
            }
            self.cache = {
                caption: self.$caption.html(),
                width: self.$stars.width(),
                val: self.$element.val()
            };
            self.$element.removeClass('rating-loading');
        },
        checkDisabled: function () {
            var self = this;
            self.disabled = validateAttr(self.$element, 'disabled', self.options);
            self.readonly = validateAttr(self.$element, 'readonly', self.options);
            self.inactive = (self.disabled || self.readonly);
        },
        getClearClass: function () {
            return this.clearButtonBaseClass + ' ' + ((this.inactive) ? '' : this.clearButtonActiveClass);
        },
        generateRating: function () {
            var self = this, clear = self.renderClear(), caption = self.renderCaption(),
                css = (self.rtl) ? 'rating-container-rtl' : 'rating-container',
                stars = self.getStars();
            css += (self.glyphicon) ? ((self.symbol == '\ue006') ? ' rating-gly-star' : ' rating-gly') : ' rating-uni';
            self.$rating.attr('class', css);
            self.$rating.attr('data-content', stars);
            self.$stars.attr('data-content', stars);
            var css = self.rtl ? 'star-rating-rtl' : 'star-rating';
            self.$container.attr('class', css + ' rating-' + self.size);

            if (self.inactive) {
                self.$container.removeClass('rating-active').addClass('rating-disabled');
            }
            else {
                self.$container.removeClass('rating-disabled').addClass('rating-active');
            }

            if (typeof self.$caption == 'undefined' && typeof self.$clear == 'undefined') {
                if (self.rtl) {
                    self.$container.prepend(caption).append(clear);
                }
                else {
                    self.$container.prepend(clear).append(caption);
                }
            }
            if (!isEmpty(self.containerClass)) {
                self.$container.removeClass(self.containerClass).addClass(self.containerClass);
            }
        },
        getStars: function () {
            var self = this, numStars = self.stars, stars = '';
            for (var i = 1; i <= numStars; i++) {
                stars += self.symbol;
            }
            return stars;
        },
        renderClear: function () {
            var self = this;
            if (!self.showClear) {
                return '';
            }
            var css = self.getClearClass();
            if (!isEmpty(self.$clearElement)) {
                self.$clearElement.removeClass(css).addClass(css).attr({ "title": self.clearButtonTitle });
                self.$clearElement.html(self.clearButton);
                return '';
            }
            return '<div class="' + css + '" title="' + self.clearButtonTitle + '">' + self.clearButton + '</div>';
        },
        renderCaption: function () {
            var self = this, val = self.$element.val();
            if (!self.showCaption) {
                return '';
            }
            var html = self.fetchCaption(val);
            if (!isEmpty(self.$captionElement)) {
                self.$captionElement.removeClass('caption').addClass('caption').attr({ "title": self.clearCaption });
                self.$captionElement.html(html);
                return '';
            }
            return '<div class="caption">' + html + '</div>';
        },
        fetchCaption: function (rating) {
            var self = this;
            var val = parseFloat(rating), css, cap;
            if (typeof (self.starCaptionClasses) == "function") {
                css = isEmpty(self.starCaptionClasses(val)) ? self.clearCaptionClass : self.starCaptionClasses(val);
            } else {
                css = isEmpty(self.starCaptionClasses[val]) ? self.clearCaptionClass : self.starCaptionClasses[val];
            }
            if (typeof (self.starCaptions) == "function") {
                var cap = isEmpty(self.starCaptions(val)) ? self.defaultCaption.replace(/\{rating\}/g, val) : self.starCaptions(val);
            } else {
                var cap = isEmpty(self.starCaptions[val]) ? self.defaultCaption.replace(/\{rating\}/g, val) : self.starCaptions[val];
            }
            var caption = (val == self.clearValue) ? self.clearCaption : cap;
            return '<span class="' + css + '">' + caption + '</span>';
        },
        getWidthFromValue: function (val) {
            var self = this, min = self.min, max = self.max, step = self.step;
            if (val <= min || min == max) {
                return 0;
            }
            if (val >= max) {
                return 100;
            }
            return (val - min) * 100 / (max - min);
        },
        getValueFromPosition: function (pos) {
            var self = this, precision = getDecimalPlaces(self.step),
                percentage, val, maxWidth = self.$rating.width();
            percentage = (pos / maxWidth);
            if (self.rtl) {
                val = (self.min + Math.floor(self.diff * percentage / self.step) * self.step);
            }
            else {
                val = (self.min + Math.ceil(self.diff * percentage / self.step) * self.step);
            }
            if (val < self.min) {
                val = self.min;
            }
            else if (val > self.max) {
                val = self.max;
            }
            val = applyPrecision(parseFloat(val), precision);
            if (self.rtl) {
                val = self.max - val;
            }
            return val;
        },
        toggleHover: function (out) {
            var self = this;
            if (self.hoverChangeCaption) {
                var caption = out.val <= self.clearValue ? self.fetchCaption(self.clearValue) : out.caption;
                self.$caption.html(caption);
            }
            if (self.hoverChangeStars) {
                var w = self.getWidthFromValue(self.clearValue),
                    width = out.val <= self.clearValue ? (self.rtl ? (100 - w) + '%' : w + '%') : out.width;
                self.$stars.css('width', width);
            }
        },
        calculate: function (pos) {
            var self = this, defaultVal = isEmpty(self.$element.val()) ? 0 : self.$element.val(),
                val = arguments.length ? self.getValueFromPosition(pos) : defaultVal,
                caption = self.fetchCaption(val), width = self.getWidthFromValue(val);
            if (self.rtl) {
                width = 100 - width;
            }
            width += '%';
            return { caption: caption, width: width, val: val };
        },
        setStars: function (pos) {
            var self = this, out = arguments.length ? self.calculate(pos) : self.calculate();
            self.$element.val(out.val);
            self.$stars.css('width', out.width);
            self.$caption.html(out.caption);
            self.cache = out
        },
        clear: function () {
            var self = this;
            var title = '<span class="' + self.clearCaptionClass + '">' + self.clearCaption + '</span>';
            self.$stars.removeClass('rated');
            if (!self.inactive) {
                self.$caption.html(title);
            }
            self.$element.val(self.clearValue);
            self.setStars();
            self.$element.trigger('rating.clear');
        },
        reset: function () {
            var self = this;
            self.$element.val(self.initialValue);
            self.setStars();
            self.$element.trigger('rating.reset');
        },
        update: function (val) {
            if (arguments.length > 0) {
                var self = this;
                self.$element.val(val);
                self.setStars();
            }
        },
        refresh: function (options) {
            var self = this;
            if (arguments.length) {
                var cap = '';
                self.init($.extend(self.options, options));
                if (self.showClear) {
                    self.$clear.show();
                }
                else {
                    self.$clear.hide();
                }
                if (self.showCaption) {
                    self.$caption.show();
                }
                else {
                    self.$caption.hide();
                }
            }
        }
    };

    //Star rating plugin definition
    $.fn.rating = function (option) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
                data = $this.data('rating'),
                options = typeof option === 'object' && option;

            if (!data) {
                $this.data('rating', (data = new Rating(this, $.extend({}, $.fn.rating.defaults, options, $(this).data()))));
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    };

    $.fn.rating.defaults = {
        stars: 5,
        glyphicon: true,
        symbol: null,
        disabled: false,
        readonly: false,
        rtl: false,
        size: 'md',
        showClear: true,
        showCaption: true,
        defaultCaption: '{rating} Stars',
        starCaptions: {
            0.5: 'Half Star',
            1: 'One Star',
            1.5: 'One & Half Star',
            2: 'Two Stars',
            2.5: 'Two & Half Stars',
            3: 'Three Stars',
            3.5: 'Three & Half Stars',
            4: 'Four Stars',
            4.5: 'Four & Half Stars',
            5: 'Five Stars'
        },
        starCaptionClasses: {
            0.5: 'label label-danger',
            1: 'label label-danger',
            1.5: 'label label-warning',
            2: 'label label-warning',
            2.5: 'label label-info',
            3: 'label label-info',
            3.5: 'label label-primary',
            4: 'label label-primary',
            4.5: 'label label-success',
            5: 'label label-success'
        },
        clearButton: '<i class="glyphicon glyphicon-minus-sign"></i>',
        clearButtonTitle: 'Clear',
        clearButtonBaseClass: 'clear-rating',
        clearButtonActiveClass: 'clear-rating-active',
        //clearCaption: 'Not Rated',
        clearCaption: '0',
        clearCaptionClass: 'label label-default',
        clearValue: 0,
        captionElement: null,
        clearElement: null,
        containerClass: null,
        hoverEnabled: true,
        hoverChangeCaption: true,
        hoverChangeStars: true,
        hoverOnClear: true
    };


    /**
     * Convert automatically number inputs with class 'rating'
     * into the star rating control.
     */
    $('input.rating').addClass('rating-loading');

    $(document).ready(function () {
        var $input = $('input.rating'), count = Object.keys($input).length;
        if (count > 0) {
            $input.rating();
        }
    });
}(jQuery));
///#source 1 1 /JavaScript-Mvc-framework/libs/toastr.js
/*
 * Toastr
 * Copyright 2012-2015
 * Authors: John Papa, Hans Fjällemark, and Tim Ferrell.
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * ARIA Support: Greta Krafsig
 *
 * Project: https://github.com/CodeSeven/toastr
 */
/* global define */
(function (define) {
    define(['jquery'], function ($) {
        return (function () {
            var $container;
            var listener;
            var toastId = 0;
            var toastType = {
                error: 'error',
                info: 'info',
                success: 'success',
                warning: 'warning'
            };

            var toastr = {
                clear: clear,
                remove: remove,
                error: error,
                getContainer: getContainer,
                info: info,
                options: {},
                subscribe: subscribe,
                success: success,
                version: '2.1.2',
                warning: warning
            };

            var previousToast;

            return toastr;

            ////////////////

            function error(message, title, optionsOverride) {
                return notify({
                    type: toastType.error,
                    iconClass: getOptions().iconClasses.error,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function getContainer(options, create) {
                if (!options) { options = getOptions(); }
                $container = $('#' + options.containerId);
                if ($container.length) {
                    return $container;
                }
                if (create) {
                    $container = createContainer(options);
                }
                return $container;
            }

            function info(message, title, optionsOverride) {
                return notify({
                    type: toastType.info,
                    iconClass: getOptions().iconClasses.info,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function subscribe(callback) {
                listener = callback;
            }

            function success(message, title, optionsOverride) {
                return notify({
                    type: toastType.success,
                    iconClass: getOptions().iconClasses.success,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function warning(message, title, optionsOverride) {
                return notify({
                    type: toastType.warning,
                    iconClass: getOptions().iconClasses.warning,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function clear($toastElement, clearOptions) {
                var options = getOptions();
                if (!$container) { getContainer(options); }
                if (!clearToast($toastElement, options, clearOptions)) {
                    clearContainer(options);
                }
            }

            function remove($toastElement) {
                var options = getOptions();
                if (!$container) { getContainer(options); }
                if ($toastElement && $(':focus', $toastElement).length === 0) {
                    removeToast($toastElement);
                    return;
                }
                if ($container.children().length) {
                    $container.remove();
                }
            }

            // internal functions

            function clearContainer (options) {
                var toastsToClear = $container.children();
                for (var i = toastsToClear.length - 1; i >= 0; i--) {
                    clearToast($(toastsToClear[i]), options);
                }
            }

            function clearToast ($toastElement, options, clearOptions) {
                var force = clearOptions && clearOptions.force ? clearOptions.force : false;
                if ($toastElement && (force || $(':focus', $toastElement).length === 0)) {
                    $toastElement[options.hideMethod]({
                        duration: options.hideDuration,
                        easing: options.hideEasing,
                        complete: function () { removeToast($toastElement); }
                    });
                    return true;
                }
                return false;
            }

            function createContainer(options) {
                $container = $('<div/>')
                    .attr('id', options.containerId)
                    .addClass(options.positionClass)
                    .attr('aria-live', 'polite')
                    .attr('role', 'alert');

                $container.appendTo($(options.target));
                return $container;
            }

            function getDefaults() {
                return {
                    tapToDismiss: true,
                    toastClass: 'toast',
                    containerId: 'toast-container',
                    debug: false,

                    showMethod: 'fadeIn', //fadeIn, slideDown, and show are built into jQuery
                    showDuration: 300,
                    showEasing: 'swing', //swing and linear are built into jQuery
                    onShown: undefined,
                    hideMethod: 'fadeOut',
                    hideDuration: 1000,
                    hideEasing: 'swing',
                    onHidden: undefined,
                    closeMethod: false,
                    closeDuration: false,
                    closeEasing: false,

                    extendedTimeOut: 1000,
                    iconClasses: {
                        error: 'toast-error',
                        info: 'toast-info',
                        success: 'toast-success',
                        warning: 'toast-warning'
                    },
                    iconClass: 'toast-info',
                    positionClass: 'toast-top-right',
                    timeOut: 5000, // Set timeOut and extendedTimeOut to 0 to make it sticky
                    titleClass: 'toast-title',
                    messageClass: 'toast-message',
                    escapeHtml: false,
                    target: 'body',
                    closeHtml: '<button type="button">&times;</button>',
                    newestOnTop: true,
                    preventDuplicates: false,
                    progressBar: false
                };
            }

            function publish(args) {
                if (!listener) { return; }
                listener(args);
            }

            function notify(map) {
                var options = getOptions();
                var iconClass = map.iconClass || options.iconClass;

                if (typeof (map.optionsOverride) !== 'undefined') {
                    options = $.extend(options, map.optionsOverride);
                    iconClass = map.optionsOverride.iconClass || iconClass;
                }

                if (shouldExit(options, map)) { return; }

                toastId++;

                $container = getContainer(options, true);

                var intervalId = null;
                var $toastElement = $('<div/>');
                var $titleElement = $('<div/>');
                var $messageElement = $('<div/>');
                var $progressElement = $('<div/>');
                var $closeElement = $(options.closeHtml);
                var progressBar = {
                    intervalId: null,
                    hideEta: null,
                    maxHideTime: null
                };
                var response = {
                    toastId: toastId,
                    state: 'visible',
                    startTime: new Date(),
                    options: options,
                    map: map
                };

                personalizeToast();

                displayToast();

                handleEvents();

                publish(response);

                if (options.debug && console) {
                    console.log(response);
                }

                return $toastElement;

                function escapeHtml(source) {
                    if (source == null)
                        source = "";

                    return new String(source)
                        .replace(/&/g, '&amp;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                }

                function personalizeToast() {
                    setIcon();
                    setTitle();
                    setMessage();
                    setCloseButton();
                    setProgressBar();
                    setSequence();
                }

                function handleEvents() {
                    $toastElement.hover(stickAround, delayedHideToast);
                    if (!options.onclick && options.tapToDismiss) {
                        $toastElement.click(hideToast);
                    }

                    if (options.closeButton && $closeElement) {
                        $closeElement.click(function (event) {
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            } else if (event.cancelBubble !== undefined && event.cancelBubble !== true) {
                                event.cancelBubble = true;
                            }
                            hideToast(true);
                        });
                    }

                    if (options.onclick) {
                        $toastElement.click(function (event) {
                            options.onclick(event);
                            hideToast();
                        });
                    }
                }

                function displayToast() {
                    $toastElement.hide();

                    $toastElement[options.showMethod](
                        {duration: options.showDuration, easing: options.showEasing, complete: options.onShown}
                    );

                    if (options.timeOut > 0) {
                        intervalId = setTimeout(hideToast, options.timeOut);
                        progressBar.maxHideTime = parseFloat(options.timeOut);
                        progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
                        if (options.progressBar) {
                            progressBar.intervalId = setInterval(updateProgress, 10);
                        }
                    }
                }

                function setIcon() {
                    if (map.iconClass) {
                        $toastElement.addClass(options.toastClass).addClass(iconClass);
                    }
                }

                function setSequence() {
                    if (options.newestOnTop) {
                        $container.prepend($toastElement);
                    } else {
                        $container.append($toastElement);
                    }
                }

                function setTitle() {
                    if (map.title) {
                        $titleElement.append(!options.escapeHtml ? map.title : escapeHtml(map.title)).addClass(options.titleClass);
                        $toastElement.append($titleElement);
                    }
                }

                function setMessage() {
                    if (map.message) {
                        $messageElement.append(!options.escapeHtml ? map.message : escapeHtml(map.message)).addClass(options.messageClass);
                        $toastElement.append($messageElement);
                    }
                }

                function setCloseButton() {
                    if (options.closeButton) {
                        $closeElement.addClass('toast-close-button').attr('role', 'button');
                        $toastElement.prepend($closeElement);
                    }
                }

                function setProgressBar() {
                    if (options.progressBar) {
                        $progressElement.addClass('toast-progress');
                        $toastElement.prepend($progressElement);
                    }
                }

                function shouldExit(options, map) {
                    if (options.preventDuplicates) {
                        if (map.message === previousToast) {
                            return true;
                        } else {
                            previousToast = map.message;
                        }
                    }
                    return false;
                }

                function hideToast(override) {
                    var method = override && options.closeMethod !== false ? options.closeMethod : options.hideMethod;
                    var duration = override && options.closeDuration !== false ?
                        options.closeDuration : options.hideDuration;
                    var easing = override && options.closeEasing !== false ? options.closeEasing : options.hideEasing;
                    if ($(':focus', $toastElement).length && !override) {
                        return;
                    }
                    clearTimeout(progressBar.intervalId);
                    return $toastElement[method]({
                        duration: duration,
                        easing: easing,
                        complete: function () {
                            removeToast($toastElement);
                            if (options.onHidden && response.state !== 'hidden') {
                                options.onHidden();
                            }
                            response.state = 'hidden';
                            response.endTime = new Date();
                            publish(response);
                        }
                    });
                }

                function delayedHideToast() {
                    if (options.timeOut > 0 || options.extendedTimeOut > 0) {
                        intervalId = setTimeout(hideToast, options.extendedTimeOut);
                        progressBar.maxHideTime = parseFloat(options.extendedTimeOut);
                        progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
                    }
                }

                function stickAround() {
                    clearTimeout(intervalId);
                    progressBar.hideEta = 0;
                    $toastElement.stop(true, true)[options.showMethod](
                        {duration: options.showDuration, easing: options.showEasing}
                    );
                }

                function updateProgress() {
                    var percentage = ((progressBar.hideEta - (new Date().getTime())) / progressBar.maxHideTime) * 100;
                    $progressElement.width(percentage + '%');
                }
            }

            function getOptions() {
                return $.extend({}, getDefaults(), toastr.options);
            }

            function removeToast($toastElement) {
                if (!$container) { $container = getContainer(); }
                if ($toastElement.is(':visible')) {
                    return;
                }
                $toastElement.remove();
                $toastElement = null;
                if ($container.children().length === 0) {
                    $container.remove();
                    previousToast = undefined;
                }
            }

        })();
    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    if (typeof module !== 'undefined' && module.exports) { //Node
        module.exports = factory(require('jquery'));
    } else {
        window.toastr = factory(window.jQuery);
    }
}));

///#source 1 1 /JavaScript-Mvc-framework/libs/underscore.js
//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function () {

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var
      push = ArrayProto.push,
      slice = ArrayProto.slice,
      concat = ArrayProto.concat,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
      nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeBind = FuncProto.bind;

    // Create a safe reference to the Underscore object for use below.
    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '1.7.0';

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var createCallback = function (func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1: return function (value) {
                return func.call(context, value);
            };
            case 2: return function (value, other) {
                return func.call(context, value, other);
            };
            case 3: return function (value, index, collection) {
                return func.call(context, value, index, collection);
            };
            case 4: return function (accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };

    // A mostly-internal function to generate callbacks that can be applied
    // to each element in a collection, returning the desired result — either
    // identity, an arbitrary callback, a property matcher, or a property accessor.
    _.iteratee = function (value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return createCallback(value, context, argCount);
        if (_.isObject(value)) return _.matches(value);
        return _.property(value);
    };

    // Collection Functions
    // --------------------

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.
    _.each = _.forEach = function (obj, iteratee, context) {
        if (obj == null) return obj;
        iteratee = createCallback(iteratee, context);
        var i, length = obj.length;
        if (length === +length) {
            for (i = 0; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };

    // Return the results of applying the iteratee to each element.
    _.map = _.collect = function (obj, iteratee, context) {
        if (obj == null) return [];
        iteratee = _.iteratee(iteratee, context);
        var keys = obj.length !== +obj.length && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length),
            currentKey;
        for (var index = 0; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    var reduceError = 'Reduce of empty array with no initial value';

    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`.
    _.reduce = _.foldl = _.inject = function (obj, iteratee, memo, context) {
        if (obj == null) obj = [];
        iteratee = createCallback(iteratee, context, 4);
        var keys = obj.length !== +obj.length && _.keys(obj),
            length = (keys || obj).length,
            index = 0, currentKey;
        if (arguments.length < 3) {
            if (!length) throw new TypeError(reduceError);
            memo = obj[keys ? keys[index++] : index++];
        }
        for (; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
    };

    // The right-associative version of reduce, also known as `foldr`.
    _.reduceRight = _.foldr = function (obj, iteratee, memo, context) {
        if (obj == null) obj = [];
        iteratee = createCallback(iteratee, context, 4);
        var keys = obj.length !== +obj.length && _.keys(obj),
            index = (keys || obj).length,
            currentKey;
        if (arguments.length < 3) {
            if (!index) throw new TypeError(reduceError);
            memo = obj[keys ? keys[--index] : --index];
        }
        while (index--) {
            currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
    };

    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function (obj, predicate, context) {
        var result;
        predicate = _.iteratee(predicate, context);
        _.some(obj, function (value, index, list) {
            if (predicate(value, index, list)) {
                result = value;
                return true;
            }
        });
        return result;
    };

    // Return all the elements that pass a truth test.
    // Aliased as `select`.
    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        if (obj == null) return results;
        predicate = _.iteratee(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) results.push(value);
        });
        return results;
    };

    // Return all the elements for which a truth test fails.
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(_.iteratee(predicate)), context);
    };

    // Determine whether all of the elements match a truth test.
    // Aliased as `all`.
    _.every = _.all = function (obj, predicate, context) {
        if (obj == null) return true;
        predicate = _.iteratee(predicate, context);
        var keys = obj.length !== +obj.length && _.keys(obj),
            length = (keys || obj).length,
            index, currentKey;
        for (index = 0; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    // Determine if at least one element in the object matches a truth test.
    // Aliased as `any`.
    _.some = _.any = function (obj, predicate, context) {
        if (obj == null) return false;
        predicate = _.iteratee(predicate, context);
        var keys = obj.length !== +obj.length && _.keys(obj),
            length = (keys || obj).length,
            index, currentKey;
        for (index = 0; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    };

    // Determine if the array or object contains a given value (using `===`).
    // Aliased as `include`.
    _.contains = _.include = function (obj, target) {
        if (obj == null) return false;
        if (obj.length !== +obj.length) obj = _.values(obj);
        return _.indexOf(obj, target) >= 0;
    };

    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function (obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function (value) {
            return (isFunc ? method : value[method]).apply(value, args);
        });
    };

    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function (obj, key) {
        return _.map(obj, _.property(key));
    };

    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function (obj, attrs) {
        return _.filter(obj, _.matches(attrs));
    };

    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matches(attrs));
    };

    // Return the maximum element (or element-based computation).
    _.max = function (obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity,
            value, computed;
        if (iteratee == null && obj != null) {
            obj = obj.length === +obj.length ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value > result) {
                    result = value;
                }
            }
        } else {
            iteratee = _.iteratee(iteratee, context);
            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    // Return the minimum element (or element-based computation).
    _.min = function (obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if (iteratee == null && obj != null) {
            obj = obj.length === +obj.length ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value < result) {
                    result = value;
                }
            }
        } else {
            iteratee = _.iteratee(iteratee, context);
            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    // Shuffle a collection, using the modern version of the
    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    _.shuffle = function (obj) {
        var set = obj && obj.length === +obj.length ? obj : _.values(obj);
        var length = set.length;
        var shuffled = Array(length);
        for (var index = 0, rand; index < length; index++) {
            rand = _.random(0, index);
            if (rand !== index) shuffled[index] = shuffled[rand];
            shuffled[rand] = set[index];
        }
        return shuffled;
    };

    // Sample **n** random values from a collection.
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `map`.
    _.sample = function (obj, n, guard) {
        if (n == null || guard) {
            if (obj.length !== +obj.length) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        return _.shuffle(obj).slice(0, Math.max(0, n));
    };

    // Sort the object's values by a criterion produced by an iteratee.
    _.sortBy = function (obj, iteratee, context) {
        iteratee = _.iteratee(iteratee, context);
        return _.pluck(_.map(obj, function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iteratee(value, index, list)
            };
        }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        }), 'value');
    };

    // An internal function used for aggregate "group by" operations.
    var group = function (behavior) {
        return function (obj, iteratee, context) {
            var result = {};
            iteratee = _.iteratee(iteratee, context);
            _.each(obj, function (value, index) {
                var key = iteratee(value, index, obj);
                behavior(result, value, key);
            });
            return result;
        };
    };

    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function (result, value, key) {
        if (_.has(result, key)) result[key].push(value); else result[key] = [value];
    });

    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function (result, value, key) {
        result[key] = value;
    });

    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function (result, value, key) {
        if (_.has(result, key)) result[key]++; else result[key] = 1;
    });

    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = _.iteratee(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = array.length;
        while (low < high) {
            var mid = low + high >>> 1;
            if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
        }
        return low;
    };

    // Safely create a real, live array from anything iterable.
    _.toArray = function (obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (obj.length === +obj.length) return _.map(obj, _.identity);
        return _.values(obj);
    };

    // Return the number of elements in an object.
    _.size = function (obj) {
        if (obj == null) return 0;
        return obj.length === +obj.length ? obj.length : _.keys(obj).length;
    };

    // Split a collection into two arrays: one whose elements all satisfy the given
    // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = function (obj, predicate, context) {
        predicate = _.iteratee(predicate, context);
        var pass = [], fail = [];
        _.each(obj, function (value, key, obj) {
            (predicate(value, key, obj) ? pass : fail).push(value);
        });
        return [pass, fail];
    };

    // Array Functions
    // ---------------

    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function (array, n, guard) {
        if (array == null) return void 0;
        if (n == null || guard) return array[0];
        if (n < 0) return [];
        return slice.call(array, 0, n);
    };

    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N. The **guard** check allows it to work with
    // `_.map`.
    _.initial = function (array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };

    // Get the last element of an array. Passing **n** will return the last N
    // values in the array. The **guard** check allows it to work with `_.map`.
    _.last = function (array, n, guard) {
        if (array == null) return void 0;
        if (n == null || guard) return array[array.length - 1];
        return slice.call(array, Math.max(array.length - n, 0));
    };

    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array. The **guard**
    // check allows it to work with `_.map`.
    _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };

    // Trim out all falsy values from an array.
    _.compact = function (array) {
        return _.filter(array, _.identity);
    };

    // Internal implementation of a recursive `flatten` function.
    var flatten = function (input, shallow, strict, output) {
        if (shallow && _.every(input, _.isArray)) {
            return concat.apply(output, input);
        }
        for (var i = 0, length = input.length; i < length; i++) {
            var value = input[i];
            if (!_.isArray(value) && !_.isArguments(value)) {
                if (!strict) output.push(value);
            } else if (shallow) {
                push.apply(output, value);
            } else {
                flatten(value, shallow, strict, output);
            }
        }
        return output;
    };

    // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function (array, shallow) {
        return flatten(array, shallow, false, []);
    };

    // Return a version of the array that does not contain the specified value(s).
    _.without = function (array) {
        return _.difference(array, slice.call(arguments, 1));
    };

    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        if (array == null) return [];
        if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        if (iteratee != null) iteratee = _.iteratee(iteratee, context);
        var result = [];
        var seen = [];
        for (var i = 0, length = array.length; i < length; i++) {
            var value = array[i];
            if (isSorted) {
                if (!i || seen !== value) result.push(value);
                seen = value;
            } else if (iteratee) {
                var computed = iteratee(value, i, array);
                if (_.indexOf(seen, computed) < 0) {
                    seen.push(computed);
                    result.push(value);
                }
            } else if (_.indexOf(result, value) < 0) {
                result.push(value);
            }
        }
        return result;
    };

    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function () {
        return _.uniq(flatten(arguments, true, true, []));
    };

    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function (array) {
        if (array == null) return [];
        var result = [];
        var argsLength = arguments.length;
        for (var i = 0, length = array.length; i < length; i++) {
            var item = array[i];
            if (_.contains(result, item)) continue;
            for (var j = 1; j < argsLength; j++) {
                if (!_.contains(arguments[j], item)) break;
            }
            if (j === argsLength) result.push(item);
        }
        return result;
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function (array) {
        var rest = flatten(slice.call(arguments, 1), true, true, []);
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    };

    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function (array) {
        if (array == null) return [];
        var length = _.max(arguments, 'length').length;
        var results = Array(length);
        for (var i = 0; i < length; i++) {
            results[i] = _.pluck(arguments, i);
        }
        return results;
    };

    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function (list, values) {
        if (list == null) return {};
        var result = {};
        for (var i = 0, length = list.length; i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };

    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = function (array, item, isSorted) {
        if (array == null) return -1;
        var i = 0, length = array.length;
        if (isSorted) {
            if (typeof isSorted == 'number') {
                i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
            } else {
                i = _.sortedIndex(array, item);
                return array[i] === item ? i : -1;
            }
        }
        for (; i < length; i++) if (array[i] === item) return i;
        return -1;
    };

    _.lastIndexOf = function (array, item, from) {
        if (array == null) return -1;
        var idx = array.length;
        if (typeof from == 'number') {
            idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
        }
        while (--idx >= 0) if (array[idx] === item) return idx;
        return -1;
    };

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function (start, stop, step) {
        if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
        }
        step = step || 1;

        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }

        return range;
    };

    // Function (ahem) Functions
    // ------------------

    // Reusable constructor function for prototype setting.
    var Ctor = function () { };

    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function (func, context) {
        var args, bound;
        if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
        args = slice.call(arguments, 2);
        bound = function () {
            if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
            Ctor.prototype = func.prototype;
            var self = new Ctor;
            Ctor.prototype = null;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            if (_.isObject(result)) return result;
            return self;
        };
        return bound;
    };

    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. _ acts
    // as a placeholder, allowing any combination of arguments to be pre-filled.
    _.partial = function (func) {
        var boundArgs = slice.call(arguments, 1);
        return function () {
            var position = 0;
            var args = boundArgs.slice();
            for (var i = 0, length = args.length; i < length; i++) {
                if (args[i] === _) args[i] = arguments[position++];
            }
            while (position < arguments.length) args.push(arguments[position++]);
            return func.apply(this, args);
        };
    };

    // Bind a number of an object's methods to that object. Remaining arguments
    // are the method names to be bound. Useful for ensuring that all callbacks
    // defined on an object belong to it.
    _.bindAll = function (obj) {
        var i, length = arguments.length, key;
        if (length <= 1) throw new Error('bindAll must be passed function names');
        for (i = 1; i < length; i++) {
            key = arguments[i];
            obj[key] = _.bind(obj[key], obj);
        }
        return obj;
    };

    // Memoize an expensive function by storing its results.
    _.memoize = function (func, hasher) {
        var memoize = function (key) {
            var cache = memoize.cache;
            var address = hasher ? hasher.apply(this, arguments) : key;
            if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
            return cache[address];
        };
        memoize.cache = {};
        return memoize;
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function (func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    };

    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = function (func) {
        return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    _.throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = _.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function () {
            var last = _.now() - timestamp;

            if (last < wait && last > 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function () {
            context = this;
            args = arguments;
            timestamp = _.now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    };

    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function (func, wrapper) {
        return _.partial(wrapper, func);
    };

    // Returns a negated version of the passed-in predicate.
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function () {
        var args = arguments;
        var start = args.length - 1;
        return function () {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) result = args[i].call(this, result);
            return result;
        };
    };

    // Returns a function that will only be executed after being called N times.
    _.after = function (times, func) {
        return function () {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    // Returns a function that will only be executed before being called N times.
    _.before = function (times, func) {
        var memo;
        return function () {
            if (--times > 0) {
                memo = func.apply(this, arguments);
            } else {
                func = null;
            }
            return memo;
        };
    };

    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = _.partial(_.before, 2);

    // Object Functions
    // ----------------

    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = function (obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        return keys;
    };

    // Retrieve the values of an object's properties.
    _.values = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    };

    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function (obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = function (obj) {
        if (!_.isObject(obj)) return obj;
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    };

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function (obj, iteratee, context) {
        var result = {}, key;
        if (obj == null) return result;
        if (_.isFunction(iteratee)) {
            iteratee = createCallback(iteratee, context);
            for (key in obj) {
                var value = obj[key];
                if (iteratee(value, key, obj)) result[key] = value;
            }
        } else {
            var keys = concat.apply([], slice.call(arguments, 1));
            obj = new Object(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                key = keys[i];
                if (key in obj) result[key] = obj[key];
            }
        }
        return result;
    };

    // Return a copy of the object without the blacklisted properties.
    _.omit = function (obj, iteratee, context) {
        if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
        } else {
            var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
            iteratee = function (value, key) {
                return !_.contains(keys, key);
            };
        }
        return _.pick(obj, iteratee, context);
    };

    // Fill in a given object with default properties.
    _.defaults = function (obj) {
        if (!_.isObject(obj)) return obj;
        for (var i = 1, length = arguments.length; i < length; i++) {
            var source = arguments[i];
            for (var prop in source) {
                if (obj[prop] === void 0) obj[prop] = source[prop];
            }
        }
        return obj;
    };

    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function (obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function (obj, interceptor) {
        interceptor(obj);
        return obj;
    };

    // Internal recursive comparison function for `isEqual`.
    var eq = function (a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // A strict comparison is necessary because `null == undefined`.
        if (a == null || b == null) return a === b;
        // Unwrap any wrapped objects.
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
                // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
        }
        if (typeof a != 'object' || typeof b != 'object') return false;
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
        }
        // Objects with different constructors are not equivalent, but `Object`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (
          aCtor !== bCtor &&
            // Handle Object.create(x) cases
          'constructor' in a && 'constructor' in b &&
          !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
            _.isFunction(bCtor) && bCtor instanceof bCtor)
        ) {
            return false;
        }
        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);
        var size, result;
        // Recursively compare objects and arrays.
        if (className === '[object Array]') {
            // Compare array lengths to determine if a deep comparison is necessary.
            size = a.length;
            result = size === b.length;
            if (result) {
                // Deep compare the contents, ignoring non-numeric properties.
                while (size--) {
                    if (!(result = eq(a[size], b[size], aStack, bStack))) break;
                }
            }
        } else {
            // Deep compare objects.
            var keys = _.keys(a), key;
            size = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            result = _.keys(b).length === size;
            if (result) {
                while (size--) {
                    // Deep compare each member
                    key = keys[size];
                    if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
                }
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return result;
    };

    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function (a, b) {
        return eq(a, b, [], []);
    };

    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function (obj) {
        if (obj == null) return true;
        if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
        for (var key in obj) if (_.has(obj, key)) return false;
        return true;
    };

    // Is a given value a DOM element?
    _.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };

    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function (obj) {
        return toString.call(obj) === '[object Array]';
    };

    // Is a given variable an object?
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    // Define a fallback version of the method in browsers (ahem, IE), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
        _.isArguments = function (obj) {
            return _.has(obj, 'callee');
        };
    }

    // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
    if (typeof /./ !== 'function') {
        _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
        };
    }

    // Is a given object a finite number?
    _.isFinite = function (obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };

    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function (obj) {
        return _.isNumber(obj) && obj !== +obj;
    };

    // Is a given value a boolean?
    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    // Is a given value equal to null?
    _.isNull = function (obj) {
        return obj === null;
    };

    // Is a given variable undefined?
    _.isUndefined = function (obj) {
        return obj === void 0;
    };

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    // Utility Functions
    // -----------------

    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function () {
        root._ = previousUnderscore;
        return this;
    };

    // Keep the identity function around for default iteratees.
    _.identity = function (value) {
        return value;
    };

    // Predicate-generating functions. Often useful outside of Underscore.
    _.constant = function (value) {
        return function () {
            return value;
        };
    };

    _.noop = function () { };

    _.property = function (key) {
        return function (obj) {
            return obj[key];
        };
    };

    // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
    _.matches = function (attrs) {
        var pairs = _.pairs(attrs), length = pairs.length;
        return function (obj) {
            if (obj == null) return !length;
            obj = new Object(obj);
            for (var i = 0; i < length; i++) {
                var pair = pairs[i], key = pair[0];
                if (pair[1] !== obj[key] || !(key in obj)) return false;
            }
            return true;
        };
    };

    // Run a function **n** times.
    _.times = function (n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = createCallback(iteratee, context, 1);
        for (var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum;
    };

    // Return a random integer between min and max (inclusive).
    _.random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    // A (possibly faster) way to get the current timestamp as an integer.
    _.now = Date.now || function () {
        return new Date().getTime();
    };

    // List of HTML entities for escaping.
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function (map) {
        var escaper = function (match) {
            return map[match];
        };
        // Regexes for identifying a key that needs to be escaped
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function (string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    // If the value of the named `property` is a function then invoke it with the
    // `object` as context; otherwise, return it.
    _.result = function (object, property) {
        if (object == null) return void 0;
        var value = object[property];
        return _.isFunction(value) ? object[property]() : value;
    };

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function (match) {
        return '\\' + escapes[match];
    };

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.
    _.template = function (text, settings, oldSettings) {
        if (!settings && oldSettings) settings = oldSettings;
        settings = _.defaults({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([
          (settings.escape || noMatch).source,
          (settings.interpolate || noMatch).source,
          (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }

            // Adobe VMs need the match returned to produce the correct offest.
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
          "print=function(){__p+=__j.call(arguments,'');};\n" +
          source + 'return __p;\n';

        try {
            var render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        var template = function (data) {
            return render.call(this, data, _);
        };

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    };

    // Add a "chain" function. Start chaining a wrapped Underscore object.
    _.chain = function (obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    };

    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var result = function (obj) {
        return this._chain ? _(obj).chain() : obj;
    };

    // Add your own custom functions to the Underscore object.
    _.mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return result.call(this, func.apply(_, args));
            };
        });
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
            return result.call(this, obj);
        };
    });

    // Add all accessor Array functions to the wrapper.
    _.each(['concat', 'join', 'slice'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            return result.call(this, method.apply(this._wrapped, arguments));
        };
    });

    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function () {
        return this._wrapped;
    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function () {
            return _;
        });
    }
}.call(this));
///#source 1 1 /JavaScript-Mvc-framework/libs/FrontEnd/wow.js
(function() {
  var MutationObserver, Util, WeakMap, getComputedStyle, getComputedStyleRX,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Util = (function() {
    function Util() {}

    Util.prototype.extend = function(custom, defaults) {
      var key, value;
      for (key in defaults) {
        value = defaults[key];
        if (custom[key] == null) {
          custom[key] = value;
        }
      }
      return custom;
    };

    Util.prototype.isMobile = function(agent) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
    };

    Util.prototype.createEvent = function(event, bubble, cancel, detail) {
      var customEvent;
      if (bubble == null) {
        bubble = false;
      }
      if (cancel == null) {
        cancel = false;
      }
      if (detail == null) {
        detail = null;
      }
      if (document.createEvent != null) {
        customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(event, bubble, cancel, detail);
      } else if (document.createEventObject != null) {
        customEvent = document.createEventObject();
        customEvent.eventType = event;
      } else {
        customEvent.eventName = event;
      }
      return customEvent;
    };

    Util.prototype.emitEvent = function(elem, event) {
      if (elem.dispatchEvent != null) {
        return elem.dispatchEvent(event);
      } else if (event in (elem != null)) {
        return elem[event]();
      } else if (("on" + event) in (elem != null)) {
        return elem["on" + event]();
      }
    };

    Util.prototype.addEvent = function(elem, event, fn) {
      if (elem.addEventListener != null) {
        return elem.addEventListener(event, fn, false);
      } else if (elem.attachEvent != null) {
        return elem.attachEvent("on" + event, fn);
      } else {
        return elem[event] = fn;
      }
    };

    Util.prototype.removeEvent = function(elem, event, fn) {
      if (elem.removeEventListener != null) {
        return elem.removeEventListener(event, fn, false);
      } else if (elem.detachEvent != null) {
        return elem.detachEvent("on" + event, fn);
      } else {
        return delete elem[event];
      }
    };

    Util.prototype.innerHeight = function() {
      if ('innerHeight' in window) {
        return window.innerHeight;
      } else {
        return document.documentElement.clientHeight;
      }
    };

    return Util;

  })();

  WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = (function() {
    function WeakMap() {
      this.keys = [];
      this.values = [];
    }

    WeakMap.prototype.get = function(key) {
      var i, item, j, len, ref;
      ref = this.keys;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item === key) {
          return this.values[i];
        }
      }
    };

    WeakMap.prototype.set = function(key, value) {
      var i, item, j, len, ref;
      ref = this.keys;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item === key) {
          this.values[i] = value;
          return;
        }
      }
      this.keys.push(key);
      return this.values.push(value);
    };

    return WeakMap;

  })());

  MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (MutationObserver = (function() {
    function MutationObserver() {
      if (typeof console !== "undefined" && console !== null) {
        console.warn('MutationObserver is not supported by your browser.');
      }
      if (typeof console !== "undefined" && console !== null) {
        console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
      }
    }

    MutationObserver.notSupported = true;

    MutationObserver.prototype.observe = function() {};

    return MutationObserver;

  })());

  getComputedStyle = this.getComputedStyle || function(el, pseudo) {
    this.getPropertyValue = function(prop) {
      var ref;
      if (prop === 'float') {
        prop = 'styleFloat';
      }
      if (getComputedStyleRX.test(prop)) {
        prop.replace(getComputedStyleRX, function(_, _char) {
          return _char.toUpperCase();
        });
      }
      return ((ref = el.currentStyle) != null ? ref[prop] : void 0) || null;
    };
    return this;
  };

  getComputedStyleRX = /(\-([a-z]){1})/g;

  this.WOW = (function() {
    WOW.prototype.defaults = {
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true,
      callback: null,
      scrollContainer: null
    };

    function WOW(options) {
      if (options == null) {
        options = {};
      }
      this.scrollCallback = bind(this.scrollCallback, this);
      this.scrollHandler = bind(this.scrollHandler, this);
      this.resetAnimation = bind(this.resetAnimation, this);
      this.start = bind(this.start, this);
      this.scrolled = true;
      this.config = this.util().extend(options, this.defaults);
      if (options.scrollContainer != null) {
        this.config.scrollContainer = document.querySelector(options.scrollContainer);
      }
      this.animationNameCache = new WeakMap();
      this.wowEvent = this.util().createEvent(this.config.boxClass);
    }

    WOW.prototype.init = function() {
      var ref;
      this.element = window.document.documentElement;
      if ((ref = document.readyState) === "interactive" || ref === "complete") {
        this.start();
      } else {
        this.util().addEvent(document, 'DOMContentLoaded', this.start);
      }
      return this.finished = [];
    };

    WOW.prototype.start = function() {
      var box, j, len, ref;
      this.stopped = false;
      this.boxes = (function() {
        var j, len, ref, results;
        ref = this.element.querySelectorAll("." + this.config.boxClass);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          box = ref[j];
          results.push(box);
        }
        return results;
      }).call(this);
      this.all = (function() {
        var j, len, ref, results;
        ref = this.boxes;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          box = ref[j];
          results.push(box);
        }
        return results;
      }).call(this);
      if (this.boxes.length) {
        if (this.disabled()) {
          this.resetStyle();
        } else {
          ref = this.boxes;
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            this.applyStyle(box, true);
          }
        }
      }
      if (!this.disabled()) {
        this.util().addEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
        this.util().addEvent(window, 'resize', this.scrollHandler);
        this.interval = setInterval(this.scrollCallback, 50);
      }
      if (this.config.live) {
        return new MutationObserver((function(_this) {
          return function(records) {
            var k, len1, node, record, results;
            results = [];
            for (k = 0, len1 = records.length; k < len1; k++) {
              record = records[k];
              results.push((function() {
                var l, len2, ref1, results1;
                ref1 = record.addedNodes || [];
                results1 = [];
                for (l = 0, len2 = ref1.length; l < len2; l++) {
                  node = ref1[l];
                  results1.push(this.doSync(node));
                }
                return results1;
              }).call(_this));
            }
            return results;
          };
        })(this)).observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    };

    WOW.prototype.stop = function() {
      this.stopped = true;
      this.util().removeEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
      this.util().removeEvent(window, 'resize', this.scrollHandler);
      if (this.interval != null) {
        return clearInterval(this.interval);
      }
    };

    WOW.prototype.sync = function(element) {
      if (MutationObserver.notSupported) {
        return this.doSync(this.element);
      }
    };

    WOW.prototype.doSync = function(element) {
      var box, j, len, ref, results;
      if (element == null) {
        element = this.element;
      }
      if (element.nodeType !== 1) {
        return;
      }
      element = element.parentNode || element;
      ref = element.querySelectorAll("." + this.config.boxClass);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        if (indexOf.call(this.all, box) < 0) {
          this.boxes.push(box);
          this.all.push(box);
          if (this.stopped || this.disabled()) {
            this.resetStyle();
          } else {
            this.applyStyle(box, true);
          }
          results.push(this.scrolled = true);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    WOW.prototype.show = function(box) {
      this.applyStyle(box);
      box.className = box.className + " " + this.config.animateClass;
      if (this.config.callback != null) {
        this.config.callback(box);
      }
      this.util().emitEvent(box, this.wowEvent);
      this.util().addEvent(box, 'animationend', this.resetAnimation);
      this.util().addEvent(box, 'oanimationend', this.resetAnimation);
      this.util().addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
      this.util().addEvent(box, 'MSAnimationEnd', this.resetAnimation);
      return box;
    };

    WOW.prototype.applyStyle = function(box, hidden) {
      var delay, duration, iteration;
      duration = box.getAttribute('data-wow-duration');
      delay = box.getAttribute('data-wow-delay');
      iteration = box.getAttribute('data-wow-iteration');
      return this.animate((function(_this) {
        return function() {
          return _this.customStyle(box, hidden, duration, delay, iteration);
        };
      })(this));
    };

    WOW.prototype.animate = (function() {
      if ('requestAnimationFrame' in window) {
        return function(callback) {
          return window.requestAnimationFrame(callback);
        };
      } else {
        return function(callback) {
          return callback();
        };
      }
    })();

    WOW.prototype.resetStyle = function() {
      var box, j, len, ref, results;
      ref = this.boxes;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        results.push(box.style.visibility = 'visible');
      }
      return results;
    };

    WOW.prototype.resetAnimation = function(event) {
      var target;
      if (event.type.toLowerCase().indexOf('animationend') >= 0) {
        target = event.target || event.srcElement;
        return target.className = target.className.replace(this.config.animateClass, '').trim();
      }
    };

    WOW.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
      if (hidden) {
        this.cacheAnimationName(box);
      }
      box.style.visibility = hidden ? 'hidden' : 'visible';
      if (duration) {
        this.vendorSet(box.style, {
          animationDuration: duration
        });
      }
      if (delay) {
        this.vendorSet(box.style, {
          animationDelay: delay
        });
      }
      if (iteration) {
        this.vendorSet(box.style, {
          animationIterationCount: iteration
        });
      }
      this.vendorSet(box.style, {
        animationName: hidden ? 'none' : this.cachedAnimationName(box)
      });
      return box;
    };

    WOW.prototype.vendors = ["moz", "webkit"];

    WOW.prototype.vendorSet = function(elem, properties) {
      var name, results, value, vendor;
      results = [];
      for (name in properties) {
        value = properties[name];
        elem["" + name] = value;
        results.push((function() {
          var j, len, ref, results1;
          ref = this.vendors;
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            vendor = ref[j];
            results1.push(elem["" + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    WOW.prototype.vendorCSS = function(elem, property) {
      var j, len, ref, result, style, vendor;
      style = getComputedStyle(elem);
      result = style.getPropertyCSSValue(property);
      ref = this.vendors;
      for (j = 0, len = ref.length; j < len; j++) {
        vendor = ref[j];
        result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
      }
      return result;
    };

    WOW.prototype.animationName = function(box) {
      var animationName;
      try {
        animationName = this.vendorCSS(box, 'animation-name').cssText;
      } catch (_error) {
        animationName = getComputedStyle(box).getPropertyValue('animation-name');
      }
      if (animationName === 'none') {
        return '';
      } else {
        return animationName;
      }
    };

    WOW.prototype.cacheAnimationName = function(box) {
      return this.animationNameCache.set(box, this.animationName(box));
    };

    WOW.prototype.cachedAnimationName = function(box) {
      return this.animationNameCache.get(box);
    };

    WOW.prototype.scrollHandler = function() {
      return this.scrolled = true;
    };

    WOW.prototype.scrollCallback = function() {
      var box;
      if (this.scrolled) {
        this.scrolled = false;
        this.boxes = (function() {
          var j, len, ref, results;
          ref = this.boxes;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            if (!(box)) {
              continue;
            }
            if (this.isVisible(box)) {
              this.show(box);
              continue;
            }
            results.push(box);
          }
          return results;
        }).call(this);
        if (!(this.boxes.length || this.config.live)) {
          return this.stop();
        }
      }
    };

    WOW.prototype.offsetTop = function(element) {
      var top;
      while (element.offsetTop === void 0) {
        element = element.parentNode;
      }
      top = element.offsetTop;
      while (element = element.offsetParent) {
        top += element.offsetTop;
      }
      return top;
    };

    WOW.prototype.isVisible = function(box) {
      var bottom, offset, top, viewBottom, viewTop;
      offset = box.getAttribute('data-wow-offset') || this.config.offset;
      viewTop = (this.config.scrollContainer && this.config.scrollContainer.scrollTop) || window.pageYOffset;
      viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
      top = this.offsetTop(box);
      bottom = top + box.clientHeight;
      return top <= viewBottom && bottom >= viewTop;
    };

    WOW.prototype.util = function() {
      return this._util != null ? this._util : this._util = new Util();
    };

    WOW.prototype.disabled = function() {
      return !this.config.mobile && this.util().isMobile(navigator.userAgent);
    };

    return WOW;

  })();

}).call(this);

///#source 1 1 /JavaScript-Mvc-framework/libs/FrontEnd/jquery.sticky.js
// Sticky Plugin v1.0.0 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 2/14/2011
// Date: 2/12/2012
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes an element on the page stick on the screen as you scroll
//       It will only set the 'top' and 'position' of your element, you
//       might need to adjust the width in some cases.

(function($) {
  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: ''
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

      for (var i = 0; i < sticked.length; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra;

        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement
              .css('position', '')
              .css('top', '');
            s.stickyElement.parent().removeClass(s.className);
            s.currentTop = null;
          }
        }
        else {
          var newTop = documentHeight - s.stickyElement.outerHeight()
            - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (s.currentTop != newTop) {
            s.stickyElement
              .css('position', 'fixed')
              .css('top', newTop);

            if (typeof s.getWidthFrom !== 'undefined') {
              s.stickyElement.css('width', $(s.getWidthFrom).width());
            }

            s.stickyElement.parent().addClass(s.className);
            s.currentTop = newTop;
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height();
    },
    methods = {
      init: function(options) {
        var o = $.extend(defaults, options);
        return this.each(function() {
          var stickyElement = $(this);

          var stickyId = stickyElement.attr('id');
          var wrapper = $('<div></div>')
            .attr('id', stickyId + '-sticky-wrapper')
            .addClass(o.wrapperClassName);
          stickyElement.wrapAll(wrapper);

          if (o.center) {
            stickyElement.parent().css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
          }

          if (stickyElement.css("float") == "right") {
            stickyElement.css({"float":"none"}).parent().css({"float":"right"});
          }

          var stickyWrapper = stickyElement.parent();
          stickyWrapper.css('height', stickyElement.outerHeight());
          sticked.push({
            topSpacing: o.topSpacing,
            bottomSpacing: o.bottomSpacing,
            stickyElement: stickyElement,
            currentTop: null,
            stickyWrapper: stickyWrapper,
            className: o.className,
            getWidthFrom: o.getWidthFrom
          });
        });
      },
      update: scroller
    };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };
  $(function() {
    setTimeout(scroller, 0);
  });
})(jQuery);

///#source 1 1 /JavaScript-Mvc-framework/libs/FrontEnd/jquery.stellar.js
/*
 * Stellar.js v0.6.2
 * http://markdalgleish.com/projects/stellar.js
 *
 * Copyright 2014, Mark Dalgleish
 * This content is released under the MIT license
 * http://markdalgleish.mit-license.org
 */

;(function($, window, document, undefined) {

	var pluginName = 'stellar',
		defaults = {
			scrollProperty: 'scroll',
			positionProperty: 'position',
			horizontalScrolling: true,
			verticalScrolling: true,
			horizontalOffset: 0,
			verticalOffset: 0,
			responsive: false,
			parallaxBackgrounds: true,
			parallaxElements: true,
			hideDistantElements: true,
			hideElement: function($elem) { $elem.hide(); },
			showElement: function($elem) { $elem.show(); }
		},

		scrollProperty = {
			scroll: {
				getLeft: function($elem) { return $elem.scrollLeft(); },
				setLeft: function($elem, val) { $elem.scrollLeft(val); },

				getTop: function($elem) { return $elem.scrollTop();	},
				setTop: function($elem, val) { $elem.scrollTop(val); }
			},
			position: {
				getLeft: function($elem) { return parseInt($elem.css('left'), 10) * -1; },
				getTop: function($elem) { return parseInt($elem.css('top'), 10) * -1; }
			},
			margin: {
				getLeft: function($elem) { return parseInt($elem.css('margin-left'), 10) * -1; },
				getTop: function($elem) { return parseInt($elem.css('margin-top'), 10) * -1; }
			},
			transform: {
				getLeft: function($elem) {
					var computedTransform = getComputedStyle($elem[0])[prefixedTransform];
					return (computedTransform !== 'none' ? parseInt(computedTransform.match(/(-?[0-9]+)/g)[4], 10) * -1 : 0);
				},
				getTop: function($elem) {
					var computedTransform = getComputedStyle($elem[0])[prefixedTransform];
					return (computedTransform !== 'none' ? parseInt(computedTransform.match(/(-?[0-9]+)/g)[5], 10) * -1 : 0);
				}
			}
		},

		positionProperty = {
			position: {
				setLeft: function($elem, left) { $elem.css('left', left); },
				setTop: function($elem, top) { $elem.css('top', top); }
			},
			transform: {
				setPosition: function($elem, left, startingLeft, top, startingTop) {
					$elem[0].style[prefixedTransform] = 'translate3d(' + (left - startingLeft) + 'px, ' + (top - startingTop) + 'px, 0)';
				}
			}
		},

		// Returns a function which adds a vendor prefix to any CSS property name
		vendorPrefix = (function() {
			var prefixes = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
				style = $('script')[0].style,
				prefix = '',
				prop;

			for (prop in style) {
				if (prefixes.test(prop)) {
					prefix = prop.match(prefixes)[0];
					break;
				}
			}

			if ('WebkitOpacity' in style) { prefix = 'Webkit'; }
			if ('KhtmlOpacity' in style) { prefix = 'Khtml'; }

			return function(property) {
				return prefix + (prefix.length > 0 ? property.charAt(0).toUpperCase() + property.slice(1) : property);
			};
		}()),

		prefixedTransform = vendorPrefix('transform'),

		supportsBackgroundPositionXY = $('<div />', { style: 'background:#fff' }).css('background-position-x') !== undefined,

		setBackgroundPosition = (supportsBackgroundPositionXY ?
			function($elem, x, y) {
				$elem.css({
					'background-position-x': x,
					'background-position-y': y
				});
			} :
			function($elem, x, y) {
				$elem.css('background-position', x + ' ' + y);
			}
		),

		getBackgroundPosition = (supportsBackgroundPositionXY ?
			function($elem) {
				return [
					$elem.css('background-position-x'),
					$elem.css('background-position-y')
				];
			} :
			function($elem) {
				return $elem.css('background-position').split(' ');
			}
		),

		requestAnimFrame = (
			window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(callback) {
				setTimeout(callback, 1000 / 60);
			}
		);

	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Plugin.prototype = {
		init: function() {
			this.options.name = pluginName + '_' + Math.floor(Math.random() * 1e9);

			this._defineElements();
			this._defineGetters();
			this._defineSetters();
			this._handleWindowLoadAndResize();
			this._detectViewport();

			this.refresh({ firstLoad: true });

			if (this.options.scrollProperty === 'scroll') {
				this._handleScrollEvent();
			} else {
				this._startAnimationLoop();
			}
		},
		_defineElements: function() {
			if (this.element === document.body) this.element = window;
			this.$scrollElement = $(this.element);
			this.$element = (this.element === window ? $('body') : this.$scrollElement);
			this.$viewportElement = (this.options.viewportElement !== undefined ? $(this.options.viewportElement) : (this.$scrollElement[0] === window || this.options.scrollProperty === 'scroll' ? this.$scrollElement : this.$scrollElement.parent()) );
		},
		_defineGetters: function() {
			var self = this,
				scrollPropertyAdapter = scrollProperty[self.options.scrollProperty];

			this._getScrollLeft = function() {
				return scrollPropertyAdapter.getLeft(self.$scrollElement);
			};

			this._getScrollTop = function() {
				return scrollPropertyAdapter.getTop(self.$scrollElement);
			};
		},
		_defineSetters: function() {
			var self = this,
				scrollPropertyAdapter = scrollProperty[self.options.scrollProperty],
				positionPropertyAdapter = positionProperty[self.options.positionProperty],
				setScrollLeft = scrollPropertyAdapter.setLeft,
				setScrollTop = scrollPropertyAdapter.setTop;

			this._setScrollLeft = (typeof setScrollLeft === 'function' ? function(val) {
				setScrollLeft(self.$scrollElement, val);
			} : $.noop);

			this._setScrollTop = (typeof setScrollTop === 'function' ? function(val) {
				setScrollTop(self.$scrollElement, val);
			} : $.noop);

			this._setPosition = positionPropertyAdapter.setPosition ||
				function($elem, left, startingLeft, top, startingTop) {
					if (self.options.horizontalScrolling) {
						positionPropertyAdapter.setLeft($elem, left, startingLeft);
					}

					if (self.options.verticalScrolling) {
						positionPropertyAdapter.setTop($elem, top, startingTop);
					}
				};
		},
		_handleWindowLoadAndResize: function() {
			var self = this,
				$window = $(window);

			if (self.options.responsive) {
				$window.bind('load.' + this.name, function() {
					self.refresh();
				});
			}

			$window.bind('resize.' + this.name, function() {
				self._detectViewport();

				if (self.options.responsive) {
					self.refresh();
				}
			});
		},
		refresh: function(options) {
			var self = this,
				oldLeft = self._getScrollLeft(),
				oldTop = self._getScrollTop();

			if (!options || !options.firstLoad) {
				this._reset();
			}

			this._setScrollLeft(0);
			this._setScrollTop(0);

			this._setOffsets();
			this._findParticles();
			this._findBackgrounds();

			// Fix for WebKit background rendering bug
			if (options && options.firstLoad && /WebKit/.test(navigator.userAgent)) {
				$(window).load(function() {
					var oldLeft = self._getScrollLeft(),
						oldTop = self._getScrollTop();

					self._setScrollLeft(oldLeft + 1);
					self._setScrollTop(oldTop + 1);

					self._setScrollLeft(oldLeft);
					self._setScrollTop(oldTop);
				});
			}

			this._setScrollLeft(oldLeft);
			this._setScrollTop(oldTop);
		},
		_detectViewport: function() {
			var viewportOffsets = this.$viewportElement.offset(),
				hasOffsets = viewportOffsets !== null && viewportOffsets !== undefined;

			this.viewportWidth = this.$viewportElement.width();
			this.viewportHeight = this.$viewportElement.height();

			this.viewportOffsetTop = (hasOffsets ? viewportOffsets.top : 0);
			this.viewportOffsetLeft = (hasOffsets ? viewportOffsets.left : 0);
		},
		_findParticles: function() {
			var self = this,
				scrollLeft = this._getScrollLeft(),
				scrollTop = this._getScrollTop();

			if (this.particles !== undefined) {
				for (var i = this.particles.length - 1; i >= 0; i--) {
					this.particles[i].$element.data('stellar-elementIsActive', undefined);
				}
			}

			this.particles = [];

			if (!this.options.parallaxElements) return;

			this.$element.find('[data-stellar-ratio]').each(function(i) {
				var $this = $(this),
					horizontalOffset,
					verticalOffset,
					positionLeft,
					positionTop,
					marginLeft,
					marginTop,
					$offsetParent,
					offsetLeft,
					offsetTop,
					parentOffsetLeft = 0,
					parentOffsetTop = 0,
					tempParentOffsetLeft = 0,
					tempParentOffsetTop = 0;

				// Ensure this element isn't already part of another scrolling element
				if (!$this.data('stellar-elementIsActive')) {
					$this.data('stellar-elementIsActive', this);
				} else if ($this.data('stellar-elementIsActive') !== this) {
					return;
				}

				self.options.showElement($this);

				// Save/restore the original top and left CSS values in case we refresh the particles or destroy the instance
				if (!$this.data('stellar-startingLeft')) {
					$this.data('stellar-startingLeft', $this.css('left'));
					$this.data('stellar-startingTop', $this.css('top'));
				} else {
					$this.css('left', $this.data('stellar-startingLeft'));
					$this.css('top', $this.data('stellar-startingTop'));
				}

				positionLeft = $this.position().left;
				positionTop = $this.position().top;

				// Catch-all for margin top/left properties (these evaluate to 'auto' in IE7 and IE8)
				marginLeft = ($this.css('margin-left') === 'auto') ? 0 : parseInt($this.css('margin-left'), 10);
				marginTop = ($this.css('margin-top') === 'auto') ? 0 : parseInt($this.css('margin-top'), 10);

				offsetLeft = $this.offset().left - marginLeft;
				offsetTop = $this.offset().top - marginTop;

				// Calculate the offset parent
				$this.parents().each(function() {
					var $this = $(this);

					if ($this.data('stellar-offset-parent') === true) {
						parentOffsetLeft = tempParentOffsetLeft;
						parentOffsetTop = tempParentOffsetTop;
						$offsetParent = $this;

						return false;
					} else {
						tempParentOffsetLeft += $this.position().left;
						tempParentOffsetTop += $this.position().top;
					}
				});

				// Detect the offsets
				horizontalOffset = ($this.data('stellar-horizontal-offset') !== undefined ? $this.data('stellar-horizontal-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-horizontal-offset') !== undefined ? $offsetParent.data('stellar-horizontal-offset') : self.horizontalOffset));
				verticalOffset = ($this.data('stellar-vertical-offset') !== undefined ? $this.data('stellar-vertical-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-vertical-offset') !== undefined ? $offsetParent.data('stellar-vertical-offset') : self.verticalOffset));

				// Add our object to the particles collection
				self.particles.push({
					$element: $this,
					$offsetParent: $offsetParent,
					isFixed: $this.css('position') === 'fixed',
					horizontalOffset: horizontalOffset,
					verticalOffset: verticalOffset,
					startingPositionLeft: positionLeft,
					startingPositionTop: positionTop,
					startingOffsetLeft: offsetLeft,
					startingOffsetTop: offsetTop,
					parentOffsetLeft: parentOffsetLeft,
					parentOffsetTop: parentOffsetTop,
					stellarRatio: ($this.data('stellar-ratio') !== undefined ? $this.data('stellar-ratio') : 1),
					width: $this.outerWidth(true),
					height: $this.outerHeight(true),
					isHidden: false
				});
			});
		},
		_findBackgrounds: function() {
			var self = this,
				scrollLeft = this._getScrollLeft(),
				scrollTop = this._getScrollTop(),
				$backgroundElements;

			this.backgrounds = [];

			if (!this.options.parallaxBackgrounds) return;

			$backgroundElements = this.$element.find('[data-stellar-background-ratio]');

			if (this.$element.data('stellar-background-ratio')) {
                $backgroundElements = $backgroundElements.add(this.$element);
			}

			$backgroundElements.each(function() {
				var $this = $(this),
					backgroundPosition = getBackgroundPosition($this),
					horizontalOffset,
					verticalOffset,
					positionLeft,
					positionTop,
					marginLeft,
					marginTop,
					offsetLeft,
					offsetTop,
					$offsetParent,
					parentOffsetLeft = 0,
					parentOffsetTop = 0,
					tempParentOffsetLeft = 0,
					tempParentOffsetTop = 0;

				// Ensure this element isn't already part of another scrolling element
				if (!$this.data('stellar-backgroundIsActive')) {
					$this.data('stellar-backgroundIsActive', this);
				} else if ($this.data('stellar-backgroundIsActive') !== this) {
					return;
				}

				// Save/restore the original top and left CSS values in case we destroy the instance
				if (!$this.data('stellar-backgroundStartingLeft')) {
					$this.data('stellar-backgroundStartingLeft', backgroundPosition[0]);
					$this.data('stellar-backgroundStartingTop', backgroundPosition[1]);
				} else {
					setBackgroundPosition($this, $this.data('stellar-backgroundStartingLeft'), $this.data('stellar-backgroundStartingTop'));
				}

				// Catch-all for margin top/left properties (these evaluate to 'auto' in IE7 and IE8)
				marginLeft = ($this.css('margin-left') === 'auto') ? 0 : parseInt($this.css('margin-left'), 10);
				marginTop = ($this.css('margin-top') === 'auto') ? 0 : parseInt($this.css('margin-top'), 10);

				offsetLeft = $this.offset().left - marginLeft - scrollLeft;
				offsetTop = $this.offset().top - marginTop - scrollTop;
				
				// Calculate the offset parent
				$this.parents().each(function() {
					var $this = $(this);

					if ($this.data('stellar-offset-parent') === true) {
						parentOffsetLeft = tempParentOffsetLeft;
						parentOffsetTop = tempParentOffsetTop;
						$offsetParent = $this;

						return false;
					} else {
						tempParentOffsetLeft += $this.position().left;
						tempParentOffsetTop += $this.position().top;
					}
				});

				// Detect the offsets
				horizontalOffset = ($this.data('stellar-horizontal-offset') !== undefined ? $this.data('stellar-horizontal-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-horizontal-offset') !== undefined ? $offsetParent.data('stellar-horizontal-offset') : self.horizontalOffset));
				verticalOffset = ($this.data('stellar-vertical-offset') !== undefined ? $this.data('stellar-vertical-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-vertical-offset') !== undefined ? $offsetParent.data('stellar-vertical-offset') : self.verticalOffset));

				self.backgrounds.push({
					$element: $this,
					$offsetParent: $offsetParent,
					isFixed: $this.css('background-attachment') === 'fixed',
					horizontalOffset: horizontalOffset,
					verticalOffset: verticalOffset,
					startingValueLeft: backgroundPosition[0],
					startingValueTop: backgroundPosition[1],
					startingBackgroundPositionLeft: (isNaN(parseInt(backgroundPosition[0], 10)) ? 0 : parseInt(backgroundPosition[0], 10)),
					startingBackgroundPositionTop: (isNaN(parseInt(backgroundPosition[1], 10)) ? 0 : parseInt(backgroundPosition[1], 10)),
					startingPositionLeft: $this.position().left,
					startingPositionTop: $this.position().top,
					startingOffsetLeft: offsetLeft,
					startingOffsetTop: offsetTop,
					parentOffsetLeft: parentOffsetLeft,
					parentOffsetTop: parentOffsetTop,
					stellarRatio: ($this.data('stellar-background-ratio') === undefined ? 1 : $this.data('stellar-background-ratio'))
				});
			});
		},
		_reset: function() {
			var particle,
				startingPositionLeft,
				startingPositionTop,
				background,
				i;

			for (i = this.particles.length - 1; i >= 0; i--) {
				particle = this.particles[i];
				startingPositionLeft = particle.$element.data('stellar-startingLeft');
				startingPositionTop = particle.$element.data('stellar-startingTop');

				this._setPosition(particle.$element, startingPositionLeft, startingPositionLeft, startingPositionTop, startingPositionTop);

				this.options.showElement(particle.$element);

				particle.$element.data('stellar-startingLeft', null).data('stellar-elementIsActive', null).data('stellar-backgroundIsActive', null);
			}

			for (i = this.backgrounds.length - 1; i >= 0; i--) {
				background = this.backgrounds[i];

				background.$element.data('stellar-backgroundStartingLeft', null).data('stellar-backgroundStartingTop', null);

				setBackgroundPosition(background.$element, background.startingValueLeft, background.startingValueTop);
			}
		},
		destroy: function() {
			this._reset();

			this.$scrollElement.unbind('resize.' + this.name).unbind('scroll.' + this.name);
			this._animationLoop = $.noop;

			$(window).unbind('load.' + this.name).unbind('resize.' + this.name);
		},
		_setOffsets: function() {
			var self = this,
				$window = $(window);

			$window.unbind('resize.horizontal-' + this.name).unbind('resize.vertical-' + this.name);

			if (typeof this.options.horizontalOffset === 'function') {
				this.horizontalOffset = this.options.horizontalOffset();
				$window.bind('resize.horizontal-' + this.name, function() {
					self.horizontalOffset = self.options.horizontalOffset();
				});
			} else {
				this.horizontalOffset = this.options.horizontalOffset;
			}

			if (typeof this.options.verticalOffset === 'function') {
				this.verticalOffset = this.options.verticalOffset();
				$window.bind('resize.vertical-' + this.name, function() {
					self.verticalOffset = self.options.verticalOffset();
				});
			} else {
				this.verticalOffset = this.options.verticalOffset;
			}
		},
		_repositionElements: function() {
			var scrollLeft = this._getScrollLeft(),
				scrollTop = this._getScrollTop(),
				horizontalOffset,
				verticalOffset,
				particle,
				fixedRatioOffset,
				background,
				bgLeft,
				bgTop,
				isVisibleVertical = true,
				isVisibleHorizontal = true,
				newPositionLeft,
				newPositionTop,
				newOffsetLeft,
				newOffsetTop,
				i;

			// First check that the scroll position or container size has changed
			if (this.currentScrollLeft === scrollLeft && this.currentScrollTop === scrollTop && this.currentWidth === this.viewportWidth && this.currentHeight === this.viewportHeight) {
				return;
			} else {
				this.currentScrollLeft = scrollLeft;
				this.currentScrollTop = scrollTop;
				this.currentWidth = this.viewportWidth;
				this.currentHeight = this.viewportHeight;
			}

			// Reposition elements
			for (i = this.particles.length - 1; i >= 0; i--) {
				particle = this.particles[i];

				fixedRatioOffset = (particle.isFixed ? 1 : 0);

				// Calculate position, then calculate what the particle's new offset will be (for visibility check)
				if (this.options.horizontalScrolling) {
					newPositionLeft = (scrollLeft + particle.horizontalOffset + this.viewportOffsetLeft + particle.startingPositionLeft - particle.startingOffsetLeft + particle.parentOffsetLeft) * -(particle.stellarRatio + fixedRatioOffset - 1) + particle.startingPositionLeft;
					newOffsetLeft = newPositionLeft - particle.startingPositionLeft + particle.startingOffsetLeft;
				} else {
					newPositionLeft = particle.startingPositionLeft;
					newOffsetLeft = particle.startingOffsetLeft;
				}

				if (this.options.verticalScrolling) {
					newPositionTop = (scrollTop + particle.verticalOffset + this.viewportOffsetTop + particle.startingPositionTop - particle.startingOffsetTop + particle.parentOffsetTop) * -(particle.stellarRatio + fixedRatioOffset - 1) + particle.startingPositionTop;
					newOffsetTop = newPositionTop - particle.startingPositionTop + particle.startingOffsetTop;
				} else {
					newPositionTop = particle.startingPositionTop;
					newOffsetTop = particle.startingOffsetTop;
				}

				// Check visibility
				if (this.options.hideDistantElements) {
					isVisibleHorizontal = !this.options.horizontalScrolling || newOffsetLeft + particle.width > (particle.isFixed ? 0 : scrollLeft) && newOffsetLeft < (particle.isFixed ? 0 : scrollLeft) + this.viewportWidth + this.viewportOffsetLeft;
					isVisibleVertical = !this.options.verticalScrolling || newOffsetTop + particle.height > (particle.isFixed ? 0 : scrollTop) && newOffsetTop < (particle.isFixed ? 0 : scrollTop) + this.viewportHeight + this.viewportOffsetTop;
				}

				if (isVisibleHorizontal && isVisibleVertical) {
					if (particle.isHidden) {
						this.options.showElement(particle.$element);
						particle.isHidden = false;
					}

					this._setPosition(particle.$element, newPositionLeft, particle.startingPositionLeft, newPositionTop, particle.startingPositionTop);
				} else {
					if (!particle.isHidden) {
						this.options.hideElement(particle.$element);
						particle.isHidden = true;
					}
				}
			}

			// Reposition backgrounds
			for (i = this.backgrounds.length - 1; i >= 0; i--) {
				background = this.backgrounds[i];

				fixedRatioOffset = (background.isFixed ? 0 : 1);
				bgLeft = (this.options.horizontalScrolling ? (scrollLeft + background.horizontalOffset - this.viewportOffsetLeft - background.startingOffsetLeft + background.parentOffsetLeft - background.startingBackgroundPositionLeft) * (fixedRatioOffset - background.stellarRatio) + 'px' : background.startingValueLeft);
				bgTop = (this.options.verticalScrolling ? (scrollTop + background.verticalOffset - this.viewportOffsetTop - background.startingOffsetTop + background.parentOffsetTop - background.startingBackgroundPositionTop) * (fixedRatioOffset - background.stellarRatio) + 'px' : background.startingValueTop);

				setBackgroundPosition(background.$element, bgLeft, bgTop);
			}
		},
		_handleScrollEvent: function() {
			var self = this,
				ticking = false;

			var update = function() {
				self._repositionElements();
				ticking = false;
			};

			var requestTick = function() {
				if (!ticking) {
					requestAnimFrame(update);
					ticking = true;
				}
			};
			
			this.$scrollElement.bind('scroll.' + this.name, requestTick);
			requestTick();
		},
		_startAnimationLoop: function() {
			var self = this;

			this._animationLoop = function() {
				requestAnimFrame(self._animationLoop);
				self._repositionElements();
			};
			this._animationLoop();
		}
	};

	$.fn[pluginName] = function (options) {
		var args = arguments;
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			return this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);
				if (instance instanceof Plugin && typeof instance[options] === 'function') {
					instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}
				if (options === 'destroy') {
					$.data(this, 'plugin_' + pluginName, null);
				}
			});
		}
	};

	$[pluginName] = function(options) {
		var $window = $(window);
		return $window.stellar.apply($window, Array.prototype.slice.call(arguments, 0));
	};

	// Expose the scroll and position property function hashes so they can be extended
	$[pluginName].scrollProperty = scrollProperty;
	$[pluginName].positionProperty = positionProperty;

	// Expose the plugin class so it can be modified
	window.Stellar = Plugin;
}(jQuery, this, document));
///#source 1 1 /JavaScript-Mvc-framework/libs/FrontEnd/base-theme.js
/* Superslides - v0.6.2 - 2013-07-10
* https://github.com/nicinabox/superslides
* Copyright (c) 2013 Nic Aitch; Licensed MIT */
//(function (i, t) { var n, e = "superslides"; n = function (n, e) { this.options = t.extend({ play: !1, animation_speed: 600, animation_easing: "swing", animation: "slide", inherit_width_from: i, inherit_height_from: i, pagination: !0, hashchange: !1, scrollable: !0, elements: { preserve: ".preserve", nav: ".slides-navigation", container: ".slides-container", pagination: ".slides-pagination" } }, e); var s = this, o = t("<div>", { "class": "slides-control" }), a = 1; this.$el = t(n), this.$container = this.$el.find(this.options.elements.container); var r = function () { return a = s._findMultiplier(), s.$el.on("click", s.options.elements.nav + " a", function (i) { i.preventDefault(), s.stop(), t(this).hasClass("next") ? s.animate("next", function () { s.start() }) : s.animate("prev", function () { s.start() }) }), t(document).on("keyup", function (i) { 37 === i.keyCode && s.animate("prev"), 39 === i.keyCode && s.animate("next") }), t(i).on("resize", function () { setTimeout(function () { var i = s.$container.children(); s.width = s._findWidth(), s.height = s._findHeight(), i.css({ width: s.width, left: s.width }), s.css.containers(), s.css.images() }, 10) }), t(i).on("hashchange", function () { var i, t = s._parseHash(); i = t && !isNaN(t) ? s._upcomingSlide(t - 1) : s._upcomingSlide(t), i >= 0 && i !== s.current && s.animate(i) }), s.pagination._events(), s.start(), s }, h = { containers: function () { s.init ? (s.$el.css({ height: s.height }), s.$control.css({ width: s.width * a, left: -s.width }), s.$container.css({})) : (t("body").css({ margin: 0 }), s.$el.css({ position: "relative", overflow: "hidden", width: "100%", height: s.height }), s.$control.css({ position: "relative", transform: "translate3d(0)", height: "100%", width: s.width * a, left: -s.width }), s.$container.css({ display: "none", margin: "0", padding: "0", listStyle: "none", position: "relative", height: "100%" })), 1 === s.size() && s.$el.find(s.options.elements.nav).hide() }, images: function () { var i = s.$container.find("img").not(s.options.elements.preserve); i.removeAttr("width").removeAttr("height").css({ "-webkit-backface-visibility": "hidden", "-ms-interpolation-mode": "bicubic", position: "absolute", left: "0", top: "0", "z-index": "-1", "max-width": "none" }), i.each(function () { var i = s.image._aspectRatio(this), n = this; if (t.data(this, "processed")) s.image._scale(n, i), s.image._center(n, i); else { var e = new Image; e.onload = function () { s.image._scale(n, i), s.image._center(n, i), t.data(n, "processed", !0) }, e.src = this.src } }) }, children: function () { var i = s.$container.children(); i.is("img") && (i.each(function () { if (t(this).is("img")) { t(this).wrap("<div>"); var i = t(this).attr("id"); t(this).removeAttr("id"), t(this).parent().attr("id", i) } }), i = s.$container.children()), s.init || i.css({ display: "none", left: 2 * s.width }), i.css({ position: "absolute", overflow: "hidden", height: "100%", width: s.width, top: 0, zIndex: 0 }) } }, c = { slide: function (i, t) { var n = s.$container.children(), e = n.eq(i.upcoming_slide); e.css({ left: i.upcoming_position, display: "block" }), s.$control.animate({ left: i.offset }, s.options.animation_speed, s.options.animation_easing, function () { s.size() > 1 && (s.$control.css({ left: -s.width }), n.eq(i.upcoming_slide).css({ left: s.width, zIndex: 2 }), i.outgoing_slide >= 0 && n.eq(i.outgoing_slide).css({ left: s.width, display: "none", zIndex: 0 })), t() }) }, fade: function (i, t) { var n = this, e = n.$container.children(), s = e.eq(i.outgoing_slide), o = e.eq(i.upcoming_slide); o.css({ left: this.width, opacity: 1, display: "block" }), i.outgoing_slide >= 0 ? s.animate({ opacity: 0 }, n.options.animation_speed, n.options.animation_easing, function () { n.size() > 1 && (e.eq(i.upcoming_slide).css({ zIndex: 2 }), i.outgoing_slide >= 0 && e.eq(i.outgoing_slide).css({ opacity: 1, display: "none", zIndex: 0 })), t() }) : (o.css({ zIndex: 2 }), t()) } }; c = t.extend(c, t.fn.superslides.fx); var d = { _centerY: function (i) { var n = t(i); n.css({ top: (s.height - n.height()) / 2 }) }, _centerX: function (i) { var n = t(i); n.css({ left: (s.width - n.width()) / 2 }) }, _center: function (i) { s.image._centerX(i), s.image._centerY(i) }, _aspectRatio: function (i) { if (!i.naturalHeight && !i.naturalWidth) { var t = new Image; t.src = i.src, i.naturalHeight = t.height, i.naturalWidth = t.width } return i.naturalHeight / i.naturalWidth }, _scale: function (i, n) { n = n || s.image._aspectRatio(i); var e = s.height / s.width, o = t(i); e > n ? o.css({ height: s.height, width: s.height / n }) : o.css({ height: s.width * n, width: s.width }) } }, l = { _setCurrent: function (i) { if (s.$pagination) { var t = s.$pagination.children(); t.removeClass("current"), t.eq(i).addClass("current") } }, _addItem: function (i) { var n = i + 1, e = n, o = s.$container.children().eq(i), a = o.attr("id"); a && (e = a); var r = t("<a>", { href: "#" + e, text: e }); r.appendTo(s.$pagination) }, _setup: function () { if (s.options.pagination && 1 !== s.size()) { var i = t("<nav>", { "class": s.options.elements.pagination.replace(/^\./, "") }); s.$pagination = i.appendTo(s.$el); for (var n = 0; s.size() > n; n++) s.pagination._addItem(n) } }, _events: function () { s.$el.on("click", s.options.elements.pagination + " a", function (i) { i.preventDefault(); var t = s._parseHash(this.hash), n = s._upcomingSlide(t - 1); n !== s.current && s.animate(n, function () { s.start() }) }) } }; return this.css = h, this.image = d, this.pagination = l, this.fx = c, this.animation = this.fx[this.options.animation], this.$control = this.$container.wrap(o).parent(".slides-control"), s._findPositions(), s.width = s._findWidth(), s.height = s._findHeight(), this.css.children(), this.css.containers(), this.css.images(), this.pagination._setup(), r() }, n.prototype = { _findWidth: function () { return t(this.options.inherit_width_from).width() }, _findHeight: function () { return t(this.options.inherit_height_from).height() }, _findMultiplier: function () { return 1 === this.size() ? 1 : 3 }, _upcomingSlide: function (i) { if (/next/.test(i)) return this._nextInDom(); if (/prev/.test(i)) return this._prevInDom(); if (/\d/.test(i)) return +i; if (i && /\w/.test(i)) { var t = this._findSlideById(i); return t >= 0 ? t : 0 } return 0 }, _findSlideById: function (i) { return this.$container.find("#" + i).index() }, _findPositions: function (i, t) { t = t || this, void 0 === i && (i = -1), t.current = i, t.next = t._nextInDom(), t.prev = t._prevInDom() }, _nextInDom: function () { var i = this.current + 1; return i === this.size() && (i = 0), i }, _prevInDom: function () { var i = this.current - 1; return 0 > i && (i = this.size() - 1), i }, _parseHash: function (t) { return t = t || i.location.hash, t = t.replace(/^#/, ""), t && !isNaN(+t) && (t = +t), t }, size: function () { return this.$container.children().length }, destroy: function () { return this.$el.removeData() }, update: function () { this.css.children(), this.css.containers(), this.css.images(), this.pagination._addItem(this.size()), this._findPositions(this.current), this.$el.trigger("updated.slides") }, stop: function () { clearInterval(this.play_id), delete this.play_id, this.$el.trigger("stopped.slides") }, start: function () { var n = this; n.options.hashchange ? t(i).trigger("hashchange") : this.animate(), this.options.play && (this.play_id && this.stop(), this.play_id = setInterval(function () { n.animate() }, this.options.play)), this.$el.trigger("started.slides") }, animate: function (t, n) { var e = this, s = {}; if (!(this.animating || (this.animating = !0, void 0 === t && (t = "next"), s.upcoming_slide = this._upcomingSlide(t), s.upcoming_slide >= this.size()))) { if (s.outgoing_slide = this.current, s.upcoming_position = 2 * this.width, s.offset = -s.upcoming_position, ("prev" === t || s.outgoing_slide > t) && (s.upcoming_position = 0, s.offset = 0), e.size() > 1 && e.pagination._setCurrent(s.upcoming_slide), e.options.hashchange) { var o = s.upcoming_slide + 1, a = e.$container.children(":eq(" + s.upcoming_slide + ")").attr("id"); i.location.hash = a ? a : o } e.$el.trigger("animating.slides", [s]), e.animation(s, function () { e._findPositions(s.upcoming_slide, e), "function" == typeof n && n(), e.animating = !1, e.$el.trigger("animated.slides"), e.init || (e.$el.trigger("init.slides"), e.init = !0, e.$container.fadeIn("fast")) }) } } }, t.fn[e] = function (i, s) { var o = []; return this.each(function () { var a, r, h; return a = t(this), r = a.data(e), h = "object" == typeof i && i, r || (o = a.data(e, r = new n(this, h))), "string" == typeof i && (o = r[i], "function" == typeof o) ? o = o.call(r, s) : void 0 }), o }, t.fn[e].fx = {} })(this, jQuery);



(function ($) {
    jQuery.fn.jetmenu = function (options) {
        var settings = {
            indicator: true     			// indicator that indicates a submenu
        , speed: 100     			// submenu speed
        , delay: 0					// submenu show delay
        , hideClickOut: true     			// hide submenus when click outside menu
        , align: "left"				// menu alignment (left/right)
        , submenuTrigger: "hover"			// defines if submenu appears after hover/click
        }
        $.extend(settings, options);
        var menu = $(".jetmenu");
        var lastScreenWidth = windowWidth();
        var bigScreen = false;
        $(menu).prepend("<li class='showhide'><span class='title'></span><i class='fa fa-bars'></i></li>");
        if (settings.indicator == true) {
            $(menu).find("a").each(function () {
                if ($(this).siblings(".dropdown, .megamenu").length > 0) {
                    $(this).append("<span class='indicator'><i class='fa fa-angle-right'></i></span>");
                }
            });
        }

        function bindHover() {
            if (navigator.userAgent.match(/Mobi/i) || window.navigator.msMaxTouchPoints > 0 || settings.submenuTrigger == "click") {
                $(menu).find("a").on("click touchstart", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).parent("li").siblings("li").find(".dropdown, .megamenu").stop(true, true).fadeOut(settings.speed);
                    if ($(this).siblings(".dropdown, .megamenu").css("display") == "none") {
                        $(this).siblings(".dropdown, .megamenu").stop(true, true).delay(settings.delay).fadeIn(settings.speed);
                        return false;
                    }
                    else {
                        $(this).siblings(".dropdown, .megamenu").stop(true, true).fadeOut(settings.speed);
                        $(this).siblings(".dropdown").find(".dropdown").stop(true, true).fadeOut(settings.speed);
                    }
                    window.location.href = $(this).attr("href");
                });

                $(menu).find("li").bind("mouseleave", function () {
                    $(this).children(".dropdown, .megamenu").stop(true, true).fadeOut(settings.speed);
                });

                if (settings.hideClickOut == true) {
                    $(document).bind("click.menu touchstart.menu", function (ev) {
                        if ($(ev.target).closest(menu).length == 0) {
                            $(menu).find(".dropdown, .megamenu").fadeOut(settings.speed);
                        }
                    });
                }
            }
            else {
                $(menu).find("li").bind("mouseenter", function () {
                    $(this).children(".dropdown, .megamenu").stop(true, true).delay(settings.delay).fadeIn(settings.speed);
                }).bind("mouseleave", function () {
                    $(this).children(".dropdown, .megamenu").stop(true, true).fadeOut(settings.speed);
                });
            }
        }

        function bindClick() {
            $(menu).find("li:not(.showhide)").each(function () {
                if ($(this).children(".dropdown, .megamenu").length > 0) {
                    $(this).children("a").bind("click", function (e) {
                        if ($(this).siblings(".dropdown, .megamenu").css("display") == "none") {
                            $(this).siblings(".dropdown, .megamenu").delay(settings.delay).slideDown(settings.speed).focus();
                            $(this).parent("li").siblings("li").find(".dropdown, .megamenu").slideUp(settings.speed);
                            return false;
                        }
                        else {
                            $(this).siblings(".dropdown, .megamenu").slideUp(settings.speed).focus();
                            firstItemClick = 1;
                        }
                    });
                }
            });
        }

        function showCollapse() {
            $(menu).children("li:not(.showhide)").hide(0);
            $(menu).children("li.showhide").show(0);
            $(menu).children("li.showhide").bind("click", function () {
                if ($(menu).children("li").is(":hidden")) {
                    $(menu).children("li").slideDown(settings.speed);
                }
                else {
                    $(menu).children("li:not(.showhide)").slideUp(settings.speed);
                    $(menu).children("li.showhide").show(0);
                    $(menu).find(".dropdown, .megamenu").hide(settings.speed);
                }
            });
        }

        function hideCollapse() {
            $(menu).children("li").show(0);
            $(menu).children("li.showhide").hide(0);
        }

        function rightAlignMenu() {
            $(menu).children("li").addClass("jsright");
            var items = $(menu).children("li");
            $(menu).children("li:not(.showhide)").detach();
            for (var i = items.length; i >= 1; i--) {
                $(menu).append(items[i]);
            }
            fixSubmenuRight();
        }

        function fixSubmenuRight() {
            $(menu).children("li").removeClass("last");
            var items = $(menu).children("li");
            for (var i = 1; i <= items.length; i++) {
                if ($(items[i]).children(".dropdown, .megamenu").length > 0) {
                    var lastItemsWidth = 0;
                    for (var y = 1; y <= i; y++) {
                        lastItemsWidth = lastItemsWidth + $(items[y]).outerWidth();
                    }
                    if ($(items[i]).children(".dropdown, .megamenu").outerWidth() > lastItemsWidth) {
                        $(items[i]).addClass("last");
                    }
                }
            }
        }

        function fixSubmenuLeft() {
            $(menu).children("li").removeClass("fix-sub");
            var items = $(menu).children("li");
            var menuWidth = $(menu).outerWidth();
            var itemsWidth = 0;
            for (var i = 1; i <= items.length; i++) {
                if ($(items[i]).children(".dropdown, .megamenu").length > 0) {
                    if ($(items[i]).position().left + $(items[i]).children(".dropdown, .megamenu").outerWidth() > menuWidth) {
                        $(items[i]).addClass("fix-sub");
                    }
                }
            }
        }

        function unbindEvents() {
            $(menu).find("li, a").unbind();
            $(document).unbind("click.menu touchstart.menu");
            $(menu).find(".dropdown, .megamenu").hide(0);
        }

        function windowWidth() {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        }


        $(window).resize(function () {
            if (lastScreenWidth <= 768 && windowWidth() > 768) {
                unbindEvents();
                hideCollapse();
                bindHover();
                if (settings.align == "right" && bigScreen == false) {
                    rightAlignMenu();
                    bigScreen = true;
                }
            }
            if (lastScreenWidth > 768 && windowWidth() <= 768) {
                unbindEvents();
                showCollapse();
                bindClick();
                if (bigScreen == true) {
                    rightAlignMenu();
                    bigScreen = false;
                }
            }
            if (settings.align == "right") {
                if (lastScreenWidth > 768 && windowWidth() > 768)
                    fixSubmenuRight();
            }
            else {
                if (lastScreenWidth > 768 && windowWidth() > 768)
                    fixSubmenuLeft();
            }
            lastScreenWidth = windowWidth();
        });

        function screenSize() {
            if (windowWidth() <= 768) {
                showCollapse();
                bindClick();
                if (bigScreen == true) {
                    rightAlignMenu();
                    bigScreen = false;
                }
            }
            else {
                hideCollapse();
                bindHover();
                if (settings.align == "right") {
                    rightAlignMenu();
                    bigScreen = true;
                }
                else {
                    fixSubmenuLeft();
                }
            }
        }
        screenSize();

    }

}(jQuery));
///#source 1 1 /JavaScript-Mvc-framework/libs/FrontEnd/jquery.isotope.min.js
/**
 * Isotope v1.5.21
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2012 David DeSandro / Metafizzy
 */
(function(a,b,c){"use strict";var d=a.document,e=a.Modernizr,f=function(a){return a.charAt(0).toUpperCase()+a.slice(1)},g="Moz Webkit O Ms".split(" "),h=function(a){var b=d.documentElement.style,c;if(typeof b[a]=="string")return a;a=f(a);for(var e=0,h=g.length;e<h;e++){c=g[e]+a;if(typeof b[c]=="string")return c}},i=h("transform"),j=h("transitionProperty"),k={csstransforms:function(){return!!i},csstransforms3d:function(){var a=!!h("perspective");if(a){var c=" -o- -moz- -ms- -webkit- -khtml- ".split(" "),d="@media ("+c.join("transform-3d),(")+"modernizr)",e=b("<style>"+d+"{#modernizr{height:3px}}"+"</style>").appendTo("head"),f=b('<div id="modernizr" />').appendTo("html");a=f.height()===3,f.remove(),e.remove()}return a},csstransitions:function(){return!!j}},l;if(e)for(l in k)e.hasOwnProperty(l)||e.addTest(l,k[l]);else{e=a.Modernizr={_version:"1.6ish: miniModernizr for Isotope"};var m=" ",n;for(l in k)n=k[l](),e[l]=n,m+=" "+(n?"":"no-")+l;b("html").addClass(m)}if(e.csstransforms){var o=e.csstransforms3d?{translate:function(a){return"translate3d("+a[0]+"px, "+a[1]+"px, 0) "},scale:function(a){return"scale3d("+a+", "+a+", 1) "}}:{translate:function(a){return"translate("+a[0]+"px, "+a[1]+"px) "},scale:function(a){return"scale("+a+") "}},p=function(a,c,d){var e=b.data(a,"isoTransform")||{},f={},g,h={},j;f[c]=d,b.extend(e,f);for(g in e)j=e[g],h[g]=o[g](j);var k=h.translate||"",l=h.scale||"",m=k+l;b.data(a,"isoTransform",e),a.style[i]=m};b.cssNumber.scale=!0,b.cssHooks.scale={set:function(a,b){p(a,"scale",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.scale?d.scale:1}},b.fx.step.scale=function(a){b.cssHooks.scale.set(a.elem,a.now+a.unit)},b.cssNumber.translate=!0,b.cssHooks.translate={set:function(a,b){p(a,"translate",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.translate?d.translate:[0,0]}}}var q,r;e.csstransitions&&(q={WebkitTransitionProperty:"webkitTransitionEnd",MozTransitionProperty:"transitionend",OTransitionProperty:"oTransitionEnd otransitionend",transitionProperty:"transitionend"}[j],r=h("transitionDuration"));var s=b.event,t;s.special.smartresize={setup:function(){b(this).bind("resize",s.special.smartresize.handler)},teardown:function(){b(this).unbind("resize",s.special.smartresize.handler)},handler:function(a,b){var c=this,d=arguments;a.type="smartresize",t&&clearTimeout(t),t=setTimeout(function(){jQuery.event.handle.apply(c,d)},b==="execAsap"?0:100)}},b.fn.smartresize=function(a){return a?this.bind("smartresize",a):this.trigger("smartresize",["execAsap"])},b.Isotope=function(a,c,d){this.element=b(c),this._create(a),this._init(d)};var u=["width","height"],v=b(a);b.Isotope.settings={resizable:!0,layoutMode:"masonry",containerClass:"isotope",itemClass:"isotope-item",hiddenClass:"isotope-hidden",hiddenStyle:{opacity:0,scale:.001},visibleStyle:{opacity:1,scale:1},containerStyle:{position:"relative",overflow:"hidden"},animationEngine:"best-available",animationOptions:{queue:!1,duration:800},sortBy:"original-order",sortAscending:!0,resizesContainer:!0,transformsEnabled:!0,itemPositionDataEnabled:!1},b.Isotope.prototype={_create:function(a){this.options=b.extend({},b.Isotope.settings,a),this.styleQueue=[],this.elemCount=0;var c=this.element[0].style;this.originalStyle={};var d=u.slice(0);for(var e in this.options.containerStyle)d.push(e);for(var f=0,g=d.length;f<g;f++)e=d[f],this.originalStyle[e]=c[e]||"";this.element.css(this.options.containerStyle),this._updateAnimationEngine(),this._updateUsingTransforms();var h={"original-order":function(a,b){return b.elemCount++,b.elemCount},random:function(){return Math.random()}};this.options.getSortData=b.extend(this.options.getSortData,h),this.reloadItems(),this.offset={left:parseInt(this.element.css("padding-left")||0,10),top:parseInt(this.element.css("padding-top")||0,10)};var i=this;setTimeout(function(){i.element.addClass(i.options.containerClass)},0),this.options.resizable&&v.bind("smartresize.isotope",function(){i.resize()}),this.element.delegate("."+this.options.hiddenClass,"click",function(){return!1})},_getAtoms:function(a){var b=this.options.itemSelector,c=b?a.filter(b).add(a.find(b)):a,d={position:"absolute"};return this.usingTransforms&&(d.left=0,d.top=0),c.css(d).addClass(this.options.itemClass),this.updateSortData(c,!0),c},_init:function(a){this.$filteredAtoms=this._filter(this.$allAtoms),this._sort(),this.reLayout(a)},option:function(a){if(b.isPlainObject(a)){this.options=b.extend(!0,this.options,a);var c;for(var d in a)c="_update"+f(d),this[c]&&this[c]()}},_updateAnimationEngine:function(){var a=this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,""),b;switch(a){case"css":case"none":b=!1;break;case"jquery":b=!0;break;default:b=!e.csstransitions}this.isUsingJQueryAnimation=b,this._updateUsingTransforms()},_updateTransformsEnabled:function(){this._updateUsingTransforms()},_updateUsingTransforms:function(){var a=this.usingTransforms=this.options.transformsEnabled&&e.csstransforms&&e.csstransitions&&!this.isUsingJQueryAnimation;a||(delete this.options.hiddenStyle.scale,delete this.options.visibleStyle.scale),this.getPositionStyles=a?this._translate:this._positionAbs},_filter:function(a){var b=this.options.filter===""?"*":this.options.filter;if(!b)return a;var c=this.options.hiddenClass,d="."+c,e=a.filter(d),f=e;if(b!=="*"){f=e.filter(b);var g=a.not(d).not(b).addClass(c);this.styleQueue.push({$el:g,style:this.options.hiddenStyle})}return this.styleQueue.push({$el:f,style:this.options.visibleStyle}),f.removeClass(c),a.filter(b)},updateSortData:function(a,c){var d=this,e=this.options.getSortData,f,g;a.each(function(){f=b(this),g={};for(var a in e)!c&&a==="original-order"?g[a]=b.data(this,"isotope-sort-data")[a]:g[a]=e[a](f,d);b.data(this,"isotope-sort-data",g)})},_sort:function(){var a=this.options.sortBy,b=this._getSorter,c=this.options.sortAscending?1:-1,d=function(d,e){var f=b(d,a),g=b(e,a);return f===g&&a!=="original-order"&&(f=b(d,"original-order"),g=b(e,"original-order")),(f>g?1:f<g?-1:0)*c};this.$filteredAtoms.sort(d)},_getSorter:function(a,c){return b.data(a,"isotope-sort-data")[c]},_translate:function(a,b){return{translate:[a,b]}},_positionAbs:function(a,b){return{left:a,top:b}},_pushPosition:function(a,b,c){b=Math.round(b+this.offset.left),c=Math.round(c+this.offset.top);var d=this.getPositionStyles(b,c);this.styleQueue.push({$el:a,style:d}),this.options.itemPositionDataEnabled&&a.data("isotope-item-position",{x:b,y:c})},layout:function(a,b){var c=this.options.layoutMode;this["_"+c+"Layout"](a);if(this.options.resizesContainer){var d=this["_"+c+"GetContainerSize"]();this.styleQueue.push({$el:this.element,style:d})}this._processStyleQueue(a,b),this.isLaidOut=!0},_processStyleQueue:function(a,c){var d=this.isLaidOut?this.isUsingJQueryAnimation?"animate":"css":"css",f=this.options.animationOptions,g=this.options.onLayout,h,i,j,k;i=function(a,b){b.$el[d](b.style,f)};if(this._isInserting&&this.isUsingJQueryAnimation)i=function(a,b){h=b.$el.hasClass("no-transition")?"css":d,b.$el[h](b.style,f)};else if(c||g||f.complete){var l=!1,m=[c,g,f.complete],n=this;j=!0,k=function(){if(l)return;var b;for(var c=0,d=m.length;c<d;c++)b=m[c],typeof b=="function"&&b.call(n.element,a,n);l=!0};if(this.isUsingJQueryAnimation&&d==="animate")f.complete=k,j=!1;else if(e.csstransitions){var o=0,p=this.styleQueue[0],s=p&&p.$el,t;while(!s||!s.length){t=this.styleQueue[o++];if(!t)return;s=t.$el}var u=parseFloat(getComputedStyle(s[0])[r]);u>0&&(i=function(a,b){b.$el[d](b.style,f).one(q,k)},j=!1)}}b.each(this.styleQueue,i),j&&k(),this.styleQueue=[]},resize:function(){this["_"+this.options.layoutMode+"ResizeChanged"]()&&this.reLayout()},reLayout:function(a){this["_"+this.options.layoutMode+"Reset"](),this.layout(this.$filteredAtoms,a)},addItems:function(a,b){var c=this._getAtoms(a);this.$allAtoms=this.$allAtoms.add(c),b&&b(c)},insert:function(a,b){this.element.append(a);var c=this;this.addItems(a,function(a){var d=c._filter(a);c._addHideAppended(d),c._sort(),c.reLayout(),c._revealAppended(d,b)})},appended:function(a,b){var c=this;this.addItems(a,function(a){c._addHideAppended(a),c.layout(a),c._revealAppended(a,b)})},_addHideAppended:function(a){this.$filteredAtoms=this.$filteredAtoms.add(a),a.addClass("no-transition"),this._isInserting=!0,this.styleQueue.push({$el:a,style:this.options.hiddenStyle})},_revealAppended:function(a,b){var c=this;setTimeout(function(){a.removeClass("no-transition"),c.styleQueue.push({$el:a,style:c.options.visibleStyle}),c._isInserting=!1,c._processStyleQueue(a,b)},10)},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children())},remove:function(a,b){this.$allAtoms=this.$allAtoms.not(a),this.$filteredAtoms=this.$filteredAtoms.not(a);var c=this,d=function(){a.remove(),b&&b.call(c.element)};a.filter(":not(."+this.options.hiddenClass+")").length?(this.styleQueue.push({$el:a,style:this.options.hiddenStyle}),this._sort(),this.reLayout(d)):d()},shuffle:function(a){this.updateSortData(this.$allAtoms),this.options.sortBy="random",this._sort(),this.reLayout(a)},destroy:function(){var a=this.usingTransforms,b=this.options;this.$allAtoms.removeClass(b.hiddenClass+" "+b.itemClass).each(function(){var b=this.style;b.position="",b.top="",b.left="",b.opacity="",a&&(b[i]="")});var c=this.element[0].style;for(var d in this.originalStyle)c[d]=this.originalStyle[d];this.element.unbind(".isotope").undelegate("."+b.hiddenClass,"click").removeClass(b.containerClass).removeData("isotope"),v.unbind(".isotope")},_getSegments:function(a){var b=this.options.layoutMode,c=a?"rowHeight":"columnWidth",d=a?"height":"width",e=a?"rows":"cols",g=this.element[d](),h,i=this.options[b]&&this.options[b][c]||this.$filteredAtoms["outer"+f(d)](!0)||g;h=Math.floor(g/i),h=Math.max(h,1),this[b][e]=h,this[b][c]=i},_checkIfSegmentsChanged:function(a){var b=this.options.layoutMode,c=a?"rows":"cols",d=this[b][c];return this._getSegments(a),this[b][c]!==d},_masonryReset:function(){this.masonry={},this._getSegments();var a=this.masonry.cols;this.masonry.colYs=[];while(a--)this.masonry.colYs.push(0)},_masonryLayout:function(a){var c=this,d=c.masonry;a.each(function(){var a=b(this),e=Math.ceil(a.outerWidth(!0)/d.columnWidth);e=Math.min(e,d.cols);if(e===1)c._masonryPlaceBrick(a,d.colYs);else{var f=d.cols+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.colYs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryPlaceBrick(a,g)}})},_masonryPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=this.masonry.columnWidth*d,h=c;this._pushPosition(a,g,h);var i=c+a.outerHeight(!0),j=this.masonry.cols+1-f;for(e=0;e<j;e++)this.masonry.colYs[d+e]=i},_masonryGetContainerSize:function(){var a=Math.max.apply(Math,this.masonry.colYs);return{height:a}},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged()},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0}},_fitRowsLayout:function(a){var c=this,d=this.element.width(),e=this.fitRows;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.x!==0&&f+e.x>d&&(e.x=0,e.y=e.height),c._pushPosition(a,e.x,e.y),e.height=Math.max(e.y+g,e.height),e.x+=f})},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height}},_fitRowsResizeChanged:function(){return!0},_cellsByRowReset:function(){this.cellsByRow={index:0},this._getSegments(),this._getSegments(!0)},_cellsByRowLayout:function(a){var c=this,d=this.cellsByRow;a.each(function(){var a=b(this),e=d.index%d.cols,f=Math.floor(d.index/d.cols),g=(e+.5)*d.columnWidth-a.outerWidth(!0)/2,h=(f+.5)*d.rowHeight-a.outerHeight(!0)/2;c._pushPosition(a,g,h),d.index++})},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top}},_cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged()},_straightDownReset:function(){this.straightDown={y:0}},_straightDownLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,0,c.straightDown.y),c.straightDown.y+=d.outerHeight(!0)})},_straightDownGetContainerSize:function(){return{height:this.straightDown.y}},_straightDownResizeChanged:function(){return!0},_masonryHorizontalReset:function(){this.masonryHorizontal={},this._getSegments(!0);var a=this.masonryHorizontal.rows;this.masonryHorizontal.rowXs=[];while(a--)this.masonryHorizontal.rowXs.push(0)},_masonryHorizontalLayout:function(a){var c=this,d=c.masonryHorizontal;a.each(function(){var a=b(this),e=Math.ceil(a.outerHeight(!0)/d.rowHeight);e=Math.min(e,d.rows);if(e===1)c._masonryHorizontalPlaceBrick(a,d.rowXs);else{var f=d.rows+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.rowXs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryHorizontalPlaceBrick(a,g)}})},_masonryHorizontalPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=c,h=this.masonryHorizontal.rowHeight*d;this._pushPosition(a,g,h);var i=c+a.outerWidth(!0),j=this.masonryHorizontal.rows+1-f;for(e=0;e<j;e++)this.masonryHorizontal.rowXs[d+e]=i},_masonryHorizontalGetContainerSize:function(){var a=Math.max.apply(Math,this.masonryHorizontal.rowXs);return{width:a}},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0}},_fitColumnsLayout:function(a){var c=this,d=this.element.height(),e=this.fitColumns;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.y!==0&&g+e.y>d&&(e.x=e.width,e.y=0),c._pushPosition(a,e.x,e.y),e.width=Math.max(e.x+f,e.width),e.y+=g})},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width}},_fitColumnsResizeChanged:function(){return!0},_cellsByColumnReset:function(){this.cellsByColumn={index:0},this._getSegments(),this._getSegments(!0)},_cellsByColumnLayout:function(a){var c=this,d=this.cellsByColumn;a.each(function(){var a=b(this),e=Math.floor(d.index/d.rows),f=d.index%d.rows,g=(e+.5)*d.columnWidth-a.outerWidth(!0)/2,h=(f+.5)*d.rowHeight-a.outerHeight(!0)/2;c._pushPosition(a,g,h),d.index++})},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth}},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_straightAcrossReset:function(){this.straightAcross={x:0}},_straightAcrossLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,c.straightAcross.x,0),c.straightAcross.x+=d.outerWidth(!0)})},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x}},_straightAcrossResizeChanged:function(){return!0}},b.fn.imagesLoaded=function(a){function h(){a.call(c,d)}function i(a){var c=a.target;c.src!==f&&b.inArray(c,g)===-1&&(g.push(c),--e<=0&&(setTimeout(h),d.unbind(".imagesLoaded",i)))}var c=this,d=c.find("img").add(c.filter("img")),e=d.length,f="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",g=[];return e||h(),d.bind("load.imagesLoaded error.imagesLoaded",i).each(function(){var a=this.src;this.src=f,this.src=a}),c};var w=function(b){a.console&&a.console.error(b)};b.fn.isotope=function(a,c){if(typeof a=="string"){var d=Array.prototype.slice.call(arguments,1);this.each(function(){var c=b.data(this,"isotope");if(!c){w("cannot call methods on isotope prior to initialization; attempted to call method '"+a+"'");return}if(!b.isFunction(c[a])||a.charAt(0)==="_"){w("no such method '"+a+"' for isotope instance");return}c[a].apply(c,d)})}else this.each(function(){var d=b.data(this,"isotope");d?(d.option(a),d._init(c)):b.data(this,"isotope",new b.Isotope(a,this,c))});return this}})(window,jQuery);





/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
 
 
 
 
 /*
 * Isotope PACKAGED v2.0.1
 * Filter & sort magical layouts
 * http://isotope.metafizzy.co
 */

(function(t){function e(){}function i(t){function i(e){e.prototype.option||(e.prototype.option=function(e){t.isPlainObject(e)&&(this.options=t.extend(!0,this.options,e))})}function n(e,i){t.fn[e]=function(n){if("string"==typeof n){for(var s=o.call(arguments,1),a=0,u=this.length;u>a;a++){var p=this[a],h=t.data(p,e);if(h)if(t.isFunction(h[n])&&"_"!==n.charAt(0)){var f=h[n].apply(h,s);if(void 0!==f)return f}else r("no such method '"+n+"' for "+e+" instance");else r("cannot call methods on "+e+" prior to initialization; "+"attempted to call '"+n+"'")}return this}return this.each(function(){var o=t.data(this,e);o?(o.option(n),o._init()):(o=new i(this,n),t.data(this,e,o))})}}if(t){var r="undefined"==typeof console?e:function(t){console.error(t)};return t.bridget=function(t,e){i(e),n(t,e)},t.bridget}}var o=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],i):i(t.jQuery)})(window),function(t){function e(e){var i=t.event;return i.target=i.target||i.srcElement||e,i}var i=document.documentElement,o=function(){};i.addEventListener?o=function(t,e,i){t.addEventListener(e,i,!1)}:i.attachEvent&&(o=function(t,i,o){t[i+o]=o.handleEvent?function(){var i=e(t);o.handleEvent.call(o,i)}:function(){var i=e(t);o.call(t,i)},t.attachEvent("on"+i,t[i+o])});var n=function(){};i.removeEventListener?n=function(t,e,i){t.removeEventListener(e,i,!1)}:i.detachEvent&&(n=function(t,e,i){t.detachEvent("on"+e,t[e+i]);try{delete t[e+i]}catch(o){t[e+i]=void 0}});var r={bind:o,unbind:n};"function"==typeof define&&define.amd?define("eventie/eventie",r):"object"==typeof exports?module.exports=r:t.eventie=r}(this),function(t){function e(t){"function"==typeof t&&(e.isReady?t():r.push(t))}function i(t){var i="readystatechange"===t.type&&"complete"!==n.readyState;if(!e.isReady&&!i){e.isReady=!0;for(var o=0,s=r.length;s>o;o++){var a=r[o];a()}}}function o(o){return o.bind(n,"DOMContentLoaded",i),o.bind(n,"readystatechange",i),o.bind(t,"load",i),e}var n=t.document,r=[];e.isReady=!1,"function"==typeof define&&define.amd?(e.isReady="function"==typeof requirejs,define("doc-ready/doc-ready",["eventie/eventie"],o)):t.docReady=o(t.eventie)}(this),function(){function t(){}function e(t,e){for(var i=t.length;i--;)if(t[i].listener===e)return i;return-1}function i(t){return function(){return this[t].apply(this,arguments)}}var o=t.prototype,n=this,r=n.EventEmitter;o.getListeners=function(t){var e,i,o=this._getEvents();if(t instanceof RegExp){e={};for(i in o)o.hasOwnProperty(i)&&t.test(i)&&(e[i]=o[i])}else e=o[t]||(o[t]=[]);return e},o.flattenListeners=function(t){var e,i=[];for(e=0;t.length>e;e+=1)i.push(t[e].listener);return i},o.getListenersAsObject=function(t){var e,i=this.getListeners(t);return i instanceof Array&&(e={},e[t]=i),e||i},o.addListener=function(t,i){var o,n=this.getListenersAsObject(t),r="object"==typeof i;for(o in n)n.hasOwnProperty(o)&&-1===e(n[o],i)&&n[o].push(r?i:{listener:i,once:!1});return this},o.on=i("addListener"),o.addOnceListener=function(t,e){return this.addListener(t,{listener:e,once:!0})},o.once=i("addOnceListener"),o.defineEvent=function(t){return this.getListeners(t),this},o.defineEvents=function(t){for(var e=0;t.length>e;e+=1)this.defineEvent(t[e]);return this},o.removeListener=function(t,i){var o,n,r=this.getListenersAsObject(t);for(n in r)r.hasOwnProperty(n)&&(o=e(r[n],i),-1!==o&&r[n].splice(o,1));return this},o.off=i("removeListener"),o.addListeners=function(t,e){return this.manipulateListeners(!1,t,e)},o.removeListeners=function(t,e){return this.manipulateListeners(!0,t,e)},o.manipulateListeners=function(t,e,i){var o,n,r=t?this.removeListener:this.addListener,s=t?this.removeListeners:this.addListeners;if("object"!=typeof e||e instanceof RegExp)for(o=i.length;o--;)r.call(this,e,i[o]);else for(o in e)e.hasOwnProperty(o)&&(n=e[o])&&("function"==typeof n?r.call(this,o,n):s.call(this,o,n));return this},o.removeEvent=function(t){var e,i=typeof t,o=this._getEvents();if("string"===i)delete o[t];else if(t instanceof RegExp)for(e in o)o.hasOwnProperty(e)&&t.test(e)&&delete o[e];else delete this._events;return this},o.removeAllListeners=i("removeEvent"),o.emitEvent=function(t,e){var i,o,n,r,s=this.getListenersAsObject(t);for(n in s)if(s.hasOwnProperty(n))for(o=s[n].length;o--;)i=s[n][o],i.once===!0&&this.removeListener(t,i.listener),r=i.listener.apply(this,e||[]),r===this._getOnceReturnValue()&&this.removeListener(t,i.listener);return this},o.trigger=i("emitEvent"),o.emit=function(t){var e=Array.prototype.slice.call(arguments,1);return this.emitEvent(t,e)},o.setOnceReturnValue=function(t){return this._onceReturnValue=t,this},o._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},o._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return n.EventEmitter=r,t},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return t}):"object"==typeof module&&module.exports?module.exports=t:this.EventEmitter=t}.call(this),function(t){function e(t){if(t){if("string"==typeof o[t])return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e,n=0,r=i.length;r>n;n++)if(e=i[n]+t,"string"==typeof o[e])return e}}var i="Webkit Moz ms Ms O".split(" "),o=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return e}):"object"==typeof exports?module.exports=e:t.getStyleProperty=e}(window),function(t){function e(t){var e=parseFloat(t),i=-1===t.indexOf("%")&&!isNaN(e);return i&&e}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0,i=s.length;i>e;e++){var o=s[e];t[o]=0}return t}function o(t){function o(t){if("string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var o=r(t);if("none"===o.display)return i();var n={};n.width=t.offsetWidth,n.height=t.offsetHeight;for(var h=n.isBorderBox=!(!p||!o[p]||"border-box"!==o[p]),f=0,d=s.length;d>f;f++){var l=s[f],c=o[l];c=a(t,c);var y=parseFloat(c);n[l]=isNaN(y)?0:y}var m=n.paddingLeft+n.paddingRight,g=n.paddingTop+n.paddingBottom,v=n.marginLeft+n.marginRight,_=n.marginTop+n.marginBottom,I=n.borderLeftWidth+n.borderRightWidth,L=n.borderTopWidth+n.borderBottomWidth,z=h&&u,S=e(o.width);S!==!1&&(n.width=S+(z?0:m+I));var b=e(o.height);return b!==!1&&(n.height=b+(z?0:g+L)),n.innerWidth=n.width-(m+I),n.innerHeight=n.height-(g+L),n.outerWidth=n.width+v,n.outerHeight=n.height+_,n}}function a(t,e){if(n||-1===e.indexOf("%"))return e;var i=t.style,o=i.left,r=t.runtimeStyle,s=r&&r.left;return s&&(r.left=t.currentStyle.left),i.left=e,e=i.pixelLeft,i.left=o,s&&(r.left=s),e}var u,p=t("boxSizing");return function(){if(p){var t=document.createElement("div");t.style.width="200px",t.style.padding="1px 2px 3px 4px",t.style.borderStyle="solid",t.style.borderWidth="1px 2px 3px 4px",t.style[p]="border-box";var i=document.body||document.documentElement;i.appendChild(t);var o=r(t);u=200===e(o.width),i.removeChild(t)}}(),o}var n=t.getComputedStyle,r=n?function(t){return n(t,null)}:function(t){return t.currentStyle},s=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],o):"object"==typeof exports?module.exports=o(require("get-style-property")):t.getSize=o(t.getStyleProperty)}(window),function(t,e){function i(t,e){return t[a](e)}function o(t){if(!t.parentNode){var e=document.createDocumentFragment();e.appendChild(t)}}function n(t,e){o(t);for(var i=t.parentNode.querySelectorAll(e),n=0,r=i.length;r>n;n++)if(i[n]===t)return!0;return!1}function r(t,e){return o(t),i(t,e)}var s,a=function(){if(e.matchesSelector)return"matchesSelector";for(var t=["webkit","moz","ms","o"],i=0,o=t.length;o>i;i++){var n=t[i],r=n+"MatchesSelector";if(e[r])return r}}();if(a){var u=document.createElement("div"),p=i(u,"div");s=p?i:r}else s=n;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return s}):window.matchesSelector=s}(this,Element.prototype),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t){for(var e in t)return!1;return e=null,!0}function o(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}function n(t,n,r){function a(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}var u=r("transition"),p=r("transform"),h=u&&p,f=!!r("perspective"),d={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[u],l=["transform","transition","transitionDuration","transitionProperty"],c=function(){for(var t={},e=0,i=l.length;i>e;e++){var o=l[e],n=r(o);n&&n!==o&&(t[o]=n)}return t}();e(a.prototype,t.prototype),a.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},a.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},a.prototype.getSize=function(){this.size=n(this.element)},a.prototype.css=function(t){var e=this.element.style;for(var i in t){var o=c[i]||i;e[o]=t[i]}},a.prototype.getPosition=function(){var t=s(this.element),e=this.layout.options,i=e.isOriginLeft,o=e.isOriginTop,n=parseInt(t[i?"left":"right"],10),r=parseInt(t[o?"top":"bottom"],10);n=isNaN(n)?0:n,r=isNaN(r)?0:r;var a=this.layout.size;n-=i?a.paddingLeft:a.paddingRight,r-=o?a.paddingTop:a.paddingBottom,this.position.x=n,this.position.y=r},a.prototype.layoutPosition=function(){var t=this.layout.size,e=this.layout.options,i={};e.isOriginLeft?(i.left=this.position.x+t.paddingLeft+"px",i.right=""):(i.right=this.position.x+t.paddingRight+"px",i.left=""),e.isOriginTop?(i.top=this.position.y+t.paddingTop+"px",i.bottom=""):(i.bottom=this.position.y+t.paddingBottom+"px",i.top=""),this.css(i),this.emitEvent("layout",[this])};var y=f?function(t,e){return"translate3d("+t+"px, "+e+"px, 0)"}:function(t,e){return"translate("+t+"px, "+e+"px)"};a.prototype._transitionTo=function(t,e){this.getPosition();var i=this.position.x,o=this.position.y,n=parseInt(t,10),r=parseInt(e,10),s=n===this.position.x&&r===this.position.y;if(this.setPosition(t,e),s&&!this.isTransitioning)return this.layoutPosition(),void 0;var a=t-i,u=e-o,p={},h=this.layout.options;a=h.isOriginLeft?a:-a,u=h.isOriginTop?u:-u,p.transform=y(a,u),this.transition({to:p,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},a.prototype.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},a.prototype.moveTo=h?a.prototype._transitionTo:a.prototype.goTo,a.prototype.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},a.prototype._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},a.prototype._transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return this._nonTransition(t),void 0;var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var o=this.element.offsetHeight;o=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var m=p&&o(p)+",opacity";a.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:m,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(d,this,!1))},a.prototype.transition=a.prototype[u?"_transition":"_nonTransition"],a.prototype.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},a.prototype.onotransitionend=function(t){this.ontransitionend(t)};var g={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};a.prototype.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,o=g[t.propertyName]||t.propertyName;if(delete e.ingProperties[o],i(e.ingProperties)&&this.disableTransition(),o in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[o]),o in e.onEnd){var n=e.onEnd[o];n.call(this),delete e.onEnd[o]}this.emitEvent("transitionEnd",[this])}},a.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(d,this,!1),this.isTransitioning=!1},a.prototype._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var v={transitionProperty:"",transitionDuration:""};return a.prototype.removeTransitionStyles=function(){this.css(v)},a.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.emitEvent("remove",[this])},a.prototype.remove=function(){if(!u||!parseFloat(this.layout.options.transitionDuration))return this.removeElem(),void 0;var t=this;this.on("transitionEnd",function(){return t.removeElem(),!0}),this.hide()},a.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options;this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0})},a.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options;this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:{opacity:function(){this.isHidden&&this.css({display:"none"})}}})},a.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},a}var r=t.getComputedStyle,s=r?function(t){return r(t,null)}:function(t){return t.currentStyle};"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property"],n):(t.Outlayer={},t.Outlayer.Item=n(t.EventEmitter,t.getSize,t.getStyleProperty))}(window),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t){return"[object Array]"===f.call(t)}function o(t){var e=[];if(i(t))e=t;else if(t&&"number"==typeof t.length)for(var o=0,n=t.length;n>o;o++)e.push(t[o]);else e.push(t);return e}function n(t,e){var i=l(e,t);-1!==i&&e.splice(i,1)}function r(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()}function s(i,s,f,l,c,y){function m(t,i){if("string"==typeof t&&(t=a.querySelector(t)),!t||!d(t))return u&&u.error("Bad "+this.constructor.namespace+" element: "+t),void 0;this.element=t,this.options=e({},this.constructor.defaults),this.option(i);var o=++g;this.element.outlayerGUID=o,v[o]=this,this._create(),this.options.isInitLayout&&this.layout()}var g=0,v={};return m.namespace="outlayer",m.Item=y,m.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},e(m.prototype,f.prototype),m.prototype.option=function(t){e(this.options,t)},m.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),e(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},m.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},m.prototype._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,o=[],n=0,r=e.length;r>n;n++){var s=e[n],a=new i(s,this);o.push(a)}return o},m.prototype._filterFindItemElements=function(t){t=o(t);for(var e=this.options.itemSelector,i=[],n=0,r=t.length;r>n;n++){var s=t[n];if(d(s))if(e){c(s,e)&&i.push(s);for(var a=s.querySelectorAll(e),u=0,p=a.length;p>u;u++)i.push(a[u])}else i.push(s)}return i},m.prototype.getItemElements=function(){for(var t=[],e=0,i=this.items.length;i>e;e++)t.push(this.items[e].element);return t},m.prototype.layout=function(){this._resetLayout(),this._manageStamps();var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,t),this._isLayoutInited=!0},m.prototype._init=m.prototype.layout,m.prototype._resetLayout=function(){this.getSize()},m.prototype.getSize=function(){this.size=l(this.element)},m.prototype._getMeasurement=function(t,e){var i,o=this.options[t];o?("string"==typeof o?i=this.element.querySelector(o):d(o)&&(i=o),this[t]=i?l(i)[e]:o):this[t]=0},m.prototype.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},m.prototype._getItemsForLayout=function(t){for(var e=[],i=0,o=t.length;o>i;i++){var n=t[i];n.isIgnored||e.push(n)}return e},m.prototype._layoutItems=function(t,e){function i(){o.emitEvent("layoutComplete",[o,t])}var o=this;if(!t||!t.length)return i(),void 0;this._itemsOn(t,"layout",i);for(var n=[],r=0,s=t.length;s>r;r++){var a=t[r],u=this._getItemLayoutPosition(a);u.item=a,u.isInstant=e||a.isLayoutInstant,n.push(u)}this._processLayoutQueue(n)},m.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},m.prototype._processLayoutQueue=function(t){for(var e=0,i=t.length;i>e;e++){var o=t[e];this._positionItem(o.item,o.x,o.y,o.isInstant)}},m.prototype._positionItem=function(t,e,i,o){o?t.goTo(e,i):t.moveTo(e,i)},m.prototype._postLayout=function(){this.resizeContainer()},m.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var t=this._getContainerSize();t&&(this._setContainerMeasure(t.width,!0),this._setContainerMeasure(t.height,!1))}},m.prototype._getContainerSize=h,m.prototype._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},m.prototype._itemsOn=function(t,e,i){function o(){return n++,n===r&&i.call(s),!0}for(var n=0,r=t.length,s=this,a=0,u=t.length;u>a;a++){var p=t[a];p.on(e,o)}},m.prototype.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},m.prototype.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},m.prototype.stamp=function(t){if(t=this._find(t)){this.stamps=this.stamps.concat(t);for(var e=0,i=t.length;i>e;e++){var o=t[e];this.ignore(o)}}},m.prototype.unstamp=function(t){if(t=this._find(t))for(var e=0,i=t.length;i>e;e++){var o=t[e];n(o,this.stamps),this.unignore(o)}},m.prototype._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=o(t)):void 0},m.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var t=0,e=this.stamps.length;e>t;t++){var i=this.stamps[t];this._manageStamp(i)}}},m.prototype._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},m.prototype._manageStamp=h,m.prototype._getElementOffset=function(t){var e=t.getBoundingClientRect(),i=this._boundingRect,o=l(t),n={left:e.left-i.left-o.marginLeft,top:e.top-i.top-o.marginTop,right:i.right-e.right-o.marginRight,bottom:i.bottom-e.bottom-o.marginBottom};return n},m.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},m.prototype.bindResize=function(){this.isResizeBound||(i.bind(t,"resize",this),this.isResizeBound=!0)},m.prototype.unbindResize=function(){this.isResizeBound&&i.unbind(t,"resize",this),this.isResizeBound=!1},m.prototype.onresize=function(){function t(){e.resize(),delete e.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var e=this;this.resizeTimeout=setTimeout(t,100)},m.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},m.prototype.needsResizeLayout=function(){var t=l(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},m.prototype.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},m.prototype.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},m.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},m.prototype.reveal=function(t){var e=t&&t.length;if(e)for(var i=0;e>i;i++){var o=t[i];o.reveal()}},m.prototype.hide=function(t){var e=t&&t.length;if(e)for(var i=0;e>i;i++){var o=t[i];o.hide()}},m.prototype.getItem=function(t){for(var e=0,i=this.items.length;i>e;e++){var o=this.items[e];if(o.element===t)return o}},m.prototype.getItems=function(t){if(t&&t.length){for(var e=[],i=0,o=t.length;o>i;i++){var n=t[i],r=this.getItem(n);r&&e.push(r)}return e}},m.prototype.remove=function(t){t=o(t);var e=this.getItems(t);if(e&&e.length){this._itemsOn(e,"remove",function(){this.emitEvent("removeComplete",[this,e])});for(var i=0,r=e.length;r>i;i++){var s=e[i];s.remove(),n(s,this.items)}}},m.prototype.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="";for(var e=0,i=this.items.length;i>e;e++){var o=this.items[e];o.destroy()}this.unbindResize(),delete this.element.outlayerGUID,p&&p.removeData(this.element,this.constructor.namespace)},m.data=function(t){var e=t&&t.outlayerGUID;return e&&v[e]},m.create=function(t,i){function o(){m.apply(this,arguments)}return Object.create?o.prototype=Object.create(m.prototype):e(o.prototype,m.prototype),o.prototype.constructor=o,o.defaults=e({},m.defaults),e(o.defaults,i),o.prototype.settings={},o.namespace=t,o.data=m.data,o.Item=function(){y.apply(this,arguments)},o.Item.prototype=new y,s(function(){for(var e=r(t),i=a.querySelectorAll(".js-"+e),n="data-"+e+"-options",s=0,h=i.length;h>s;s++){var f,d=i[s],l=d.getAttribute(n);try{f=l&&JSON.parse(l)}catch(c){u&&u.error("Error parsing "+n+" on "+d.nodeName.toLowerCase()+(d.id?"#"+d.id:"")+": "+c);continue}var y=new o(d,f);p&&p.data(d,t,y)}}),p&&p.bridget&&p.bridget(t,o),o},m.Item=y,m}var a=t.document,u=t.console,p=t.jQuery,h=function(){},f=Object.prototype.toString,d="object"==typeof HTMLElement?function(t){return t instanceof HTMLElement}:function(t){return t&&"object"==typeof t&&1===t.nodeType&&"string"==typeof t.nodeName},l=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;o>i;i++)if(t[i]===e)return i;return-1};"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","doc-ready/doc-ready","eventEmitter/EventEmitter","get-size/get-size","matches-selector/matches-selector","./item"],s):t.Outlayer=s(t.eventie,t.docReady,t.EventEmitter,t.getSize,t.matchesSelector,t.Outlayer.Item)}(window),function(t){function e(t){function e(){t.Item.apply(this,arguments)}e.prototype=new t.Item,e.prototype._create=function(){this.id=this.layout.itemGUID++,t.Item.prototype._create.call(this),this.sortData={}},e.prototype.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var t=this.layout.options.getSortData,e=this.layout._sorters;for(var i in t){var o=e[i];this.sortData[i]=o(this.element,this)}}};var i=e.prototype.destroy;return e.prototype.destroy=function(){i.apply(this,arguments),this.css({display:""})},e}"function"==typeof define&&define.amd?define("isotope/js/item",["outlayer/outlayer"],e):(t.Isotope=t.Isotope||{},t.Isotope.Item=e(t.Outlayer))}(window),function(t){function e(t,e){function i(t){this.isotope=t,t&&(this.options=t.options[this.namespace],this.element=t.element,this.items=t.filteredItems,this.size=t.size)}return function(){function t(t){return function(){return e.prototype[t].apply(this.isotope,arguments)}}for(var o=["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout"],n=0,r=o.length;r>n;n++){var s=o[n];i.prototype[s]=t(s)}}(),i.prototype.needsVerticalResizeLayout=function(){var e=t(this.isotope.element),i=this.isotope.size&&e;return i&&e.innerHeight!==this.isotope.size.innerHeight},i.prototype._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},i.prototype.getColumnWidth=function(){this.getSegmentSize("column","Width")},i.prototype.getRowHeight=function(){this.getSegmentSize("row","Height")},i.prototype.getSegmentSize=function(t,e){var i=t+e,o="outer"+e;if(this._getMeasurement(i,o),!this[i]){var n=this.getFirstItemSize();this[i]=n&&n[o]||this.isotope.size["inner"+e]}},i.prototype.getFirstItemSize=function(){var e=this.isotope.filteredItems[0];return e&&e.element&&t(e.element)},i.prototype.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},i.prototype.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},i.modes={},i.create=function(t,e){function o(){i.apply(this,arguments)}return o.prototype=new i,e&&(o.options=e),o.prototype.namespace=t,i.modes[t]=o,o},i}"function"==typeof define&&define.amd?define("isotope/js/layout-mode",["get-size/get-size","outlayer/outlayer"],e):(t.Isotope=t.Isotope||{},t.Isotope.LayoutMode=e(t.getSize,t.Outlayer))}(window),function(t){function e(t,e){var o=t.create("masonry");return o.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var t=this.cols;for(this.colYs=[];t--;)this.colYs.push(0);this.maxY=0},o.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}this.columnWidth+=this.gutter,this.cols=Math.floor((this.containerWidth+this.gutter)/this.columnWidth),this.cols=Math.max(this.cols,1)},o.prototype.getContainerWidth=function(){var t=this.options.isFitWidth?this.element.parentNode:this.element,i=e(t);this.containerWidth=i&&i.innerWidth},o.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,o=e&&1>e?"round":"ceil",n=Math[o](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var r=this._getColGroup(n),s=Math.min.apply(Math,r),a=i(r,s),u={x:this.columnWidth*a,y:s},p=s+t.size.outerHeight,h=this.cols+1-r.length,f=0;h>f;f++)this.colYs[a+f]=p;return u},o.prototype._getColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,o=0;i>o;o++){var n=this.colYs.slice(o,o+t);e[o]=Math.max.apply(Math,n)}return e},o.prototype._manageStamp=function(t){var i=e(t),o=this._getElementOffset(t),n=this.options.isOriginLeft?o.left:o.right,r=n+i.outerWidth,s=Math.floor(n/this.columnWidth);s=Math.max(0,s);var a=Math.floor(r/this.columnWidth);a-=r%this.columnWidth?0:1,a=Math.min(this.cols-1,a);for(var u=(this.options.isOriginTop?o.top:o.bottom)+i.outerHeight,p=s;a>=p;p++)this.colYs[p]=Math.max(u,this.colYs[p])},o.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this.options.isFitWidth&&(t.width=this._getContainerFitWidth()),t},o.prototype._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},o.prototype.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!==this.containerWidth},o}var i=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;o>i;i++){var n=t[i];if(n===e)return i}return-1};"function"==typeof define&&define.amd?define("masonry/masonry",["outlayer/outlayer","get-size/get-size"],e):t.Masonry=e(t.Outlayer,t.getSize)}(window),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t,i){var o=t.create("masonry"),n=o.prototype._getElementOffset,r=o.prototype.layout,s=o.prototype._getMeasurement;e(o.prototype,i.prototype),o.prototype._getElementOffset=n,o.prototype.layout=r,o.prototype._getMeasurement=s;var a=o.prototype.measureColumns;o.prototype.measureColumns=function(){this.items=this.isotope.filteredItems,a.call(this)};var u=o.prototype._manageStamp;return o.prototype._manageStamp=function(){this.options.isOriginLeft=this.isotope.options.isOriginLeft,this.options.isOriginTop=this.isotope.options.isOriginTop,u.apply(this,arguments)},o}"function"==typeof define&&define.amd?define("isotope/js/layout-modes/masonry",["../layout-mode","masonry/masonry"],i):i(t.Isotope.LayoutMode,t.Masonry)}(window),function(t){function e(t){var e=t.create("fitRows");return e.prototype._resetLayout=function(){this.x=0,this.y=0,this.maxY=0},e.prototype._getItemLayoutPosition=function(t){t.getSize(),0!==this.x&&t.size.outerWidth+this.x>this.isotope.size.innerWidth&&(this.x=0,this.y=this.maxY);var e={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+t.size.outerHeight),this.x+=t.size.outerWidth,e},e.prototype._getContainerSize=function(){return{height:this.maxY}},e}"function"==typeof define&&define.amd?define("isotope/js/layout-modes/fit-rows",["../layout-mode"],e):e(t.Isotope.LayoutMode)}(window),function(t){function e(t){var e=t.create("vertical",{horizontalAlignment:0});return e.prototype._resetLayout=function(){this.y=0},e.prototype._getItemLayoutPosition=function(t){t.getSize();var e=(this.isotope.size.innerWidth-t.size.outerWidth)*this.options.horizontalAlignment,i=this.y;return this.y+=t.size.outerHeight,{x:e,y:i}},e.prototype._getContainerSize=function(){return{height:this.y}},e}"function"==typeof define&&define.amd?define("isotope/js/layout-modes/vertical",["../layout-mode"],e):e(t.Isotope.LayoutMode)}(window),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t){return"[object Array]"===h.call(t)}function o(t){var e=[];if(i(t))e=t;else if(t&&"number"==typeof t.length)for(var o=0,n=t.length;n>o;o++)e.push(t[o]);else e.push(t);return e}function n(t,e){var i=f(e,t);-1!==i&&e.splice(i,1)}function r(t,i,r,u,h){function f(t,e){return function(i,o){for(var n=0,r=t.length;r>n;n++){var s=t[n],a=i.sortData[s],u=o.sortData[s];if(a>u||u>a){var p=void 0!==e[s]?e[s]:e,h=p?1:-1;return(a>u?1:-1)*h}}return 0}}var d=t.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});d.Item=u,d.LayoutMode=h,d.prototype._create=function(){this.itemGUID=0,this._sorters={},this._getSorters(),t.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"];for(var e in h.modes)this._initLayoutMode(e)},d.prototype.reloadItems=function(){this.itemGUID=0,t.prototype.reloadItems.call(this)},d.prototype._itemize=function(){for(var e=t.prototype._itemize.apply(this,arguments),i=0,o=e.length;o>i;i++){var n=e[i];n.id=this.itemGUID++}return this._updateItemsSortData(e),e},d.prototype._initLayoutMode=function(t){var i=h.modes[t],o=this.options[t]||{};this.options[t]=i.options?e(i.options,o):o,this.modes[t]=new i(this)},d.prototype.layout=function(){return!this._isLayoutInited&&this.options.isInitLayout?(this.arrange(),void 0):(this._layout(),void 0)},d.prototype._layout=function(){var t=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,t),this._isLayoutInited=!0},d.prototype.arrange=function(t){this.option(t),this._getIsInstant(),this.filteredItems=this._filter(this.items),this._sort(),this._layout()},d.prototype._init=d.prototype.arrange,d.prototype._getIsInstant=function(){var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;return this._isInstant=t,t},d.prototype._filter=function(t){function e(){f.reveal(n),f.hide(r)}var i=this.options.filter;i=i||"*";for(var o=[],n=[],r=[],s=this._getFilterTest(i),a=0,u=t.length;u>a;a++){var p=t[a];if(!p.isIgnored){var h=s(p);h&&o.push(p),h&&p.isHidden?n.push(p):h||p.isHidden||r.push(p)}}var f=this;return this._isInstant?this._noTransition(e):e(),o},d.prototype._getFilterTest=function(t){return s&&this.options.isJQueryFiltering?function(e){return s(e.element).is(t)}:"function"==typeof t?function(e){return t(e.element)}:function(e){return r(e.element,t)}},d.prototype.updateSortData=function(t){this._getSorters(),t=o(t);
var e=this.getItems(t);e=e.length?e:this.items,this._updateItemsSortData(e)},d.prototype._getSorters=function(){var t=this.options.getSortData;for(var e in t){var i=t[e];this._sorters[e]=l(i)}},d.prototype._updateItemsSortData=function(t){for(var e=0,i=t.length;i>e;e++){var o=t[e];o.updateSortData()}};var l=function(){function t(t){if("string"!=typeof t)return t;var i=a(t).split(" "),o=i[0],n=o.match(/^\[(.+)\]$/),r=n&&n[1],s=e(r,o),u=d.sortDataParsers[i[1]];return t=u?function(t){return t&&u(s(t))}:function(t){return t&&s(t)}}function e(t,e){var i;return i=t?function(e){return e.getAttribute(t)}:function(t){var i=t.querySelector(e);return i&&p(i)}}return t}();d.sortDataParsers={parseInt:function(t){return parseInt(t,10)},parseFloat:function(t){return parseFloat(t)}},d.prototype._sort=function(){var t=this.options.sortBy;if(t){var e=[].concat.apply(t,this.sortHistory),i=f(e,this.options.sortAscending);this.filteredItems.sort(i),t!==this.sortHistory[0]&&this.sortHistory.unshift(t)}},d.prototype._mode=function(){var t=this.options.layoutMode,e=this.modes[t];if(!e)throw Error("No layout mode: "+t);return e.options=this.options[t],e},d.prototype._resetLayout=function(){t.prototype._resetLayout.call(this),this._mode()._resetLayout()},d.prototype._getItemLayoutPosition=function(t){return this._mode()._getItemLayoutPosition(t)},d.prototype._manageStamp=function(t){this._mode()._manageStamp(t)},d.prototype._getContainerSize=function(){return this._mode()._getContainerSize()},d.prototype.needsResizeLayout=function(){return this._mode().needsResizeLayout()},d.prototype.appended=function(t){var e=this.addItems(t);if(e.length){var i=this._filterRevealAdded(e);this.filteredItems=this.filteredItems.concat(i)}},d.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps();var o=this._filterRevealAdded(e);this.layoutItems(i),this.filteredItems=o.concat(this.filteredItems)}},d.prototype._filterRevealAdded=function(t){var e=this._noTransition(function(){return this._filter(t)});return this.layoutItems(e,!0),this.reveal(e),t},d.prototype.insert=function(t){var e=this.addItems(t);if(e.length){var i,o,n=e.length;for(i=0;n>i;i++)o=e[i],this.element.appendChild(o.element);var r=this._filter(e);for(this._noTransition(function(){this.hide(r)}),i=0;n>i;i++)e[i].isLayoutInstant=!0;for(this.arrange(),i=0;n>i;i++)delete e[i].isLayoutInstant;this.reveal(r)}};var c=d.prototype.remove;return d.prototype.remove=function(t){t=o(t);var e=this.getItems(t);if(c.call(this,t),e&&e.length)for(var i=0,r=e.length;r>i;i++){var s=e[i];n(s,this.filteredItems)}},d.prototype.shuffle=function(){for(var t=0,e=this.items.length;e>t;t++){var i=this.items[t];i.sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},d.prototype._noTransition=function(t){var e=this.options.transitionDuration;this.options.transitionDuration=0;var i=t.call(this);return this.options.transitionDuration=e,i},d.prototype.getFilteredItemElements=function(){for(var t=[],e=0,i=this.filteredItems.length;i>e;e++)t.push(this.filteredItems[e].element);return t},d}var s=t.jQuery,a=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(/^\s+|\s+$/g,"")},u=document.documentElement,p=u.textContent?function(t){return t.textContent}:function(t){return t.innerText},h=Object.prototype.toString,f=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;o>i;i++)if(t[i]===e)return i;return-1};"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","matches-selector/matches-selector","isotope/js/item","isotope/js/layout-mode","isotope/js/layout-modes/masonry","isotope/js/layout-modes/fit-rows","isotope/js/layout-modes/vertical"],r):t.Isotope=r(t.Outlayer,t.getSize,t.matchesSelector,t.Isotope.Item,t.Isotope.LayoutMode)}(window);
///#source 1 1 /JavaScript-Mvc-framework/libs/FrontEnd/owl.carousel.min.js
"function"!==typeof Object.create&&(Object.create=function(f){function g(){}g.prototype=f;return new g});
(function(f,g,k){var l={init:function(a,b){this.$elem=f(b);this.options=f.extend({},f.fn.owlCarousel.options,this.$elem.data(),a);this.userOptions=a;this.loadContent()},loadContent:function(){function a(a){var d,e="";if("function"===typeof b.options.jsonSuccess)b.options.jsonSuccess.apply(this,[a]);else{for(d in a.owl)a.owl.hasOwnProperty(d)&&(e+=a.owl[d].item);b.$elem.html(e)}b.logIn()}var b=this,e;"function"===typeof b.options.beforeInit&&b.options.beforeInit.apply(this,[b.$elem]);"string"===typeof b.options.jsonPath?
(e=b.options.jsonPath,f.getJSON(e,a)):b.logIn()},logIn:function(){this.$elem.data("owl-originalStyles",this.$elem.attr("style"));this.$elem.data("owl-originalClasses",this.$elem.attr("class"));this.$elem.css({opacity:0});this.orignalItems=this.options.items;this.checkBrowser();this.wrapperWidth=0;this.checkVisible=null;this.setVars()},setVars:function(){if(0===this.$elem.children().length)return!1;this.baseClass();this.eventTypes();this.$userItems=this.$elem.children();this.itemsAmount=this.$userItems.length;
this.wrapItems();this.$owlItems=this.$elem.find(".owl-item");this.$owlWrapper=this.$elem.find(".owl-wrapper");this.playDirection="next";this.prevItem=0;this.prevArr=[0];this.currentItem=0;this.customEvents();this.onStartup()},onStartup:function(){this.updateItems();this.calculateAll();this.buildControls();this.updateControls();this.response();this.moveEvents();this.stopOnHover();this.owlStatus();!1!==this.options.transitionStyle&&this.transitionTypes(this.options.transitionStyle);!0===this.options.autoPlay&&
(this.options.autoPlay=5E3);this.play();this.$elem.find(".owl-wrapper").css("display","block");this.$elem.is(":visible")?this.$elem.css("opacity",1):this.watchVisibility();this.onstartup=!1;this.eachMoveUpdate();"function"===typeof this.options.afterInit&&this.options.afterInit.apply(this,[this.$elem])},eachMoveUpdate:function(){!0===this.options.lazyLoad&&this.lazyLoad();!0===this.options.autoHeight&&this.autoHeight();this.onVisibleItems();"function"===typeof this.options.afterAction&&this.options.afterAction.apply(this,
[this.$elem])},updateVars:function(){"function"===typeof this.options.beforeUpdate&&this.options.beforeUpdate.apply(this,[this.$elem]);this.watchVisibility();this.updateItems();this.calculateAll();this.updatePosition();this.updateControls();this.eachMoveUpdate();"function"===typeof this.options.afterUpdate&&this.options.afterUpdate.apply(this,[this.$elem])},reload:function(){var a=this;g.setTimeout(function(){a.updateVars()},0)},watchVisibility:function(){var a=this;if(!1===a.$elem.is(":visible"))a.$elem.css({opacity:0}),
g.clearInterval(a.autoPlayInterval),g.clearInterval(a.checkVisible);else return!1;a.checkVisible=g.setInterval(function(){a.$elem.is(":visible")&&(a.reload(),a.$elem.animate({opacity:1},200),g.clearInterval(a.checkVisible))},500)},wrapItems:function(){this.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>');this.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">');this.wrapperOuter=this.$elem.find(".owl-wrapper-outer");this.$elem.css("display","block")},
baseClass:function(){var a=this.$elem.hasClass(this.options.baseClass),b=this.$elem.hasClass(this.options.theme);a||this.$elem.addClass(this.options.baseClass);b||this.$elem.addClass(this.options.theme)},updateItems:function(){var a,b;if(!1===this.options.responsive)return!1;if(!0===this.options.singleItem)return this.options.items=this.orignalItems=1,this.options.itemsCustom=!1,this.options.itemsDesktop=!1,this.options.itemsDesktopSmall=!1,this.options.itemsTablet=!1,this.options.itemsTabletSmall=
!1,this.options.itemsMobile=!1;a=f(this.options.responsiveBaseWidth).width();a>(this.options.itemsDesktop[0]||this.orignalItems)&&(this.options.items=this.orignalItems);if(!1!==this.options.itemsCustom)for(this.options.itemsCustom.sort(function(a,b){return a[0]-b[0]}),b=0;b<this.options.itemsCustom.length;b+=1)this.options.itemsCustom[b][0]<=a&&(this.options.items=this.options.itemsCustom[b][1]);else a<=this.options.itemsDesktop[0]&&!1!==this.options.itemsDesktop&&(this.options.items=this.options.itemsDesktop[1]),
a<=this.options.itemsDesktopSmall[0]&&!1!==this.options.itemsDesktopSmall&&(this.options.items=this.options.itemsDesktopSmall[1]),a<=this.options.itemsTablet[0]&&!1!==this.options.itemsTablet&&(this.options.items=this.options.itemsTablet[1]),a<=this.options.itemsTabletSmall[0]&&!1!==this.options.itemsTabletSmall&&(this.options.items=this.options.itemsTabletSmall[1]),a<=this.options.itemsMobile[0]&&!1!==this.options.itemsMobile&&(this.options.items=this.options.itemsMobile[1]);this.options.items>this.itemsAmount&&
!0===this.options.itemsScaleUp&&(this.options.items=this.itemsAmount)},response:function(){var a=this,b,e;if(!0!==a.options.responsive)return!1;e=f(g).width();a.resizer=function(){f(g).width()!==e&&(!1!==a.options.autoPlay&&g.clearInterval(a.autoPlayInterval),g.clearTimeout(b),b=g.setTimeout(function(){e=f(g).width();a.updateVars()},a.options.responsiveRefreshRate))};f(g).resize(a.resizer)},updatePosition:function(){this.jumpTo(this.currentItem);!1!==this.options.autoPlay&&this.checkAp()},appendItemsSizes:function(){var a=
this,b=0,e=a.itemsAmount-a.options.items;a.$owlItems.each(function(c){var d=f(this);d.css({width:a.itemWidth}).data("owl-item",Number(c));if(0===c%a.options.items||c===e)c>e||(b+=1);d.data("owl-roundPages",b)})},appendWrapperSizes:function(){this.$owlWrapper.css({width:this.$owlItems.length*this.itemWidth*2,left:0});this.appendItemsSizes()},calculateAll:function(){this.calculateWidth();this.appendWrapperSizes();this.loops();this.max()},calculateWidth:function(){this.itemWidth=Math.round(this.$elem.width()/
this.options.items)},max:function(){var a=-1*(this.itemsAmount*this.itemWidth-this.options.items*this.itemWidth);this.options.items>this.itemsAmount?this.maximumPixels=a=this.maximumItem=0:(this.maximumItem=this.itemsAmount-this.options.items,this.maximumPixels=a);return a},min:function(){return 0},loops:function(){var a=0,b=0,e,c;this.positionsInArray=[0];this.pagesInArray=[];for(e=0;e<this.itemsAmount;e+=1)b+=this.itemWidth,this.positionsInArray.push(-b),!0===this.options.scrollPerPage&&(c=f(this.$owlItems[e]),
c=c.data("owl-roundPages"),c!==a&&(this.pagesInArray[a]=this.positionsInArray[e],a=c))},buildControls:function(){if(!0===this.options.navigation||!0===this.options.pagination)this.owlControls=f('<div class="owl-controls"/>').toggleClass("clickable",!this.browser.isTouch).appendTo(this.$elem);!0===this.options.pagination&&this.buildPagination();!0===this.options.navigation&&this.buildButtons()},buildButtons:function(){var a=this,b=f('<div class="owl-buttons"/>');a.owlControls.append(b);a.buttonPrev=
f("<div/>",{"class":"owl-prev",html:a.options.navigationText[0]||""});a.buttonNext=f("<div/>",{"class":"owl-next",html:a.options.navigationText[1]||""});b.append(a.buttonPrev).append(a.buttonNext);b.on("touchstart.owlControls mousedown.owlControls",'div[class^="owl"]',function(a){a.preventDefault()});b.on("touchend.owlControls mouseup.owlControls",'div[class^="owl"]',function(b){b.preventDefault();f(this).hasClass("owl-next")?a.next():a.prev()})},buildPagination:function(){var a=this;a.paginationWrapper=
f('<div class="owl-pagination"/>');a.owlControls.append(a.paginationWrapper);a.paginationWrapper.on("touchend.owlControls mouseup.owlControls",".owl-page",function(b){b.preventDefault();Number(f(this).data("owl-page"))!==a.currentItem&&a.goTo(Number(f(this).data("owl-page")),!0)})},updatePagination:function(){var a,b,e,c,d,g;if(!1===this.options.pagination)return!1;this.paginationWrapper.html("");a=0;b=this.itemsAmount-this.itemsAmount%this.options.items;for(c=0;c<this.itemsAmount;c+=1)0===c%this.options.items&&
(a+=1,b===c&&(e=this.itemsAmount-this.options.items),d=f("<div/>",{"class":"owl-page"}),g=f("<span></span>",{text:!0===this.options.paginationNumbers?a:"","class":!0===this.options.paginationNumbers?"owl-numbers":""}),d.append(g),d.data("owl-page",b===c?e:c),d.data("owl-roundPages",a),this.paginationWrapper.append(d));this.checkPagination()},checkPagination:function(){var a=this;if(!1===a.options.pagination)return!1;a.paginationWrapper.find(".owl-page").each(function(){f(this).data("owl-roundPages")===
f(a.$owlItems[a.currentItem]).data("owl-roundPages")&&(a.paginationWrapper.find(".owl-page").removeClass("active"),f(this).addClass("active"))})},checkNavigation:function(){if(!1===this.options.navigation)return!1;!1===this.options.rewindNav&&(0===this.currentItem&&0===this.maximumItem?(this.buttonPrev.addClass("disabled"),this.buttonNext.addClass("disabled")):0===this.currentItem&&0!==this.maximumItem?(this.buttonPrev.addClass("disabled"),this.buttonNext.removeClass("disabled")):this.currentItem===
this.maximumItem?(this.buttonPrev.removeClass("disabled"),this.buttonNext.addClass("disabled")):0!==this.currentItem&&this.currentItem!==this.maximumItem&&(this.buttonPrev.removeClass("disabled"),this.buttonNext.removeClass("disabled")))},updateControls:function(){this.updatePagination();this.checkNavigation();this.owlControls&&(this.options.items>=this.itemsAmount?this.owlControls.hide():this.owlControls.show())},destroyControls:function(){this.owlControls&&this.owlControls.remove()},next:function(a){if(this.isTransition)return!1;
this.currentItem+=!0===this.options.scrollPerPage?this.options.items:1;if(this.currentItem>this.maximumItem+(!0===this.options.scrollPerPage?this.options.items-1:0))if(!0===this.options.rewindNav)this.currentItem=0,a="rewind";else return this.currentItem=this.maximumItem,!1;this.goTo(this.currentItem,a)},prev:function(a){if(this.isTransition)return!1;this.currentItem=!0===this.options.scrollPerPage&&0<this.currentItem&&this.currentItem<this.options.items?0:this.currentItem-(!0===this.options.scrollPerPage?
this.options.items:1);if(0>this.currentItem)if(!0===this.options.rewindNav)this.currentItem=this.maximumItem,a="rewind";else return this.currentItem=0,!1;this.goTo(this.currentItem,a)},goTo:function(a,b,e){var c=this;if(c.isTransition)return!1;"function"===typeof c.options.beforeMove&&c.options.beforeMove.apply(this,[c.$elem]);a>=c.maximumItem?a=c.maximumItem:0>=a&&(a=0);c.currentItem=c.owl.currentItem=a;if(!1!==c.options.transitionStyle&&"drag"!==e&&1===c.options.items&&!0===c.browser.support3d)return c.swapSpeed(0),
!0===c.browser.support3d?c.transition3d(c.positionsInArray[a]):c.css2slide(c.positionsInArray[a],1),c.afterGo(),c.singleItemTransition(),!1;a=c.positionsInArray[a];!0===c.browser.support3d?(c.isCss3Finish=!1,!0===b?(c.swapSpeed("paginationSpeed"),g.setTimeout(function(){c.isCss3Finish=!0},c.options.paginationSpeed)):"rewind"===b?(c.swapSpeed(c.options.rewindSpeed),g.setTimeout(function(){c.isCss3Finish=!0},c.options.rewindSpeed)):(c.swapSpeed("slideSpeed"),g.setTimeout(function(){c.isCss3Finish=!0},
c.options.slideSpeed)),c.transition3d(a)):!0===b?c.css2slide(a,c.options.paginationSpeed):"rewind"===b?c.css2slide(a,c.options.rewindSpeed):c.css2slide(a,c.options.slideSpeed);c.afterGo()},jumpTo:function(a){"function"===typeof this.options.beforeMove&&this.options.beforeMove.apply(this,[this.$elem]);a>=this.maximumItem||-1===a?a=this.maximumItem:0>=a&&(a=0);this.swapSpeed(0);!0===this.browser.support3d?this.transition3d(this.positionsInArray[a]):this.css2slide(this.positionsInArray[a],1);this.currentItem=
this.owl.currentItem=a;this.afterGo()},afterGo:function(){this.prevArr.push(this.currentItem);this.prevItem=this.owl.prevItem=this.prevArr[this.prevArr.length-2];this.prevArr.shift(0);this.prevItem!==this.currentItem&&(this.checkPagination(),this.checkNavigation(),this.eachMoveUpdate(),!1!==this.options.autoPlay&&this.checkAp());"function"===typeof this.options.afterMove&&this.prevItem!==this.currentItem&&this.options.afterMove.apply(this,[this.$elem])},stop:function(){this.apStatus="stop";g.clearInterval(this.autoPlayInterval)},
checkAp:function(){"stop"!==this.apStatus&&this.play()},play:function(){var a=this;a.apStatus="play";if(!1===a.options.autoPlay)return!1;g.clearInterval(a.autoPlayInterval);a.autoPlayInterval=g.setInterval(function(){a.next(!0)},a.options.autoPlay)},swapSpeed:function(a){"slideSpeed"===a?this.$owlWrapper.css(this.addCssSpeed(this.options.slideSpeed)):"paginationSpeed"===a?this.$owlWrapper.css(this.addCssSpeed(this.options.paginationSpeed)):"string"!==typeof a&&this.$owlWrapper.css(this.addCssSpeed(a))},
addCssSpeed:function(a){return{"-webkit-transition":"all "+a+"ms ease","-moz-transition":"all "+a+"ms ease","-o-transition":"all "+a+"ms ease",transition:"all "+a+"ms ease"}},removeTransition:function(){return{"-webkit-transition":"","-moz-transition":"","-o-transition":"",transition:""}},doTranslate:function(a){return{"-webkit-transform":"translate3d("+a+"px, 0px, 0px)","-moz-transform":"translate3d("+a+"px, 0px, 0px)","-o-transform":"translate3d("+a+"px, 0px, 0px)","-ms-transform":"translate3d("+
a+"px, 0px, 0px)",transform:"translate3d("+a+"px, 0px,0px)"}},transition3d:function(a){this.$owlWrapper.css(this.doTranslate(a))},css2move:function(a){this.$owlWrapper.css({left:a})},css2slide:function(a,b){var e=this;e.isCssFinish=!1;e.$owlWrapper.stop(!0,!0).animate({left:a},{duration:b||e.options.slideSpeed,complete:function(){e.isCssFinish=!0}})},checkBrowser:function(){var a=k.createElement("div");a.style.cssText="  -moz-transform:translate3d(0px, 0px, 0px); -ms-transform:translate3d(0px, 0px, 0px); -o-transform:translate3d(0px, 0px, 0px); -webkit-transform:translate3d(0px, 0px, 0px); transform:translate3d(0px, 0px, 0px)";
a=a.style.cssText.match(/translate3d\(0px, 0px, 0px\)/g);this.browser={support3d:null!==a&&1===a.length,isTouch:"ontouchstart"in g||g.navigator.msMaxTouchPoints}},moveEvents:function(){if(!1!==this.options.mouseDrag||!1!==this.options.touchDrag)this.gestures(),this.disabledEvents()},eventTypes:function(){var a=["s","e","x"];this.ev_types={};!0===this.options.mouseDrag&&!0===this.options.touchDrag?a=["touchstart.owl mousedown.owl","touchmove.owl mousemove.owl","touchend.owl touchcancel.owl mouseup.owl"]:
!1===this.options.mouseDrag&&!0===this.options.touchDrag?a=["touchstart.owl","touchmove.owl","touchend.owl touchcancel.owl"]:!0===this.options.mouseDrag&&!1===this.options.touchDrag&&(a=["mousedown.owl","mousemove.owl","mouseup.owl"]);this.ev_types.start=a[0];this.ev_types.move=a[1];this.ev_types.end=a[2]},disabledEvents:function(){this.$elem.on("dragstart.owl",function(a){a.preventDefault()});this.$elem.on("mousedown.disableTextSelect",function(a){return f(a.target).is("input, textarea, select, option")})},
gestures:function(){function a(a){if(void 0!==a.touches)return{x:a.touches[0].pageX,y:a.touches[0].pageY};if(void 0===a.touches){if(void 0!==a.pageX)return{x:a.pageX,y:a.pageY};if(void 0===a.pageX)return{x:a.clientX,y:a.clientY}}}function b(a){"on"===a?(f(k).on(d.ev_types.move,e),f(k).on(d.ev_types.end,c)):"off"===a&&(f(k).off(d.ev_types.move),f(k).off(d.ev_types.end))}function e(b){b=b.originalEvent||b||g.event;d.newPosX=a(b).x-h.offsetX;d.newPosY=a(b).y-h.offsetY;d.newRelativeX=d.newPosX-h.relativePos;
"function"===typeof d.options.startDragging&&!0!==h.dragging&&0!==d.newRelativeX&&(h.dragging=!0,d.options.startDragging.apply(d,[d.$elem]));(8<d.newRelativeX||-8>d.newRelativeX)&&!0===d.browser.isTouch&&(void 0!==b.preventDefault?b.preventDefault():b.returnValue=!1,h.sliding=!0);(10<d.newPosY||-10>d.newPosY)&&!1===h.sliding&&f(k).off("touchmove.owl");d.newPosX=Math.max(Math.min(d.newPosX,d.newRelativeX/5),d.maximumPixels+d.newRelativeX/5);!0===d.browser.support3d?d.transition3d(d.newPosX):d.css2move(d.newPosX)}
function c(a){a=a.originalEvent||a||g.event;var c;a.target=a.target||a.srcElement;h.dragging=!1;!0!==d.browser.isTouch&&d.$owlWrapper.removeClass("grabbing");d.dragDirection=0>d.newRelativeX?d.owl.dragDirection="left":d.owl.dragDirection="right";0!==d.newRelativeX&&(c=d.getNewPosition(),d.goTo(c,!1,"drag"),h.targetElement===a.target&&!0!==d.browser.isTouch&&(f(a.target).on("click.disable",function(a){a.stopImmediatePropagation();a.stopPropagation();a.preventDefault();f(a.target).off("click.disable")}),
a=f._data(a.target,"events").click,c=a.pop(),a.splice(0,0,c)));b("off")}var d=this,h={offsetX:0,offsetY:0,baseElWidth:0,relativePos:0,position:null,minSwipe:null,maxSwipe:null,sliding:null,dargging:null,targetElement:null};d.isCssFinish=!0;d.$elem.on(d.ev_types.start,".owl-wrapper",function(c){c=c.originalEvent||c||g.event;var e;if(3===c.which)return!1;if(!(d.itemsAmount<=d.options.items)){if(!1===d.isCssFinish&&!d.options.dragBeforeAnimFinish||!1===d.isCss3Finish&&!d.options.dragBeforeAnimFinish)return!1;
!1!==d.options.autoPlay&&g.clearInterval(d.autoPlayInterval);!0===d.browser.isTouch||d.$owlWrapper.hasClass("grabbing")||d.$owlWrapper.addClass("grabbing");d.newPosX=0;d.newRelativeX=0;f(this).css(d.removeTransition());e=f(this).position();h.relativePos=e.left;h.offsetX=a(c).x-e.left;h.offsetY=a(c).y-e.top;b("on");h.sliding=!1;h.targetElement=c.target||c.srcElement}})},getNewPosition:function(){var a=this.closestItem();a>this.maximumItem?a=this.currentItem=this.maximumItem:0<=this.newPosX&&(this.currentItem=
a=0);return a},closestItem:function(){var a=this,b=!0===a.options.scrollPerPage?a.pagesInArray:a.positionsInArray,e=a.newPosX,c=null;f.each(b,function(d,g){e-a.itemWidth/20>b[d+1]&&e-a.itemWidth/20<g&&"left"===a.moveDirection()?(c=g,a.currentItem=!0===a.options.scrollPerPage?f.inArray(c,a.positionsInArray):d):e+a.itemWidth/20<g&&e+a.itemWidth/20>(b[d+1]||b[d]-a.itemWidth)&&"right"===a.moveDirection()&&(!0===a.options.scrollPerPage?(c=b[d+1]||b[b.length-1],a.currentItem=f.inArray(c,a.positionsInArray)):
(c=b[d+1],a.currentItem=d+1))});return a.currentItem},moveDirection:function(){var a;0>this.newRelativeX?(a="right",this.playDirection="next"):(a="left",this.playDirection="prev");return a},customEvents:function(){var a=this;a.$elem.on("owl.next",function(){a.next()});a.$elem.on("owl.prev",function(){a.prev()});a.$elem.on("owl.play",function(b,e){a.options.autoPlay=e;a.play();a.hoverStatus="play"});a.$elem.on("owl.stop",function(){a.stop();a.hoverStatus="stop"});a.$elem.on("owl.goTo",function(b,e){a.goTo(e)});
a.$elem.on("owl.jumpTo",function(b,e){a.jumpTo(e)})},stopOnHover:function(){var a=this;!0===a.options.stopOnHover&&!0!==a.browser.isTouch&&!1!==a.options.autoPlay&&(a.$elem.on("mouseover",function(){a.stop()}),a.$elem.on("mouseout",function(){"stop"!==a.hoverStatus&&a.play()}))},lazyLoad:function(){var a,b,e,c,d;if(!1===this.options.lazyLoad)return!1;for(a=0;a<this.itemsAmount;a+=1)b=f(this.$owlItems[a]),"loaded"!==b.data("owl-loaded")&&(e=b.data("owl-item"),c=b.find(".lazyOwl"),"string"!==typeof c.data("src")?
b.data("owl-loaded","loaded"):(void 0===b.data("owl-loaded")&&(c.hide(),b.addClass("loading").data("owl-loaded","checked")),(d=!0===this.options.lazyFollow?e>=this.currentItem:!0)&&e<this.currentItem+this.options.items&&c.length&&this.lazyPreload(b,c)))},lazyPreload:function(a,b){function e(){a.data("owl-loaded","loaded").removeClass("loading");b.removeAttr("data-src");"fade"===d.options.lazyEffect?b.fadeIn(400):b.show();"function"===typeof d.options.afterLazyLoad&&d.options.afterLazyLoad.apply(this,
[d.$elem])}function c(){f+=1;d.completeImg(b.get(0))||!0===k?e():100>=f?g.setTimeout(c,100):e()}var d=this,f=0,k;"DIV"===b.prop("tagName")?(b.css("background-image","url("+b.data("src")+")"),k=!0):b[0].src=b.data("src");c()},autoHeight:function(){function a(){var a=f(e.$owlItems[e.currentItem]).height();e.wrapperOuter.css("height",a+"px");e.wrapperOuter.hasClass("autoHeight")||g.setTimeout(function(){e.wrapperOuter.addClass("autoHeight")},0)}function b(){d+=1;e.completeImg(c.get(0))?a():100>=d?g.setTimeout(b,
100):e.wrapperOuter.css("height","")}var e=this,c=f(e.$owlItems[e.currentItem]).find("img"),d;void 0!==c.get(0)?(d=0,b()):a()},completeImg:function(a){return!a.complete||"undefined"!==typeof a.naturalWidth&&0===a.naturalWidth?!1:!0},onVisibleItems:function(){var a;!0===this.options.addClassActive&&this.$owlItems.removeClass("active");this.visibleItems=[];for(a=this.currentItem;a<this.currentItem+this.options.items;a+=1)this.visibleItems.push(a),!0===this.options.addClassActive&&f(this.$owlItems[a]).addClass("active");
this.owl.visibleItems=this.visibleItems},transitionTypes:function(a){this.outClass="owl-"+a+"-out";this.inClass="owl-"+a+"-in"},singleItemTransition:function(){var a=this,b=a.outClass,e=a.inClass,c=a.$owlItems.eq(a.currentItem),d=a.$owlItems.eq(a.prevItem),f=Math.abs(a.positionsInArray[a.currentItem])+a.positionsInArray[a.prevItem],g=Math.abs(a.positionsInArray[a.currentItem])+a.itemWidth/2;a.isTransition=!0;a.$owlWrapper.addClass("owl-origin").css({"-webkit-transform-origin":g+"px","-moz-perspective-origin":g+
"px","perspective-origin":g+"px"});d.css({position:"relative",left:f+"px"}).addClass(b).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend",function(){a.endPrev=!0;d.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");a.clearTransStyle(d,b)});c.addClass(e).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend",function(){a.endCurrent=!0;c.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");a.clearTransStyle(c,e)})},clearTransStyle:function(a,
b){a.css({position:"",left:""}).removeClass(b);this.endPrev&&this.endCurrent&&(this.$owlWrapper.removeClass("owl-origin"),this.isTransition=this.endCurrent=this.endPrev=!1)},owlStatus:function(){this.owl={userOptions:this.userOptions,baseElement:this.$elem,userItems:this.$userItems,owlItems:this.$owlItems,currentItem:this.currentItem,prevItem:this.prevItem,visibleItems:this.visibleItems,isTouch:this.browser.isTouch,browser:this.browser,dragDirection:this.dragDirection}},clearEvents:function(){this.$elem.off(".owl owl mousedown.disableTextSelect");
f(k).off(".owl owl");f(g).off("resize",this.resizer)},unWrap:function(){0!==this.$elem.children().length&&(this.$owlWrapper.unwrap(),this.$userItems.unwrap().unwrap(),this.owlControls&&this.owlControls.remove());this.clearEvents();this.$elem.attr("style",this.$elem.data("owl-originalStyles")||"").attr("class",this.$elem.data("owl-originalClasses"))},destroy:function(){this.stop();g.clearInterval(this.checkVisible);this.unWrap();this.$elem.removeData()},reinit:function(a){a=f.extend({},this.userOptions,
a);this.unWrap();this.init(a,this.$elem)},addItem:function(a,b){var e;if(!a)return!1;if(0===this.$elem.children().length)return this.$elem.append(a),this.setVars(),!1;this.unWrap();e=void 0===b||-1===b?-1:b;e>=this.$userItems.length||-1===e?this.$userItems.eq(-1).after(a):this.$userItems.eq(e).before(a);this.setVars()},removeItem:function(a){if(0===this.$elem.children().length)return!1;a=void 0===a||-1===a?-1:a;this.unWrap();this.$userItems.eq(a).remove();this.setVars()}};f.fn.owlCarousel=function(a){return this.each(function(){if(!0===
f(this).data("owl-init"))return!1;f(this).data("owl-init",!0);var b=Object.create(l);b.init(a,this);f.data(this,"owlCarousel",b)})};f.fn.owlCarousel.options={items:5,itemsCustom:!1,itemsDesktop:[1199,4],itemsDesktopSmall:[979,3],itemsTablet:[768,2],itemsTabletSmall:!1,itemsMobile:[479,1],singleItem:!1,itemsScaleUp:!1,slideSpeed:200,paginationSpeed:800,rewindSpeed:1E3,autoPlay:!1,stopOnHover:!1,navigation:!1,navigationText:["prev","next"],rewindNav:!0,scrollPerPage:!1,pagination:!0,paginationNumbers:!1,
responsive:!0,responsiveRefreshRate:200,responsiveBaseWidth:g,baseClass:"owl-carousel",theme:"owl-theme",lazyLoad:!1,lazyFollow:!0,lazyEffect:"fade",autoHeight:!1,jsonPath:!1,jsonSuccess:!1,dragBeforeAnimFinish:!0,mouseDrag:!0,touchDrag:!0,addClassActive:!1,transitionStyle:!1,beforeUpdate:!1,afterUpdate:!1,beforeInit:!1,afterInit:!1,beforeMove:!1,afterMove:!1,afterAction:!1,startDragging:!1,afterLazyLoad:!1}})(jQuery,window,document);
///#source 1 1 /JavaScript-Mvc-framework/libs/FrontEnd/jquery.number.js
/**
 * jQuery number plug-in 2.1.0
 * Copyright 2012, Digital Fusion
 * Licensed under the MIT license.
 * http://opensource.teamdf.com/license/
 *
 * A jQuery plugin which implements a permutation of phpjs.org's number_format to provide
 * simple number formatting, insertion, and as-you-type masking of a number.
 * 
 * @author	Sam Sehnert
 * @docs	http://www.teamdf.com/web/jquery-number-format-redux/196/
 */
(function($){
	
	/**
	 * Method for selecting a range of characters in an input/textarea.
	 *
	 * @param int rangeStart			: Where we want the selection to start.
	 * @param int rangeEnd				: Where we want the selection to end.
	 *
	 * @return void;
	 */
	function setSelectionRange( rangeStart, rangeEnd )
	{
		// Check which way we need to define the text range.
		if( this.createTextRange )
		{
			var range = this.createTextRange();
				range.collapse( true );
				range.moveStart( 'character',	rangeStart );
				range.moveEnd( 'character',		rangeEnd-rangeStart );
				range.select();
		}
		
		// Alternate setSelectionRange method for supporting browsers.
		else if( this.setSelectionRange )
		{
			this.focus();
			this.setSelectionRange( rangeStart, rangeEnd );
		}
	}
	
	/**
	 * Get the selection position for the given part.
	 * 
	 * @param string part			: Options, 'Start' or 'End'. The selection position to get.
	 *
	 * @return int : The index position of the selection part.
	 */
	function getSelection( part )
	{
		var pos	= this.value.length;
		
		// Work out the selection part.
		part = ( part.toLowerCase() == 'start' ? 'Start' : 'End' );
		
		if( document.selection ){
			// The current selection
			var range = document.selection.createRange(), stored_range, selectionStart, selectionEnd;
			// We'll use this as a 'dummy'
			stored_range = range.duplicate();
			// Select all text
			//stored_range.moveToElementText( this );
			stored_range.expand('textedit');
			// Now move 'dummy' end point to end point of original range
			stored_range.setEndPoint( 'EndToEnd', range );
			// Now we can calculate start and end points
			selectionStart = stored_range.text.length - range.text.length;
			selectionEnd = selectionStart + range.text.length;
			return part == 'Start' ? selectionStart : selectionEnd;
		}
		
		else if(typeof(this['selection'+part])!="undefined")
		{
		 	pos = this['selection'+part];
		}
		return pos;
	}
	
	/**
	 * Substitutions for keydown keycodes.
	 * Allows conversion from e.which to ascii characters.
	 */
	var _keydown = {
		codes : {
			188 : 44,
			109 : 45,
			190 : 46,
			191 : 47,
			192 : 96,
			220 : 92,
			222 : 39,
			221 : 93,
			219 : 91,
			173 : 45,
			187 : 61, //IE Key codes
			186 : 59, //IE Key codes
			189 : 45, //IE Key codes
			110 : 46  //IE Key codes
        },
        shifts : {
			96 : "~",
			49 : "!",
			50 : "@",
			51 : "#",
			52 : "$",
			53 : "%",
			54 : "^",
			55 : "&",
			56 : "*",
			57 : "(",
			48 : ")",
			45 : "_",
			61 : "+",
			91 : "{",
			93 : "}",
			92 : "|",
			59 : ":",
			39 : "\"",
			44 : "<",
			46 : ">",
			47 : "?"
        }
    };
	
	/**
	 * jQuery number formatter plugin. This will allow you to format numbers on an element.
	 *
	 * @params proxied for format_number method.
	 *
	 * @return : The jQuery collection the method was called with.
	 */
	$.fn.number = function( number, decimals, dec_point, thousands_sep ){
	    
	    // Enter the default thousands separator, and the decimal placeholder.
	    thousands_sep	= (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
	    dec_point		= (typeof dec_point === 'undefined') ? '.' : dec_point;
	    decimals		= (typeof decimals === 'undefined' ) ? 0 : decimals;
	    	    
	    // Work out the unicode character for the decimal placeholder.
	    var u_dec			= ('\\u'+('0000'+(dec_point.charCodeAt(0).toString(16))).slice(-4)),
	    	regex_dec_num	= new RegExp('[^'+u_dec+'0-9]','g'),
	    	regex_dec		= new RegExp(u_dec,'g');
	    
	    // If we've specified to take the number from the target element,
	    // we loop over the collection, and get the number.
	    if( number === true )
	    {
	    	// If this element is a number, then we add a keyup
	    	if( this.is('input:text') )
	    	{
	    		// Return the jquery collection.
	    		return this.on({
	    			
	    			/**
	    			 * Handles keyup events, re-formatting numbers.
	    			 *
	    			 * @param object e			: the keyup event object.s
	    			 *
	    			 * @return void;
	    			 */
	    			'keydown.format' : function(e){
	    				
	    				// Define variables used in the code below.
	    				var $this	= $(this),
	    					data	= $this.data('numFormat'),
	    					code	= (e.keyCode ? e.keyCode : e.which),
							chara	= '', //unescape(e.originalEvent.keyIdentifier.replace('U+','%u')),
	    					start	= getSelection.apply(this,['start']),
	    					end		= getSelection.apply(this,['end']),
	    					val		= '',
	    					setPos	= false;
	    				
	    				// Webkit (Chrome & Safari) on windows screws up the keyIdentifier detection
	    				// for numpad characters. I've disabled this for now, because while keyCode munging
	    				// below is hackish and ugly, it actually works cross browser & platform.
	    				
//	    				if( typeof e.originalEvent.keyIdentifier !== 'undefined' )
//	    				{
//	    					chara = unescape(e.originalEvent.keyIdentifier.replace('U+','%u'));
//	    				}
//	    				else
//	    				{
	    					if (_keydown.codes.hasOwnProperty(code)) {
					            code = _keydown.codes[code];
					        }
					        if (!e.shiftKey && (code >= 65 && code <= 90)){
					        	code += 32;
					        } else if (!e.shiftKey && (code >= 69 && code <= 105)){
					        	code -= 48;
					        } else if (e.shiftKey && _keydown.shifts.hasOwnProperty(code)){
					            //get shifted keyCode value
					            chara = _keydown.shifts[code];
					        }
					        
					        if( chara == '' ) chara = String.fromCharCode(code);
//	    				}
	    				
	    				// Stop executing if the user didn't type a number key, a decimal character, or backspace.
	    				if( code !== 8 && chara != dec_point && !chara.match(/[0-9]/) )
	    				{
	    					// We need the original keycode now...
	    					var key = (e.keyCode ? e.keyCode : e.which);
	    					if( // Allow control keys to go through... (delete, etc)
	    						key == 46 || key == 8 || key == 9 || key == 27 || key == 13 || 
	    						// Allow: Ctrl+A, Ctrl+R
	    						( (key == 65 || key == 82 ) && ( e.ctrlKey || e.metaKey ) === true ) || 
	    						// Allow: home, end, left, right
	    						( (key >= 35 && key <= 39) )
							){
								return;
							}
							// But prevent all other keys.
							e.preventDefault();
							return false;
	    				}
	    				
	    				//console.log('Continuing on: ', code, chara);
	    				
	    				// The whole lot has been selected, or if the field is empty, and the character
	    				if( ( start == 0 && end == this.value.length || $this.val() == 0 ) && !e.metaKey && !e.ctrlKey && !e.altKey && chara.length === 1 && chara != 0 )
	    				{
	    					// Blank out the field, but only if the data object has already been instanciated.
    						start = end = 1;
    						this.value = '';
    						
    						// Reset the cursor position.
	    					data.init = (decimals>0?-1:0);
	    					data.c = (decimals>0?-(decimals+1):0);
	    					setSelectionRange.apply(this, [0,0]);
	    				}
	    				
	    				// Otherwise, we need to reset the caret position
	    				// based on the users selection.
	    				else
	    				{
	    					data.c = end-this.value.length;
	    				}
	    				
	    				// If the start position is before the decimal point,
	    				// and the user has typed a decimal point, we need to move the caret
	    				// past the decimal place.
	    				if( decimals > 0 && chara == dec_point && start == this.value.length-decimals-1 )
	    				{
	    					data.c++;
	    					data.init = Math.max(0,data.init);
	    					e.preventDefault();
	    					
	    					// Set the selection position.
	    					setPos = this.value.length+data.c;
	    				}
	    				
	    				// If the user is just typing the decimal place,
	    				// we simply ignore it.
	    				else if( chara == dec_point )
	    				{
	    					data.init = Math.max(0,data.init);
	    					e.preventDefault();
	    				}
	    				
	    				// If hitting the delete key, and the cursor is behind a decimal place,
	    				// we simply move the cursor to the other side of the decimal place.
	    				else if( decimals > 0 && code == 8 && start == this.value.length-decimals )
	    				{
	    					e.preventDefault();
	    					data.c--;
	    					
	    					// Set the selection position.
	    					setPos = this.value.length+data.c;
	    				}
	    				
	    				// If hitting the delete key, and the cursor is to the right of the decimal
	    				// (but not directly to the right) we replace the character preceeding the
	    				// caret with a 0.
	    				else if( decimals > 0 && code == 8 && start > this.value.length-decimals )
	    				{
	    					if( this.value === '' ) return;
	    					
	    					// If the character preceeding is not already a 0,
	    					// replace it with one.
	    					if( this.value.slice(start-1, start) != '0' )
	    					{
	    						val = this.value.slice(0, start-1) + '0' + this.value.slice(start);
	    						$this.val(val.replace(regex_dec_num,'').replace(regex_dec,dec_point));
	    					}
	    					
	    					e.preventDefault();
	    					data.c--;
	    					
	    					// Set the selection position.
	    					setPos = this.value.length+data.c;
	    				}
	    				
	    				// If the delete key was pressed, and the character immediately
	    				// before the caret is a thousands_separator character, simply
	    				// step over it.
	    				else if( code == 8 && this.value.slice(start-1, start) == thousands_sep )
	    				{
	    					e.preventDefault();
	    					data.c--;
	    					
	    					// Set the selection position.
	    					setPos = this.value.length+data.c;
	    				}
	    				
	    				// If the caret is to the right of the decimal place, and the user is entering a
	    				// number, remove the following character before putting in the new one. 
	    				else if(
	    					decimals > 0 &&
	    					start == end &&
	    					this.value.length > decimals+1 &&
	    					start > this.value.length-decimals-1 && isFinite(+chara) &&
		    				!e.metaKey && !e.ctrlKey && !e.altKey && chara.length === 1
	    				)
	    				{
	    					// If the character preceeding is not already a 0,
	    					// replace it with one.
	    					if( end === this.value.length )
	    					{
	    						val = this.value.slice(0, start-1);
	    					}
	    					else
	    					{
	    						val = this.value.slice(0, start)+this.value.slice(start+1);
	    					}
	    					
	    					// Reset the position.
	    					this.value = val;
	    					setPos = start;
	    				}
	    				
	    				// If we need to re-position the characters.
	    				if( setPos !== false )
	    				{
	    					//console.log('Setpos keydown: ', setPos );
	    					setSelectionRange.apply(this, [setPos, setPos]);
	    				}
	    				
	    				// Store the data on the element.
	    				$this.data('numFormat', data);
	    				
	    			},
	    			
	    			/**
	    			 * Handles keyup events, re-formatting numbers.
	    			 *
	    			 * @param object e			: the keyup event object.s
	    			 *
	    			 * @return void;
	    			 */
	    			'keyup.format' : function(e){
	    				
	    				// Store these variables for use below.
	    				var $this	= $(this),
	    					data	= $this.data('numFormat'),
	    					code	= (e.keyCode ? e.keyCode : e.which),
	    					start	= getSelection.apply(this,['start']),
	    					setPos;
	    				    				    			
	    				// Stop executing if the user didn't type a number key, a decimal, or a comma.
	    				if( this.value === '' || (code < 48 || code > 57) && (code < 96 || code > 105 ) && code !== 8 ) return;
	    				
	    				// Re-format the textarea.
	    				$this.val($this.val());
	    				
	    				if( decimals > 0 )
	    				{
		    				// If we haven't marked this item as 'initialised'
		    				// then do so now. It means we should place the caret just 
		    				// before the decimal. This will never be un-initialised before
		    				// the decimal character itself is entered.
		    				if( data.init < 1 )
		    				{
		    					start		= this.value.length-decimals-( data.init < 0 ? 1 : 0 );
		    					data.c		= start-this.value.length;
		    					data.init	= 1;
		    					
		    					$this.data('numFormat', data);
		    				}
		    				
		    				// Increase the cursor position if the caret is to the right
		    				// of the decimal place, and the character pressed isn't the delete key.
		    				else if( start > this.value.length-decimals && code != 8 )
		    				{
		    					data.c++;
		    					
		    					// Store the data, now that it's changed.
		    					$this.data('numFormat', data);
		    				}
	    				}
	    				
	    				//console.log( 'Setting pos: ', start, decimals, this.value.length + data.c, this.value.length, data.c );
	    				
	    				// Set the selection position.
	    				setPos = this.value.length+data.c;
	    				setSelectionRange.apply(this, [setPos, setPos]);
	    			},
	    			
	    			/**
	    			 * Reformat when pasting into the field.
	    			 *
	    			 * @param object e 		: jQuery event object.
	    			 *
	    			 * @return false : prevent default action.
	    			 */
	    			'paste.format' : function(e){
	    				
	    				// Defint $this. It's used twice!.
	    				var $this		= $(this),
	    					original	= e.originalEvent,
	    					val		= null;
						
						// Get the text content stream.
						if (window.clipboardData && window.clipboardData.getData) { // IE
							val = window.clipboardData.getData('Text');
						} else if (original.clipboardData && original.clipboardData.getData) {
							val = original.clipboardData.getData('text/plain');
						}
						
	    				// Do the reformat operation.
	    				$this.val(val);
	    				
	    				// Stop the actual content from being pasted.
	    				e.preventDefault();
	    				return false;
	    			}
	    		
	    		})
	    		
	    		// Loop each element (which isn't blank) and do the format.
    			.each(function(){
    			
    				var $this = $(this).data('numFormat',{
    					c				: -(decimals+1),
    					decimals		: decimals,
    					thousands_sep	: thousands_sep,
    					dec_point		: dec_point,
    					regex_dec_num	: regex_dec_num,
    					regex_dec		: regex_dec,
    					init			: false
    				});
    				
    				// Return if the element is empty.
    				if( this.value === '' ) return;
    				
    				// Otherwise... format!!
    				$this.val($this.val());
    			});
	    	}
	    	else
	    	{
		    	// return the collection.
		    	return this.each(function(){
		    		var $this = $(this), num = +$this.text().replace(regex_dec_num,'').replace(regex_dec,'.');
		    		$this.number( !isFinite(num) ? 0 : +num, decimals, dec_point, thousands_sep );
		    	});
	    	}
	    }
	    
	    // Add this number to the element as text.
	    return this.text( $.number.apply(window,arguments) );
	};
	
	//
	// Create .val() hooks to get and set formatted numbers in inputs.
	//
	
	// We check if any hooks already exist, and cache
	// them in case we need to re-use them later on.
	var origHookGet = null, origHookSet = null;
	 
	// Check if a text valHook already exists.
	if( $.valHooks.text )
	{
	    // Preserve the original valhook function
	    // we'll call this for values we're not 
	    // explicitly handling.
	    origHookGet = $.valHooks.text.get;
	    origHookSet = $.valHooks.text.set;
	}
	else
	{
	    // Define an object for the new valhook.
	    $.valHooks.text = {};
	} 
	
	/**
	 * Define the valHook to return normalised field data against an input
	 * which has been tagged by the number formatter.
	 *
	 * @param object el			: The raw DOM element that we're getting the value from.
	 *
	 * @return mixed : Returns the value that was written to the element as a
	 *				   javascript number, or undefined to let jQuery handle it normally.
	 */
	$.valHooks.text.get = function( el ){
		
		// Get the element, and its data.
		var $this	= $(el), num,
			data	= $this.data('numFormat');
		
        // Does this element have our data field?
        if( !data )
        {
            // Check if the valhook function already existed
            if( $.isFunction( origHookGet ) )
            {
                // There was, so go ahead and call it
                return origHookGet(el);
            }
            else
            {
                // No previous function, return undefined to have jQuery
                // take care of retrieving the value
                return undefined;
			}
		}
		else
		{			
			// Remove formatting, and return as number.
			if( el.value === '' ) return '';
			
			// Convert to a number.
			num = +(el.value
				.replace( data.regex_dec_num, '' )
				.replace( data.regex_dec, '.' ));
			
			// If we've got a finite number, return it.
			// Otherwise, simply return 0.
			// Return as a string... thats what we're
			// used to with .val()
			return ''+( isFinite( num ) ? num : 0 );
		}
	};
	
	/**
	 * A valhook which formats a number when run against an input
	 * which has been tagged by the number formatter.
	 *
	 * @param object el		: The raw DOM element (input element).
	 * @param float			: The number to set into the value field.
	 *
	 * @return mixed : Returns the value that was written to the element,
	 *				   or undefined to let jQuery handle it normally. 
	 */
	$.valHooks.text.set = function( el, val )
	{
		// Get the element, and its data.
		var $this	= $(el),
			data	= $this.data('numFormat');
		
		// Does this element have our data field?
		if( !data )
		{
		    // Check if the valhook function already existed
		    if( $.isFunction( origHookSet ) )
		    {
		        // There was, so go ahead and call it
		        return origHookSet(el,val);
		    }
		    else
		    {
		        // No previous function, return undefined to have jQuery
		        // take care of retrieving the value
		        return undefined;
			}
		}
		else
		{
			return el.value = $.number( val, data.decimals, data.dec_point, data.thousands_sep )
		}
	};
	
	/**
	 * The (modified) excellent number formatting method from PHPJS.org.
	 * http://phpjs.org/functions/number_format/
	 *
	 * @modified by Sam Sehnert (teamdf.com)
	 *	- don't redefine dec_point, thousands_sep... just overwrite with defaults.
	 *	- don't redefine decimals, just overwrite as numeric.
	 *	- Generate regex for normalizing pre-formatted numbers.
	 *
	 * @param float number			: The number you wish to format, or TRUE to use the text contents
	 *								  of the element as the number. Please note that this won't work for
	 *								  elements which have child nodes with text content.
	 * @param int decimals			: The number of decimal places that should be displayed. Defaults to 0.
	 * @param string dec_point		: The character to use as a decimal point. Defaults to '.'.
	 * @param string thousands_sep	: The character to use as a thousands separator. Defaults to ','.
	 *
	 * @return string : The formatted number as a string.
	 */
	$.number = function( number, decimals, dec_point, thousands_sep ){
		
		// Set the default values here, instead so we can use them in the replace below.
		thousands_sep	= (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
		dec_point		= (typeof dec_point === 'undefined') ? '.' : dec_point;
		decimals		= !isFinite(+decimals) ? 0 : Math.abs(decimals);
		
		// Work out the unicode representation for the decimal place.	
		var u_dec = ('\\u'+('0000'+(dec_point.charCodeAt(0).toString(16))).slice(-4));
		
		// Fix the number, so that it's an actual number.
		number = (number + '')
			.replace(new RegExp(u_dec,'g'),'.')
			.replace(new RegExp('[^0-9+\-Ee.]','g'),'');
		
		var n = !isFinite(+number) ? 0 : +number,
		    s = '',
		    toFixedFix = function (n, decimals) {
		        var k = Math.pow(10, decimals);
		        return '' + Math.round(n * k) / k;
		    };
		
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (decimals ? toFixedFix(n, decimals) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
		    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousands_sep);
		}
		if ((s[1] || '').length < decimals) {
		    s[1] = s[1] || '';
		    s[1] += new Array(decimals - s[1].length + 1).join('0');
		}
		return s.join(dec_point);
	}
	
})(jQuery);

///#source 1 1 /JavaScript-Mvc-framework/libs/DevOrgPlugins/developers-organism.component.js
/// <reference path="faster-jQuery.js" />
/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../jquery-2.1.3.intellisense.js" />
/// <reference path="../bootstrap.min.js" />
/// <reference path="../bootstrap-table.js" />
/// <reference path="../jquery.validate.js" />
/// <reference path="../modernizr-2.8.3.js" />
/// <reference path="../star-rating.js" />
/// <reference path="../moment.js" />
/// <reference path="../underscore.js" />
/// <reference path="developers-organism.component.js" />


/*
* Version 2.2
* Written by Alim Ul Karim
* Developers Organism
* https://www.facebook.com/DevelopersOrganism
* mailto:info@developers-organism.com
*/


$.fn.extend({
    // jQuery element get all classes
    getAllClasses: function () {
        if (this.length === 1) {
            return this.attr("class").split(/\s+/);
        }
        return null;
    }
});


$.devOrg = {

    genericComboClass: "devCombo",

    // get all the classes from an jQuery element
    getAllClasses: function (jQueryHtmlElement) {
        return jQueryHtmlElement.getAllClasses();
    },

    getClassesExcept: function (allClassesArray, exceptClassesArray) {
        /// <summary>
        /// allClassesArray = ['a','b','c'] , exceptClassesArray=['b','c'], results=['a']
        /// </summary>
        /// <param name="allClassesArray"></param>
        /// <param name="exceptClassesArray"></param>
        "use strict";
        if (allClassesArray === null || allClassesArray === undefined) {
            return [];
        }

        if (exceptClassesArray === null || exceptClassesArray === undefined) {
            return allClassesArray;
        }
        var len = allClassesArray.length;
        var results = [];
        for (var i = 0; i < len; i++) {
            if (exceptClassesArray.indexOf(allClassesArray[i]) === -1) {
                // not found
                results.push(allClassesArray[i]);
            }
        }
        return results;
    },
    countryFlagRefresh: function (countrySelector, dropDownItemsSelector, dropDownBtnSelector) {
        /// <summary>
        /// all Selectors are jQuery Selector Text  only.
        /// selectpicker will be called inside function, no need to call outside.
        /// </summary>
        /// <param name="countrySelector">Select country and make it selectpicker()</param>
        /// <param name="dropDownItemsSelector"></param>
        /// <param name="dropDownBtnSelector"></param>
        "use strict";
        var countryBox = $(countrySelector).selectpicker(); // only select a select element then apply the custom bootstrap selector
        var dropDownItems = $(dropDownItemsSelector); // getting generated dropdown items from the custom bootstrap selector
        var dropDownBtn = $(dropDownBtnSelector); // generated new button from the selectpicker option
        var skippingClassesAnchor = ["flag-country-combo", "flag"];
        var skippingClassesForBtn = ["btn", "dropdown-toggle", "selectpicker", "btn-success", "flag-combo"];
        // console.log(dropDownItems.length);
        countryBox.change(function (e) {
            var listItem = dropDownItems.find("li.selected");
            var anchorItem = listItem.find("a");
            var listOfAllAnchorClasses = anchorItem.getAllClasses();
            var listOfAllClassesdropDownBtn = dropDownBtn.getAllClasses();
            var flagClass = $.devOrg.getClassesExcept(listOfAllAnchorClasses, skippingClassesAnchor);
            var btnFlagClass = $.devOrg.getClassesExcept(listOfAllClassesdropDownBtn, skippingClassesForBtn);
            for (var i = 0; i < btnFlagClass.length; i++) {
                dropDownBtn.removeClass(btnFlagClass[i]);
            }
            dropDownBtn.addClass("fc-" + flagClass[0]);
        });
    },
    countryRelatedToPhone: function (countrySelector, dropDownItemsSelector, dropDownBtnSelector, phoneNumberInputSelector) {
        /// <summary>
        /// countryFlagRefresh must be called first or selectpicker must be called first
        /// all Selectors are jQuery Selector Text  only.
        /// </summary>
        /// <param name="countrySelector"></param>
        /// <param name="dropDownItemsSelector"></param>
        /// <param name="dropDownBtnSelector"></param>
        /// <param name="phoneNumberInputSelector"></param>
        "use strict";
        var countryBox = $(countrySelector);
        var dropDownItems = $(dropDownItemsSelector);
        //var dropDownBtn = $(dropDownBtnSelector);
        var phoneNumberBox = $(phoneNumberInputSelector);
        var previousCallingCode = "";

        function selectChangeState() {
            // console.log("executed");
            var listItem = dropDownItems.find("li.selected");
            var spanText = listItem.find("a > span").text().toString();
            var newCallingCode = $.devOrg.subStringMod(spanText, "(", ")");
            var getWrittenPhoneNumber = phoneNumberBox.val();
            // console.log(listItem);
            newCallingCode = $.devOrg.replaceStartsWith(newCallingCode, "+", "");
            if ((!_.isEmpty(getWrittenPhoneNumber) && !_.isEmpty(previousCallingCode))
                && $.devOrg.isStartsWith(getWrittenPhoneNumber, previousCallingCode)) {
                getWrittenPhoneNumber = $.devOrg.replaceStartsWith(getWrittenPhoneNumber, previousCallingCode, newCallingCode);
            } else {
                getWrittenPhoneNumber = newCallingCode + getWrittenPhoneNumber;
            }
            previousCallingCode = newCallingCode;
            phoneNumberBox.val(getWrittenPhoneNumber);
        }

        countryBox.ready(selectChangeState).change(selectChangeState);
        //phoneNumberBox.keyup(selectChangeState);
        // $("#selectID option")[index].selected = true;
    },

    subStringMod: function (givenString, startSequence, endingSequence) {
        /// <summary>
        /// Give the sub string by searching the start and end sequence.
        /// subStringMod("Hello (World)", "(", ")") returns "World"
        /// </summary>
        /// <param name="givenString">Given string</param>
        /// <param name="startSequence">What find first.</param>
        /// <param name="endingSequence">What is the ending string.</param>
        "use strict";
        if (_.isString(givenString)) {
            var index1 = givenString.indexOf(startSequence);
            if (index1 > -1) {
                var index2 = givenString.indexOf(endingSequence);
                if (index2 > -1) {
                    // exist
                    return givenString.substr(index1 + 1, index2 - index1 - 1);
                }
            }
        }
        return null;
    },

    getComboString: function (comboName, comboClass, comboId, stringOptionItems, additionalAttributes) {
        /// <summary>
        /// returns a select/combo making string
        /// </summary>
        /// <param name="comboName">Name of the combo/select</param>
        /// <param name="comboClass">Class for the combo/select</param>
        /// <param name="comboId">Just pass the id or give null, it will automatically formatted</param>
        /// <param name="stringOptionItems">Option items passed as an string</param>
        /// <param name="additionalAttributes">Add additional attributes with the select, however user have to format it. Eg. id='hello' </param>
        if (!_.isEmpty(comboId)) {
            comboId = " id='" + comboId + "' ";
        } else {
            comboId = "";
        }
        if (_.isEmpty(comboClass)) {
            comboClass = "";
        }
        if (_.isEmpty(stringOptionItems)) {
            stringOptionItems = "";
        }
        if (_.isEmpty(comboName)) {
            comboName = "";
        } else {
            comboName = " name='" + comboName + "' ";
        }
        var comboString = "<select " + comboName +
                              " class='" + $.devOrg.genericComboClass +
                              " form-control " + comboClass +
                              " selectpicker'" + comboId +
                              " data-style='" + comboClass + "' " +
                              additionalAttributes +
                              " data-live-search='true'>" +
                              stringOptionItems +
                              " </select>";

        return comboString;
    },
    getComboOptionsStringFromJson: function (jsonItems, extraHtmlWithEachElement, itemClasses) {
        /// <summary>
        /// Generates and append "option" items to the given $select. 
        /// </summary>
        /// <param name="jsonItems">must contain display and id value for every 'option' item.</param>
        /// <param name="extraHtmlWithEachElement">add the extra html content with option display value</param>
        /// <param name="itemClasses">add classes with each option.</param>
        if (_.isEmpty(itemClasses)) {
            itemClasses = "";
        }
        if (_.isEmpty(extraHtmlWithEachElement)) {
            extraHtmlWithEachElement = "";
        }
        if (jsonItems.length > 0) {
            var length = jsonItems.length;
            var options = new Array(length + 5);
            var selected = " selected='selected' ";
            var optionStarting = "<option class='" + itemClasses + "'";
            var optionEnding = "</option>";
            for (var i = 0; i < length; i++) {
                if (i !== 0 && selected !== "") {
                    selected = ""; //only first one will be selected
                }
                options[i] = optionStarting +
                             selected +
                             " value='" +
                             jsonItems[i].id +
                             "'>" +
                             extraHtmlWithEachElement +
                             jsonItems[i].display +
                             optionEnding;
            }
            return options.join("");
        }
        return "";
    },
    getWholeComboStringWithJsonItems: function (jsonItems, comboName, comboClass, comboId, additionalAttributesWithCombo, extraHtmlWithEachElement, eachOptionItemClasses) {
        /// <summary>
        /// Returns a full combo/select based on json items
        /// Developer should inject this into document
        /// </summary>
        /// <param name="comboName">Name of the combo/select</param>
        /// <param name="comboClass">Class for the combo/select</param>
        /// <param name="comboId">Just pass the id or give null, it will automatically formatted</param>
        /// <param name="stringOptionItems">Option items passed as an string</param>
        /// <param name="additionalAttributes">Add additional attributes with the select, however user have to format it. Eg. id='hello' </param>
        /// <param name="jsonItems">must contain display and id value for every 'option' item.</param>
        /// <param name="extraHtmlWithEachElement">add the extra html content with option display value</param>
        /// <param name="itemClasses">add classes with each option.</param>
        var optionsString = $.devOrg.getComboOptionsStringFromJson(jsonItems, extraHtmlWithEachElement, eachOptionItemClasses);
        var comboString = $.devOrg.getComboString(comboName, comboClass, comboId, optionsString, additionalAttributesWithCombo);
        return comboString;
    },
    smartDependableCombo: function (parentSelectsjQuerySelector,
                                    mainDivContainerSelector,
                                    innerDivSelectorForPlacingCombo,
                                    receivingJsonUrl,
                                    placingComboName,
                                    placedComboId,
                                    placedComboClass,
                                    placedComboAdditionalAttributes,
                                    placedComboAdditionalClassesWithEachItem,
                                    placedComboAdditionalHtmlWithEachItem) {
        /// <summary>
        /// Create dependable combo based on parent and given url to get json list.
        /// Warning: No combo/select will appear , even the main div will disappear if no item is received from the receivingJsonUrl.
        /// </summary>
        /// <param name="parentSelectsjQuerySelector">Write jQuery selector for only the parent combo/select</param>
        /// <param name="mainDivContainerSelector">Main container div of that select/combo. Reason is to hide all including labels when no items found from url.</param>
        /// <param name="innerDivSelectorForPlacingCombo">Where to place the combo/slect</param>
        /// <param name="receivingJsonUrl">Url to get json list, data must contain at least {display= value to display, id = value to put}</param>
        /// <param name="placingComboName">Name of the select/combo</param>
        /// <param name="placedComboId">Id of the select/combo</param>
        /// <param name="placedComboClass">classes of the select/combo</param>
        /// <param name="placedComboAdditionalAttributes">Add additional attributes with the select, however user have to format it. Eg. id='hello'</param>
        /// <param name="placedComboAdditionalClassesWithEachItem">Add extra classes with every option, only write the class names with space.</param>
        /// <param name="placedComboAdditionalHtmlWithEachItem">Add extra html content with each option item</param>
        var $parentCombo = $(parentSelectsjQuerySelector);
        if (_.isEmpty($parentCombo)) {
            console.error.log("error raised from developers organism component's smartDependableCombo that no parent is detected.");
            return; // nothing exist in parent.
        }
        // row container
        var $mainDiv = $(mainDivContainerSelector);
        // container for  the select
        var $innerDiv = $mainDiv.find(innerDivSelectorForPlacingCombo);

        function hideDiv() {
            if ($mainDiv.length > 0) {
                $mainDiv.hide();
            } else {
                console.error.log("devOrg->smartDependableCombo: main div not found for '" + mainDivContainerSelector + "'");
            }
        }

        hideDiv();

        function removeSelectIfExist() {
            var options = $innerDiv.find("select, div.bootstrap-select");
            if (options.length > 0) {
                options.remove();
            }
        }

        function createCombo(responseJson) {
            //(comboName, comboClass, comboId, additionalAttributes, jsonItems, extraHtmlWithEachElement, itemClasses)
            var comboString = $.devOrg.getWholeComboStringWithJsonItems(responseJson, placingComboName, placedComboClass, placedComboId, placedComboAdditionalAttributes, placedComboAdditionalHtmlWithEachItem, placedComboAdditionalClassesWithEachItem);
            //var insideDivHtml = $innerDiv.html();
            //var wholeCombo = comboString + insideDivHtml;
            $innerDiv.prepend(comboString);

            var $combo = $innerDiv.find("select");
            $combo.selectpicker();
        }
        //when parent combo/select is changed
        $parentCombo.change(function () {
            /// <summary>
            /// What will happen when parent combo/select changes item.
            /// </summary>
            var parentComboValue = $parentCombo.val();
            var actualUrl = receivingJsonUrl + "/" + parentComboValue;
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: actualUrl,
                success: function (response) {
                    if (response.length === 0) {
                        hideDiv();
                        return;
                    }
                    $innerDiv = $(mainDivContainerSelector).find(innerDivSelectorForPlacingCombo);
                    // items exist.
                    // $innerDiv is used to check if select exist or not.
                    removeSelectIfExist(); //remove inner options if exist any
                    $mainDiv.show("slow");
                    createCombo(response); // create if necessary and then append options to it.
                },
                error: function (xhr, status, error) {
                    hideDiv();
                }
            });
        });
    },


    bootstrapComboSelectbyFindingValue: function ($combo, searchForvalue) {
        $combo.selectpicker("val", searchForvalue).trigger("change");
    },
    bootstrapComboSelectIndex: function ($combo, index) {
        var $options = $combo.find(">option");
        if ($options.length > 0 && index <= ($options.length - 1)) {

            var itemFound = $($options[index]);
            var value = itemFound.val();
            $.devOrg.bootstrapComboSelectbyFindingValue($combo, value);
        }
    },

    // givenString "Example ( Hello )" 
    // startsWith= "Example" ; returns true.
    isStartsWith: function (givenString, startsWith) {
        if (_.isString(givenString)) {
            var subtringOfGiventext = givenString.substr(0, startsWith.length);
            if (subtringOfGiventext === startsWith) {
                return true;
            }
        }
        return false;
    },

    replaceStartsWith: function (givenString, findStartsWith, replaceString) {
        if (_.isString(givenString) && !_.isEmpty(findStartsWith)) {
            var subtringOfGiventext = givenString.substr(0, findStartsWith.length);
            if (subtringOfGiventext === findStartsWith) {
                var nextStringIndex = findStartsWith.length;
                var otherHalftext = givenString.substr(nextStringIndex, givenString.length - nextStringIndex);
                return replaceString + otherHalftext;
            }
        }
        return givenString;
    },

    // jquery formSelector, submitAtLast:true/false
    enterToNextTextBox: function (formSelector, submitAtLast) {
        var $form = $(formSelector);

        $form.find("input:text:first-child").focus();

        //var binders = formSelector + " input[type='text']:visible," +
        //    formSelector + " input[type='password']:visible," +
        //    formSelector + " input[type='numeric']:visible," +
        //    formSelector + " input[type='email']:visible," +
        //    //formSelector + " textarea:visible," +
        //    formSelector + " button.selectpicker[type='button']:visible," +
        //    formSelector + " select:visible";
        var binders = "input[type='text']:visible," +
                     "input[type='password']:visible," +
                     "input[type='numeric']:visible," +
                     "input[type='email']:visible," +
                    //formSelector + " textarea:visible," +
                     "button.selectpicker[type='button']:visible," +
                     "select:visible";
        $form.on("keypress", binders, function (e) {
            // var codeAbove = d.keyCode || d.which;
            // console.log("above code :" + codeAbove);
            var code = e.keyCode || e.which;
            // console.log("inside code :" + code);
            if (code === 13) { // Enter key
                e.preventDefault(); // Skip default behavior of the enter key
                var n = $(binders).length;
                var nextIndex = $(binders).index(this) + 1;
                if (nextIndex < n) {
                    $(binders)[nextIndex].focus();
                } else {
                    $(binders)[nextIndex - 1].blur();
                    if (submitAtLast === true) {
                        $form.submit();
                    }
                }
            }
        });
    },
    enterToNextTextBoxWithoutTags: function ($form, submitAtLast, isDynamicSelector) {

        $form.find("input:text:first-child").focus();

        //var binders = formSelector + " input[type='text']:visible," +
        //    formSelector + " input[type='password']:visible," +
        //    formSelector + " input[type='numeric']:visible," +
        //    formSelector + " input[type='email']:visible," +
        //    //formSelector + " textarea:visible," +
        //    formSelector + " button.selectpicker[type='button']:visible," +
        //    formSelector + " select:visible";
        var binders = "input[type='text']:visible," +
                     "input[type='password']:visible," +
                     "input[type='numeric']:visible," +
                     "input[type='email']:visible," +
                     ":not(.bootstrap-tagsinput input)," +
                    //formSelector + " textarea:visible," +
                     "button.selectpicker[type='button']:visible," +
                     "select:visible";
        var keyPressEvent = function (e) {
            // var codeAbove = d.keyCode || d.which;
            // console.log("above code :" + codeAbove);
            var code = e.keyCode || e.which;
            // console.log("inside code :" + code);
            if (code === 13) { // Enter key
                e.preventDefault(); // Skip default behavior of the enter key
                var n = $(binders).length;
                var nextIndex = $(binders).index(this) + 1;
                if (nextIndex < n) {
                    $(binders)[nextIndex].focus();
                } else {
                    $(binders)[nextIndex - 1].blur();
                    if (submitAtLast === true) {
                        $form.submit();
                    }
                }
            }
        };
        if (isDynamicSelector) {
            $form.on("keypress", binders, keyPressEvent);
        } else {
            var $inputs = $form.find(binders);
            $inputs.on('keypress', keyPressEvent);
        }
    },
    validateTextInputBasedOnRegEx: function (jQuerySelectorforTextBoxOrElement, stringRegEx, msgOnInvalidPattern) {
        "use strict";
        /// <summary>
        ///     Validate text input while typing with ASP.NET jquery validation.
        ///     Only the attributes with the text. No event is bound.
        /// Call reSetupjQueryValidate() to reSetup validation.
        /// </summary>
        /// <param name="jQuerySelectorforTextBox">string:jQuery Selector</param>
        /// <param name="stringRegEx">string: Regular expression to validate the textinput</param>
        var $elem = [];
        if (typeof jQuerySelectorforTextBoxOrElement === "string") {
            $elem = $(jQuerySelectorforTextBoxOrElement);
        } else {
            $elem = jQuerySelectorforTextBoxOrElement;
        }
        $elem.attr("data-val-regex-pattern", stringRegEx);
        if (!_.isEmpty(msgOnInvalidPattern)) {
            $elem.attr("data-val-regex", msgOnInvalidPattern);
        }
    },

    reSetupjQueryValidate: function (jQueryFormSelectorOrElement) {
        "use strict";
        /// <summary>
        ///     call after setting new reg ex via validateTextInputBasedOnRegEx
        /// </summary>
        /// <param name="jQueryFormSelectorOrElement">If jquery element pass then it will work with jQuery element, if element is pass then it will search in the DOM.</param>
        var $form = [];
        if (typeof jQueryFormSelectorOrElement === "string") {
            $form = $(jQueryFormSelectorOrElement);

        } else {
            $form = jQueryFormSelectorOrElement;
        }
        $form.removeData("validator") /* added by the raw jquery.validate plugin */
             .removeData("unobtrusiveValidation");
        /* added by the jquery unobtrusive plugin */
        $.validator.unobtrusive.parse($form);
    },


    validateInputFromServer: function (jQuerytextBoxSelector, validationUrl, internalValidatorSpanClassName, isAlwaysFocusUntilValid, isDisable, minChars, isSubmitTheWholeForm, onInvalidStringStatementInCrossMark, onValidStringStatementInCheckMark, $formGiven, maxTryLimit, onCompleteFunction) {
        /// <summary>
        ///     Made validation easy on the fly with a server response.
        /// </summary>
        /// <param name="jQuerytextBoxSelector">string: jQuery Selector</param>
        /// <param name="validationURL">string: Url to validate</param>
        /// <param name="internalValidatorSpanClassName">Propertyname (refer to the class of validation span) Indicating class.</param>
        /// <param name="isAlwaysFocusUntilValid">Boolean: Keep the focus until it's valid. By default: false</param>
        /// <param name="isDisable">Boolean: Disable the textbox after being validated. By default : false.</param>
        /// <param name="minChars">number: min chars to send the request</param>
        /// <param name="isSubmitTheWholeForm">Boolean:Rather than submitting the small form submit the whole related closet form.</param>
        /// <param name="onInvalidStringStatementInCrossMark">invalid statement show on the cross mark.</param>
        /// <param name="onValidStringStatementInCheckMark">
        ///     valid statement show on the check mark. By default: fieldDisplayname +
        ///     is available and valid
        /// </param>

        "use strict";

        //if (_.isEmpty(isSubmitTheWholeForm)) {
        //    isSubmitTheWholeForm = false;
        //}

        //if (_.isEmpty(isAlwaysFocusUntilValid)) {
        //    isAlwaysFocusUntilValid = false;
        //}

        //if (_.isEmpty(isDisable)) {
        //    isDisable = false;
        //}

        var sentRequestCount = 0;
        var $userTextbox = $(jQuerytextBoxSelector);
        if ($userTextbox.length > 0) {
            $userTextbox.removeAttr("isDisable");

            if (!isSubmitTheWholeForm) {
                $userTextbox.keyup(function () {
                    $("#validation #id").val($userTextbox.val());
                    // console.log(user);
                }).focus(function () {
                    $("#validation #id").val($userTextbox.val());
                    // console.log(user);
                });
            }

            $userTextbox.blur(function () {
                "use strict";
                if (!isSubmitTheWholeForm) {
                    $("#validation #id").val($userTextbox.val());
                }
                var $passingText = $userTextbox.val();
                if (_.isEmpty($passingText) || $passingText.length < minChars) {
                    // if empty text then don't send.
                    return;
                }
                if (_.isEmpty(onValidStringStatementInCheckMark)) {
                    onValidStringStatementInCheckMark = "is available and valid.";
                }
                if (_.isEmpty(onInvalidStringStatementInCrossMark)) {
                    onInvalidStringStatementInCrossMark = "is not valid or already exist. Your input can't contain ( [ ] ' , * & ? \" ) or space or any other special character for this data-type.";
                }

                // Validation should be a formData underlying the original from with 
                // only antiforgery token and a hidden id field
                // whatever is typed in that selected text box will be pushed into
                // this formData
                var formData;
                if ($formGiven === null || $formGiven === undefined || $formGiven.length == 0) {
                    if (!isSubmitTheWholeForm) {
                        formData = $.byId("validation").serialize();
                    } else {
                        formData = $userTextbox.closest("form").serializeArray();
                    }
                } else {
                    formData = $formGiven.serializeArray();
                }

                //console.log(formData);

                var validatorName = "span.CustomValidation." + internalValidatorSpanClassName;
                //var token = $("input[name=__RequestVerificationToken]").val();
                var processingState1 = "glyphicon-refresh";
                var processingState2 = "glyphicon-spin";
                var isHideClass = "hide";
                var colorGreen = "green";
                var colorRed = "red";
                var correctState = "glyphicon-ok";
                var incorrectState = "glyphicon-remove";
                var $validatorBox = $(validatorName);
                var displayName = $validatorBox.attr("data-display");
                var correctStateTitle = displayName + " " + onValidStringStatementInCheckMark;
                var invalidAttrName = "data-invalid";
                var incorrectStateTitle = displayName + " " + onInvalidStringStatementInCrossMark;
                var tooltipName = "a.CustomValidation." + internalValidatorSpanClassName + ".tooltip-show";
                var $tooltipBox = $(tooltipName);

                // console.log($("#validation #id").val());
                $validatorBox.removeClass(incorrectState).removeClass(correctState);


                // if no processing state then add it
                if (!$validatorBox.hasClass(processingState1)) {
                    $validatorBox.addClass(processingState1);
                }

                if (!$validatorBox.hasClass(processingState2)) {
                    $validatorBox.addClass(processingState2);
                }
                if ($validatorBox.hasClass(isHideClass)) {
                    $validatorBox.removeClass(isHideClass);
                }
                $tooltipBox.attr("data-original-title", "Validating " + displayName)
                    .attr("title", "Validating " + displayName);
                // confirming processing state.
                if (maxTryLimit !== null && maxTryLimit !== undefined && sentRequestCount > maxTryLimit) {
                    return;
                }
                $.ajax({
                    type: "POST",
                    dataType: "JSON",
                    url: validationUrl,
                    data: formData,
                    success: function (response) {
                        sentRequestCount = sentRequestCount + 1;
                        // Remove the processing state
                        if ($validatorBox.hasClass(processingState1)) {
                            $validatorBox.removeClass(processingState1);
                        }

                        if ($validatorBox.hasClass(processingState2)) {
                            $validatorBox.removeClass(processingState2);
                        }
                        if ($validatorBox.hasClass(isHideClass)) {
                            $validatorBox.removeClass(isHideClass);
                        }
                        // Remove the processing state
                        if (response == true) {
                            if ($validatorBox.hasClass(incorrectState)) {
                                $validatorBox.removeClass(incorrectState);
                            }
                            if ($validatorBox.hasClass(colorRed)) {
                                $validatorBox.removeClass(colorRed);
                            }
                            $validatorBox.addClass(colorGreen)
                                .addClass(correctState)
                                .attr("title", correctStateTitle);

                            $tooltipBox.attr("title", correctStateTitle)
                                .attr("data-original-title", correctStateTitle);
                            if (isDisable) {
                                $userTextbox.prop("isDisable", true);
                            }

                            $userTextbox.addClass("bold")
                                .addClass("green")
                                .next()
                                .focus();

                            $userTextbox.removeAttr(invalidAttrName);
                            if (typeof onCompleteFunction === "function") {
                                onCompleteFunction.apply();
                            }
                        } else {
                            if ($validatorBox.hasClass(colorGreen)) {
                                $validatorBox.removeClass(colorGreen);
                            }
                            if ($validatorBox.hasClass(correctState)) {
                                $validatorBox.removeClass(correctState);
                            }
                            $userTextbox.prop("isDisable", false)
                                .addClass("bold")
                                .addClass("red");

                            $validatorBox.addClass(colorRed)
                                .addClass(incorrectState)
                                .attr("title", incorrectStateTitle);

                            $tooltipBox.attr("title", incorrectStateTitle)
                                .attr("data-original-title", incorrectStateTitle);
                            if (isAlwaysFocusUntilValid === true) {
                                $userTextbox.focus();
                            }
                            $userTextbox.attr(invalidAttrName, "true");
                        }
                        $(".tooltip-show").tooltip();

                    },
                    error: function (xhr, status, error) {
                        // Remove the processing state
                        if ($validatorBox.hasClass(processingState1)) {
                            $validatorBox.removeClass(processingState1);
                        }

                        if ($validatorBox.hasClass(processingState2)) {
                            $validatorBox.removeClass(processingState2);
                        }
                        if ($validatorBox.hasClass(isHideClass)) {
                            $validatorBox.removeClass(isHideClass);
                        }
                        // Remove the processing state
                        if ($validatorBox.hasClass(correctState)) {
                            $validatorBox.removeClass(correctState);
                        }

                        if ($validatorBox.hasClass(colorGreen)) {
                            $validatorBox.removeClass(colorGreen);
                        }
                        $userTextbox.prop("isDisable", false)
                            .addClass("bold")
                            .addClass("red");

                        $validatorBox.addClass(colorRed)
                            .addClass(incorrectState)
                            .attr("title", error);

                        $tooltipBox.attr("title", status)
                            .attr("data-original-title", error);

                        $(".tooltip-show").tooltip();
                        $userTextbox.attr(invalidAttrName, "true");
                    }
                }); // ajax end
            });
        }; // if else end
    },


    fillRegisterFieldsOnDemo: function () {
        /// <summary>
        /// Test Function
        /// </summary>
        var i = 0;
        var controls = $(".form-group");
        var $fields = controls.find("input[type=text]");
        $.each($fields, function () {
            this.value = 1111111111111;
        });

        $fields = controls.find("input[type=password]");
        $.each($fields, function () {
            this.value = "asdf1234@";
        });


        $fields = controls.find("input[type=number]");
        $.each($fields, function () {
            this.value = i++;
        });

        $fields = controls.find("textarea");
        $.each($fields, function () {
            this.value = "1111111111111";
        });

        $fields = controls.find("input[type=email]");
        $.each($fields, function () {
            this.value = "auk.junk@live.com";
        });

        $fields = controls.find("input[type=checkbox]");
        $.each($fields, function () {
            this.prop("checked", true);
        });

    },
    //'.make-it-tab'
    bootstrapTabsMordernize: function (tabSelector) {
        /// <summary>
        /// give jQuery selector to add tab functionality
        /// </summary>
        /// <param name="tabSelector"></param>
        "use strict";
        var bootstrapTabs = $(tabSelector);
        if (bootstrapTabs.length > 0) {
            var tabHidden = $(".tab-content input[type='hidden'][name='tab']");

            if (tabHidden.length > 0) {
                var tabHiddenValue = tabHidden.val();
                if (!_.isEmpty(tabHiddenValue)) {
                    //tab name exist
                    bootstrapTabs.find("li>a[href='" + tabHiddenValue + "']").tab("show");
                } else {
                    //no tab name exist.. select default one.
                    bootstrapTabs.find("li > a:first").tab("show");
                }
            }

            bootstrapTabs.click(function (e) {
                //e.preventDefault();                    
                e.preventDefault();
                $(this).tab("show");

            });

            $("ul" + tabSelector + ".nav-tabs > li > a").on("shown.bs.tab", function (e) {
                var valueOfActive = $(e.target).attr("href");
                // = $(tabSelector + " li.active>a").attr('href');
                tabHidden.val(valueOfActive);
                //window.location.hash = id;
            });
        }
    },
    ratingMordernize: function () {

        var ratingItems = $(".rating-5");

        if (ratingItems.length > 0) {
            ratingItems.rating({
                showClear: false
            });
        }
        ratingItems = $(".rating-10");

        if (ratingItems.length > 0) {
            ratingItems.rating({
                showClear: false,
                starCaptionClasses: {
                    0.5: "label label-danger",
                    1: "label label-danger",
                    1.5: "label label-danger",
                    2: "label label-danger",
                    2.5: "label label-danger",
                    2: "label label-warning",
                    2.5: "label label-warning",
                    3: "label label-warning",
                    3.5: "label label-warning",
                    4: "label label-warning",
                    4.5: "label label-warning",
                    5: "label label-warning",
                    5.5: "label label-info",
                    6: "label label-info",
                    6.5: "label label-info",
                    7: "label label-info",
                    7.5: "label label-primary",
                    8: "label label-primary",
                    8.5: "label label-success",
                    9: "label label-success",
                    9.5: "label label-success",
                    10: "label label-success"
                }
            });
        }
    },

    uxFriendlySlide: function (jQuerySelectorOrElement, keepOthersVisible, dontSubmit) {
        /// <summary>
        ///     hides except for the first div with value 0. Add attributes to divs
        ///     [data-dev-slide='number-zero-based'][data-dev-visited='false'] and
        ///     encapsulate inputs. Each click clicked on submit it will verify the inputs if verified next hide ones will be shown
        ///     it will be continuous process until hit the last.
        ///     Always use lower case false
        ///     [data-dev-slide='number-zero-based'][data-dev-visited='false']
        /// </summary>
        /// <param name="jQuerySelectorOrElement">jQuery selector for the form</param>
        /// <param name="keepOthersVisible">Should add new hide ones or previous ones hides and load new ones(divs)</param>
        /// <param name="dontSubmit">When none left , do we submit? True: don't submit</param>
        "use strict";

        var slideObjects = [];
        if (typeof jQuerySelectorOrElement === "string") {
            slideObjects = $(jQuerySelectorOrElement + " [data-dev-slide][data-dev-visited='false']");
        } else if (jQuerySelectorOrElement !== null && jQuerySelectorOrElement!== undefined && jQuerySelectorOrElement.length > 0) {
            slideObjects = jQuerySelectorOrElement.find("[data-dev-slide][data-dev-visited='false']");
        }
        //var executedOnce = false;
        //var binders = "input[type='text']:visible," +
        //    "input[type='password']:visible," +
        //    "input[type='email']:visible," +
        //    "input[type='numeric']:visible," +
        //    "select:visible";
        var order = 0;
        var totalSliderLength = slideObjects.length;
        var previousSlideNumber = 0;
        if (totalSliderLength > 0) {
            // exist slides.
            slideObjects.hide();
            previousSlideNumber = order;
            slideObjects.filter("[data-dev-slide='" + (order++) + "'][data-dev-visited='false']").show();
            $(jQuerySelectorOrElement).submit(function (e) {
                e.preventDefault();

                var nextOne = slideObjects.filter("[data-dev-slide='" + order + "'][data-dev-visited='false']");
                // if (nextOne.length == 0) {
                //    for (order += 1; nextOne.length == 0 && totalSliderLength >= order; order++) {
                //        nextOne = slideObjects.filter("[data-dev-slide='" + order + "'][data-dev-visited='false']");
                //    }
                // }
                var previousOne;
                var inputBoxes;
                if (nextOne.length > 0) {
                    previousOne = slideObjects.filter("[data-dev-slide='" + (order - 1) + "']"); // console.log(previousOne);
                    inputBoxes = previousOne.find("input, textarea"); // still exist , prevent submission
                    if (inputBoxes.length > 0 && $.devOrg.checkValidInputs(inputBoxes)) {
                        if (!keepOthersVisible) {
                            previousOne.hide("slow");
                        }
                        //console.log(inputBoxes);
                        //console.log(binders);
                        if (!nextOne.prop("data-dev-visited")) {
                            nextOne.attr("data-dev-visited", "true");
                            nextOne.show("slow");
                            //console.log(nextOne);
                            order++;
                        }
                    } else {
                        //console.log("no inboxes");
                    }

                } else {
                    // nothing left.
                    // sttil check the validation.
                    previousOne = slideObjects.filter("[data-dev-slide='" + (order - 1) + "']"); // console.log(previousOne);
                    inputBoxes = previousOne.find("input");
                    if (inputBoxes.length > 0 && $.devOrg.checkValidInputs(inputBoxes)) {
                        if (!dontSubmit) {
                            this.submit();
                        }
                    }
                }


            });

            // var notVisited = slideObjects.filter("[data-dev-visited='false']");
        }
    },
    // Send inputs array, if any of those false , returns false.
    checkValidInputs: function (jBinders) {
        "use strict";

        var $currentInput = null;
        var length = jBinders.length;
        var label = "<label class='label label-danger small-font-size'>Please rate first.</label>";
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                $currentInput = $(jBinders[i]);

                if ($currentInput.hasClass("common-rating")) {
                    var $ratingContainer = $currentInput.closest("div.rating-container");
                    var $wholeContainer = $ratingContainer.closest("div.star-rating");

                    if ($currentInput.val() === "0") {
                        $ratingContainer.css({
                            'text-shadow': "2px 2px red"
                        });
                        if (!$wholeContainer.attr("data-warned")) {
                            $wholeContainer.append(label);
                            $wholeContainer.attr("data-warned", "true");
                        }
                        return false;
                    } else {
                        $ratingContainer.css({
                            'text-shadow': "none"
                        });

                        if ($wholeContainer.attr("data-warned")) {
                            $wholeContainer.find("label").remove();
                            $wholeContainer.attr("data-warned", "false");
                        }
                    }
                }
                if (!$currentInput.valid()) {
                    return false;
                }
            }
        }
        return true;
    }
};

///#source 1 1 /JavaScript-Mvc-framework/libs/FrontEnd/front-developer.js
/// <reference path="jquery-2.1.1.js" />

/// <reference path="jetmenu.js" />
/// <reference path="modernizr-2.6.2.js" />
/// <reference path="owl.carousel.min.js" />
/// <reference path="the-lion-plugin.js" />
/// <reference path="jquery.validate.js" />
/// <reference path="respond.js" />
/// <reference path="pei-chart.js" />
/// <reference path="jquery.lightSlider.min.js" />
/// <reference path="../../rs-plugin/js/jquery.themepunch.revolution.min.js" />
/// <reference path="bootstrap-rating.min.js" />
/// <reference path="underscore-min.js" />
/// <reference path="../DevOrgPlugins/faster-jQuery.js" />

$(function () {


    

});

///#source 1 1 /JavaScript-Mvc-framework/libs/jquery.blockUI.js
/*
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function() {
/*jshint eqeqeq:false curly:false latedef:false */
"use strict";

	function setup($) {
		$.fn._fadeIn = $.fn.fadeIn;

		var noOp = $.noop || function() {};

		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
		// confusing userAgent strings on Vista)
		var msie = /MSIE/.test(navigator.userAgent);
		var ie6  = /MSIE 6.0/.test(navigator.userAgent) && ! /MSIE 8.0/.test(navigator.userAgent);
		var mode = document.documentMode || 0;
		var setExpr = $.isFunction( document.createElement('div').style.setExpression );

		// global $ methods for blocking/unblocking the entire page
		$.blockUI   = function(opts) { install(window, opts); };
		$.unblockUI = function(opts) { remove(window, opts); };

		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
		$.growlUI = function(title, message, timeout, onClose) {
			var $m = $('<div class="growlUI"></div>');
			if (title) $m.append('<h1>'+title+'</h1>');
			if (message) $m.append('<h2>'+message+'</h2>');
			if (timeout === undefined) timeout = 3000;

			// Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
			var callBlock = function(opts) {
				opts = opts || {};

				$.blockUI({
					message: $m,
					fadeIn : typeof opts.fadeIn  !== 'undefined' ? opts.fadeIn  : 700,
					fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
					timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
					centerY: false,
					showOverlay: false,
					onUnblock: onClose,
					css: $.blockUI.defaults.growlCSS
				});
			};

			callBlock();
			var nonmousedOpacity = $m.css('opacity');
			$m.mouseover(function() {
				callBlock({
					fadeIn: 0,
					timeout: 30000
				});

				var displayBlock = $('.blockMsg');
				displayBlock.stop(); // cancel fadeout if it has started
				displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
			}).mouseout(function() {
				$('.blockMsg').fadeOut(1000);
			});
			// End konapun additions
		};

		// plugin method for blocking element content
		$.fn.block = function(opts) {
			if ( this[0] === window ) {
				$.blockUI( opts );
				return this;
			}
			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
			this.each(function() {
				var $el = $(this);
				if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
					return;
				$el.unblock({ fadeOut: 0 });
			});

			return this.each(function() {
				if ($.css(this,'position') == 'static') {
					this.style.position = 'relative';
					$(this).data('blockUI.static', true);
				}
				this.style.zoom = 1; // force 'hasLayout' in ie
				install(this, opts);
			});
		};

		// plugin method for unblocking element content
		$.fn.unblock = function(opts) {
			if ( this[0] === window ) {
				$.unblockUI( opts );
				return this;
			}
			return this.each(function() {
				remove(this, opts);
			});
		};

		$.blockUI.version = 2.70; // 2nd generation blocking at no extra cost!

		// override these in your code to change the default behavior and style
		$.blockUI.defaults = {
			// message displayed when blocking (use null for no message)
			message:  '<h1>Please wait...</h1>',

			title: null,		// title string; only used when theme == true
			draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)

			theme: false, // set to true to use with jQuery UI themes

			// styles for the message when blocking; if you wish to disable
			// these and use an external stylesheet then do this in your code:
			// $.blockUI.defaults.css = {};
			css: {
				padding:	0,
				margin:		0,
				width:		'30%',
				top:		'40%',
				left:		'35%',
				textAlign:	'center',
				color:		'#000',
				border:		'3px solid #aaa',
				backgroundColor:'#fff',
				cursor:		'wait'
			},

			// minimal style set used when themes are used
			themedCSS: {
				width:	'30%',
				top:	'40%',
				left:	'35%'
			},

			// styles for the overlay
			overlayCSS:  {
				backgroundColor:	'#000',
				opacity:			0.6,
				cursor:				'wait'
			},

			// style to replace wait cursor before unblocking to correct issue
			// of lingering wait cursor
			cursorReset: 'default',

			// styles applied when using $.growlUI
			growlCSS: {
				width:		'350px',
				top:		'10px',
				left:		'',
				right:		'10px',
				border:		'none',
				padding:	'5px',
				opacity:	0.6,
				cursor:		'default',
				color:		'#fff',
				backgroundColor: '#000',
				'-webkit-border-radius':'10px',
				'-moz-border-radius':	'10px',
				'border-radius':		'10px'
			},

			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
			// (hat tip to Jorge H. N. de Vasconcelos)
			/*jshint scripturl:true */
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

			// force usage of iframe in non-IE browsers (handy for blocking applets)
			forceIframe: false,

			// z-index for the blocking overlay
			baseZ: 1000,

			// set these to true to have the message automatically centered
			centerX: true, // <-- only effects element blocking (page block controlled via css above)
			centerY: true,

			// allow body element to be stetched in ie6; this makes blocking look better
			// on "short" pages.  disable if you wish to prevent changes to the body height
			allowBodyStretch: true,

			// enable if you want key and mouse events to be disabled for content that is blocked
			bindEvents: true,

			// be default blockUI will supress tab navigation from leaving blocking content
			// (if bindEvents is true)
			constrainTabKey: true,

			// fadeIn time in millis; set to 0 to disable fadeIn on block
			fadeIn:  200,

			// fadeOut time in millis; set to 0 to disable fadeOut on unblock
			fadeOut:  400,

			// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
			timeout: 0,

			// disable if you don't want to show the overlay
			showOverlay: true,

			// if true, focus will be placed in the first available input field when
			// page blocking
			focusInput: true,

            // elements that can receive focus
            focusableElements: ':input:enabled:visible',

			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
			// no longer needed in 2012
			// applyPlatformOpacityRules: true,

			// callback method invoked when fadeIn has completed and blocking message is visible
			onBlock: null,

			// callback method invoked when unblocking has completed; the callback is
			// passed the element that has been unblocked (which is the window object for page
			// blocks) and the options that were passed to the unblock call:
			//	onUnblock(element, options)
			onUnblock: null,

			// callback method invoked when the overlay area is clicked.
			// setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
			onOverlayClick: null,

			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
			quirksmodeOffsetHack: 4,

			// class name of the message block
			blockMsgClass: 'blockMsg',

			// if it is already blocked, then ignore it (don't unblock and reblock)
			ignoreIfBlocked: false
		};

		// private data and functions follow...

		var pageBlock = null;
		var pageBlockEls = [];

		function install(el, opts) {
			var css, themedCSS;
			var full = (el == window);
			var msg = (opts && opts.message !== undefined ? opts.message : undefined);
			opts = $.extend({}, $.blockUI.defaults, opts || {});

			if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
				return;

			opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
			if (opts.onOverlayClick)
				opts.overlayCSS.cursor = 'pointer';

			themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
			msg = msg === undefined ? opts.message : msg;

			// remove the current block (if there is one)
			if (full && pageBlock)
				remove(window, {fadeOut:0});

			// if an existing element is being used as the blocking content then we capture
			// its current place in the DOM (and current display style) so we can restore
			// it when we unblock
			if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
				var node = msg.jquery ? msg[0] : msg;
				var data = {};
				$(el).data('blockUI.history', data);
				data.el = node;
				data.parent = node.parentNode;
				data.display = node.style.display;
				data.position = node.style.position;
				if (data.parent)
					data.parent.removeChild(node);
			}

			$(el).data('blockUI.onUnblock', opts.onUnblock);
			var z = opts.baseZ;

			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
			// layer1 is the iframe layer which is used to supress bleed through of underlying content
			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
			// layer3 is the message content that is displayed while blocking
			var lyr1, lyr2, lyr3, s;
			if (msie || opts.forceIframe)
				lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>');
			else
				lyr1 = $('<div class="blockUI" style="display:none"></div>');

			if (opts.theme)
				lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>');
			else
				lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

			if (opts.theme && full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (opts.theme) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
			}
			else {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
			}
			lyr3 = $(s);

			// if we have a message, style it
			if (msg) {
				if (opts.theme) {
					lyr3.css(themedCSS);
					lyr3.addClass('ui-widget-content');
				}
				else
					lyr3.css(css);
			}

			// style the overlay
			if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
				lyr2.css(opts.overlayCSS);
			lyr2.css('position', full ? 'fixed' : 'absolute');

			// make iframe layer transparent in IE
			if (msie || opts.forceIframe)
				lyr1.css('opacity',0.0);

			//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
			var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
			$.each(layers, function() {
				this.appendTo($par);
			});

			if (opts.theme && opts.draggable && $.fn.draggable) {
				lyr3.draggable({
					handle: '.ui-dialog-titlebar',
					cancel: 'li'
				});
			}

			// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
			var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
			if (ie6 || expr) {
				// give body 100% height
				if (full && opts.allowBodyStretch && $.support.boxModel)
					$('html,body').css('height','100%');

				// fix ie6 issue when blocked element has a border width
				if ((ie6 || !$.support.boxModel) && !full) {
					var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
					var fixT = t ? '(0 - '+t+')' : 0;
					var fixL = l ? '(0 - '+l+')' : 0;
				}

				// simulate fixed position
				$.each(layers, function(i,o) {
					var s = o[0].style;
					s.position = 'absolute';
					if (i < 2) {
						if (full)
							s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"');
						else
							s.setExpression('height','this.parentNode.offsetHeight + "px"');
						if (full)
							s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
						else
							s.setExpression('width','this.parentNode.offsetWidth + "px"');
						if (fixL) s.setExpression('left', fixL);
						if (fixT) s.setExpression('top', fixT);
					}
					else if (opts.centerY) {
						if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
						s.marginTop = 0;
					}
					else if (!opts.centerY && full) {
						var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
						var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
						s.setExpression('top',expression);
					}
				});
			}

			// show the message
			if (msg) {
				if (opts.theme)
					lyr3.find('.ui-widget-content').append(msg);
				else
					lyr3.append(msg);
				if (msg.jquery || msg.nodeType)
					$(msg).show();
			}

			if ((msie || opts.forceIframe) && opts.showOverlay)
				lyr1.show(); // opacity is zero
			if (opts.fadeIn) {
				var cb = opts.onBlock ? opts.onBlock : noOp;
				var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
				var cb2 = msg ? cb : noOp;
				if (opts.showOverlay)
					lyr2._fadeIn(opts.fadeIn, cb1);
				if (msg)
					lyr3._fadeIn(opts.fadeIn, cb2);
			}
			else {
				if (opts.showOverlay)
					lyr2.show();
				if (msg)
					lyr3.show();
				if (opts.onBlock)
					opts.onBlock.bind(lyr3)();
			}

			// bind key and mouse events
			bind(1, el, opts);

			if (full) {
				pageBlock = lyr3[0];
				pageBlockEls = $(opts.focusableElements,pageBlock);
				if (opts.focusInput)
					setTimeout(focus, 20);
			}
			else
				center(lyr3[0], opts.centerX, opts.centerY);

			if (opts.timeout) {
				// auto-unblock
				var to = setTimeout(function() {
					if (full)
						$.unblockUI(opts);
					else
						$(el).unblock(opts);
				}, opts.timeout);
				$(el).data('blockUI.timeout', to);
			}
		}

		// remove the block
		function remove(el, opts) {
			var count;
			var full = (el == window);
			var $el = $(el);
			var data = $el.data('blockUI.history');
			var to = $el.data('blockUI.timeout');
			if (to) {
				clearTimeout(to);
				$el.removeData('blockUI.timeout');
			}
			opts = $.extend({}, $.blockUI.defaults, opts || {});
			bind(0, el, opts); // unbind events

			if (opts.onUnblock === null) {
				opts.onUnblock = $el.data('blockUI.onUnblock');
				$el.removeData('blockUI.onUnblock');
			}

			var els;
			if (full) // crazy selector to handle odd field errors in ie6/7
				els = $('body').children().filter('.blockUI').add('body > .blockUI');
			else
				els = $el.find('>.blockUI');

			// fix cursor issue
			if ( opts.cursorReset ) {
				if ( els.length > 1 )
					els[1].style.cursor = opts.cursorReset;
				if ( els.length > 2 )
					els[2].style.cursor = opts.cursorReset;
			}

			if (full)
				pageBlock = pageBlockEls = null;

			if (opts.fadeOut) {
				count = els.length;
				els.stop().fadeOut(opts.fadeOut, function() {
					if ( --count === 0)
						reset(els,data,opts,el);
				});
			}
			else
				reset(els, data, opts, el);
		}

		// move blocking element back into the DOM where it started
		function reset(els,data,opts,el) {
			var $el = $(el);
			if ( $el.data('blockUI.isBlocked') )
				return;

			els.each(function(i,o) {
				// remove via DOM calls so we don't lose event handlers
				if (this.parentNode)
					this.parentNode.removeChild(this);
			});

			if (data && data.el) {
				data.el.style.display = data.display;
				data.el.style.position = data.position;
				data.el.style.cursor = 'default'; // #59
				if (data.parent)
					data.parent.appendChild(data.el);
				$el.removeData('blockUI.history');
			}

			if ($el.data('blockUI.static')) {
				$el.css('position', 'static'); // #22
			}

			if (typeof opts.onUnblock == 'function')
				opts.onUnblock(el,opts);

			// fix issue in Safari 6 where block artifacts remain until reflow
			var body = $(document.body), w = body.width(), cssW = body[0].style.width;
			body.width(w-1).width(w);
			body[0].style.width = cssW;
		}

		// bind/unbind the handler
		function bind(b, el, opts) {
			var full = el == window, $el = $(el);

			// don't bother unbinding if there is nothing to unbind
			if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
				return;

			$el.data('blockUI.isBlocked', b);

			// don't bind events when overlay is not in use or if bindEvents is false
			if (!full || !opts.bindEvents || (b && !opts.showOverlay))
				return;

			// bind anchors and inputs for mouse and key events
			var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
			if (b)
				$(document).bind(events, opts, handler);
			else
				$(document).unbind(events, handler);

		// former impl...
		//		var $e = $('a,:input');
		//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
		}

		// event handler to suppress keyboard/mouse events when blocking
		function handler(e) {
			// allow tab navigation (conditionally)
			if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
				if (pageBlock && e.data.constrainTabKey) {
					var els = pageBlockEls;
					var fwd = !e.shiftKey && e.target === els[els.length-1];
					var back = e.shiftKey && e.target === els[0];
					if (fwd || back) {
						setTimeout(function(){focus(back);},10);
						return false;
					}
				}
			}
			var opts = e.data;
			var target = $(e.target);
			if (target.hasClass('blockOverlay') && opts.onOverlayClick)
				opts.onOverlayClick(e);

			// allow events within the message content
			if (target.parents('div.' + opts.blockMsgClass).length > 0)
				return true;

			// allow events for content that is not being blocked
			return target.parents().children().filter('div.blockUI').length === 0;
		}

		function focus(back) {
			if (!pageBlockEls)
				return;
			var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
			if (e)
				e.focus();
		}

		function center(el, x, y) {
			var p = el.parentNode, s = el.style;
			var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
			var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
			if (x) s.left = l > 0 ? (l+'px') : '0';
			if (y) s.top  = t > 0 ? (t+'px') : '0';
		}

		function sz(el, p) {
			return parseInt($.css(el,p),10)||0;
		}

	}


	/*global define:true */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}

})();

///#source 1 1 /JavaScript-Mvc-framework/libs/bootbox.js
/**
 * bootbox.js [v4.4.0]
 *
 * http://bootboxjs.com/license.txt
 */

// @see https://github.com/makeusabrew/bootbox/issues/180
// @see https://github.com/makeusabrew/bootbox/issues/186
(function (root, factory) {

  "use strict";
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    // Browser globals (root is window)
    root.bootbox = factory(root.jQuery);
  }

}(this, function init($, undefined) {

  "use strict";

  // the base DOM structure needed to create a modal
  var templates = {
    dialog:
      "<div class='bootbox modal' tabindex='-1' role='dialog'>" +
        "<div class='modal-dialog'>" +
          "<div class='modal-content'>" +
            "<div class='modal-body'><div class='bootbox-body'></div></div>" +
          "</div>" +
        "</div>" +
      "</div>",
    header:
      "<div class='modal-header'>" +
        "<h4 class='modal-title'></h4>" +
      "</div>",
    footer:
      "<div class='modal-footer'></div>",
    closeButton:
      "<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
    form:
      "<form class='bootbox-form'></form>",
    inputs: {
      text:
        "<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",
      textarea:
        "<textarea class='bootbox-input bootbox-input-textarea form-control'></textarea>",
      email:
        "<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",
      select:
        "<select class='bootbox-input bootbox-input-select form-control'></select>",
      checkbox:
        "<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>",
      date:
        "<input class='bootbox-input bootbox-input-date form-control' autocomplete=off type='date' />",
      time:
        "<input class='bootbox-input bootbox-input-time form-control' autocomplete=off type='time' />",
      number:
        "<input class='bootbox-input bootbox-input-number form-control' autocomplete=off type='number' />",
      password:
        "<input class='bootbox-input bootbox-input-password form-control' autocomplete='off' type='password' />"
    }
  };

  var defaults = {
    // default language
    locale: "en",
    // show backdrop or not. Default to static so user has to interact with dialog
    backdrop: "static",
    // animate the modal in/out
    animate: true,
    // additional class string applied to the top level dialog
    className: null,
    // whether or not to include a close button
    closeButton: true,
    // show the dialog immediately by default
    show: true,
    // dialog container
    container: "body"
  };

  // our public object; augmented after our private API
  var exports = {};

  /**
   * @private
   */
  function _t(key) {
    var locale = locales[defaults.locale];
    return locale ? locale[key] : locales.en[key];
  }

  function processCallback(e, dialog, callback) {
    e.stopPropagation();
    e.preventDefault();

    // by default we assume a callback will get rid of the dialog,
    // although it is given the opportunity to override this

    // so, if the callback can be invoked and it *explicitly returns false*
    // then we'll set a flag to keep the dialog active...
    var preserveDialog = $.isFunction(callback) && callback.call(dialog, e) === false;

    // ... otherwise we'll bin it
    if (!preserveDialog) {
      dialog.modal("hide");
    }
  }

  function getKeyLength(obj) {
    // @TODO defer to Object.keys(x).length if available?
    var k, t = 0;
    for (k in obj) {
      t ++;
    }
    return t;
  }

  function each(collection, iterator) {
    var index = 0;
    $.each(collection, function(key, value) {
      iterator(key, value, index++);
    });
  }

  function sanitize(options) {
    var buttons;
    var total;

    if (typeof options !== "object") {
      throw new Error("Please supply an object of options");
    }

    if (!options.message) {
      throw new Error("Please specify a message");
    }

    // make sure any supplied options take precedence over defaults
    options = $.extend({}, defaults, options);

    if (!options.buttons) {
      options.buttons = {};
    }

    buttons = options.buttons;

    total = getKeyLength(buttons);

    each(buttons, function(key, button, index) {

      if ($.isFunction(button)) {
        // short form, assume value is our callback. Since button
        // isn't an object it isn't a reference either so re-assign it
        button = buttons[key] = {
          callback: button
        };
      }

      // before any further checks make sure by now button is the correct type
      if ($.type(button) !== "object") {
        throw new Error("button with key " + key + " must be an object");
      }

      if (!button.label) {
        // the lack of an explicit label means we'll assume the key is good enough
        button.label = key;
      }

      if (!button.className) {
        if (total <= 2 && index === total-1) {
          // always add a primary to the main option in a two-button dialog
          button.className = "btn-primary";
        } else {
          button.className = "btn-default";
        }
      }
    });

    return options;
  }

  /**
   * map a flexible set of arguments into a single returned object
   * if args.length is already one just return it, otherwise
   * use the properties argument to map the unnamed args to
   * object properties
   * so in the latter case:
   * mapArguments(["foo", $.noop], ["message", "callback"])
   * -> { message: "foo", callback: $.noop }
   */
  function mapArguments(args, properties) {
    var argn = args.length;
    var options = {};

    if (argn < 1 || argn > 2) {
      throw new Error("Invalid argument length");
    }

    if (argn === 2 || typeof args[0] === "string") {
      options[properties[0]] = args[0];
      options[properties[1]] = args[1];
    } else {
      options = args[0];
    }

    return options;
  }

  /**
   * merge a set of default dialog options with user supplied arguments
   */
  function mergeArguments(defaults, args, properties) {
    return $.extend(
      // deep merge
      true,
      // ensure the target is an empty, unreferenced object
      {},
      // the base options object for this type of dialog (often just buttons)
      defaults,
      // args could be an object or array; if it's an array properties will
      // map it to a proper options object
      mapArguments(
        args,
        properties
      )
    );
  }

  /**
   * this entry-level method makes heavy use of composition to take a simple
   * range of inputs and return valid options suitable for passing to bootbox.dialog
   */
  function mergeDialogOptions(className, labels, properties, args) {
    //  build up a base set of dialog properties
    var baseOptions = {
      className: "bootbox-" + className,
      buttons: createLabels.apply(null, labels)
    };

    // ensure the buttons properties generated, *after* merging
    // with user args are still valid against the supplied labels
    return validateButtons(
      // merge the generated base properties with user supplied arguments
      mergeArguments(
        baseOptions,
        args,
        // if args.length > 1, properties specify how each arg maps to an object key
        properties
      ),
      labels
    );
  }

  /**
   * from a given list of arguments return a suitable object of button labels
   * all this does is normalise the given labels and translate them where possible
   * e.g. "ok", "confirm" -> { ok: "OK, cancel: "Annuleren" }
   */
  function createLabels() {
    var buttons = {};

    for (var i = 0, j = arguments.length; i < j; i++) {
      var argument = arguments[i];
      var key = argument.toLowerCase();
      var value = argument.toUpperCase();

      buttons[key] = {
        label: _t(value)
      };
    }

    return buttons;
  }

  function validateButtons(options, buttons) {
    var allowedButtons = {};
    each(buttons, function(key, value) {
      allowedButtons[value] = true;
    });

    each(options.buttons, function(key) {
      if (allowedButtons[key] === undefined) {
        throw new Error("button key " + key + " is not allowed (options are " + buttons.join("\n") + ")");
      }
    });

    return options;
  }

  exports.alert = function() {
    var options;

    options = mergeDialogOptions("alert", ["ok"], ["message", "callback"], arguments);

    if (options.callback && !$.isFunction(options.callback)) {
      throw new Error("alert requires callback property to be a function when provided");
    }

    /**
     * overrides
     */
    options.buttons.ok.callback = options.onEscape = function() {
      if ($.isFunction(options.callback)) {
        return options.callback.call(this);
      }
      return true;
    };

    return exports.dialog(options);
  };

  exports.confirm = function() {
    var options;

    options = mergeDialogOptions("confirm", ["cancel", "confirm"], ["message", "callback"], arguments);

    /**
     * overrides; undo anything the user tried to set they shouldn't have
     */
    options.buttons.cancel.callback = options.onEscape = function() {
      return options.callback.call(this, false);
    };

    options.buttons.confirm.callback = function() {
      return options.callback.call(this, true);
    };

    // confirm specific validation
    if (!$.isFunction(options.callback)) {
      throw new Error("confirm requires a callback");
    }

    return exports.dialog(options);
  };

  exports.prompt = function() {
    var options;
    var defaults;
    var dialog;
    var form;
    var input;
    var shouldShow;
    var inputOptions;

    // we have to create our form first otherwise
    // its value is undefined when gearing up our options
    // @TODO this could be solved by allowing message to
    // be a function instead...
    form = $(templates.form);

    // prompt defaults are more complex than others in that
    // users can override more defaults
    // @TODO I don't like that prompt has to do a lot of heavy
    // lifting which mergeDialogOptions can *almost* support already
    // just because of 'value' and 'inputType' - can we refactor?
    defaults = {
      className: "bootbox-prompt",
      buttons: createLabels("cancel", "confirm"),
      value: "",
      inputType: "text"
    };

    options = validateButtons(
      mergeArguments(defaults, arguments, ["title", "callback"]),
      ["cancel", "confirm"]
    );

    // capture the user's show value; we always set this to false before
    // spawning the dialog to give us a chance to attach some handlers to
    // it, but we need to make sure we respect a preference not to show it
    shouldShow = (options.show === undefined) ? true : options.show;

    /**
     * overrides; undo anything the user tried to set they shouldn't have
     */
    options.message = form;

    options.buttons.cancel.callback = options.onEscape = function() {
      return options.callback.call(this, null);
    };

    options.buttons.confirm.callback = function() {
      var value;

      switch (options.inputType) {
        case "text":
        case "textarea":
        case "email":
        case "select":
        case "date":
        case "time":
        case "number":
        case "password":
          value = input.val();
          break;

        case "checkbox":
          var checkedItems = input.find("input:checked");

          // we assume that checkboxes are always multiple,
          // hence we default to an empty array
          value = [];

          each(checkedItems, function(_, item) {
            value.push($(item).val());
          });
          break;
      }

      return options.callback.call(this, value);
    };

    options.show = false;

    // prompt specific validation
    if (!options.title) {
      throw new Error("prompt requires a title");
    }

    if (!$.isFunction(options.callback)) {
      throw new Error("prompt requires a callback");
    }

    if (!templates.inputs[options.inputType]) {
      throw new Error("invalid prompt type");
    }

    // create the input based on the supplied type
    input = $(templates.inputs[options.inputType]);

    switch (options.inputType) {
      case "text":
      case "textarea":
      case "email":
      case "date":
      case "time":
      case "number":
      case "password":
        input.val(options.value);
        break;

      case "select":
        var groups = {};
        inputOptions = options.inputOptions || [];

        if (!$.isArray(inputOptions)) {
          throw new Error("Please pass an array of input options");
        }

        if (!inputOptions.length) {
          throw new Error("prompt with select requires options");
        }

        each(inputOptions, function(_, option) {

          // assume the element to attach to is the input...
          var elem = input;

          if (option.value === undefined || option.text === undefined) {
            throw new Error("given options in wrong format");
          }

          // ... but override that element if this option sits in a group

          if (option.group) {
            // initialise group if necessary
            if (!groups[option.group]) {
              groups[option.group] = $("<optgroup/>").attr("label", option.group);
            }

            elem = groups[option.group];
          }

          elem.append("<option value='" + option.value + "'>" + option.text + "</option>");
        });

        each(groups, function(_, group) {
          input.append(group);
        });

        // safe to set a select's value as per a normal input
        input.val(options.value);
        break;

      case "checkbox":
        var values   = $.isArray(options.value) ? options.value : [options.value];
        inputOptions = options.inputOptions || [];

        if (!inputOptions.length) {
          throw new Error("prompt with checkbox requires options");
        }

        if (!inputOptions[0].value || !inputOptions[0].text) {
          throw new Error("given options in wrong format");
        }

        // checkboxes have to nest within a containing element, so
        // they break the rules a bit and we end up re-assigning
        // our 'input' element to this container instead
        input = $("<div/>");

        each(inputOptions, function(_, option) {
          var checkbox = $(templates.inputs[options.inputType]);

          checkbox.find("input").attr("value", option.value);
          checkbox.find("label").append(option.text);

          // we've ensured values is an array so we can always iterate over it
          each(values, function(_, value) {
            if (value === option.value) {
              checkbox.find("input").prop("checked", true);
            }
          });

          input.append(checkbox);
        });
        break;
    }

    // @TODO provide an attributes option instead
    // and simply map that as keys: vals
    if (options.placeholder) {
      input.attr("placeholder", options.placeholder);
    }

    if (options.pattern) {
      input.attr("pattern", options.pattern);
    }

    if (options.maxlength) {
      input.attr("maxlength", options.maxlength);
    }

    // now place it in our form
    form.append(input);

    form.on("submit", function(e) {
      e.preventDefault();
      // Fix for SammyJS (or similar JS routing library) hijacking the form post.
      e.stopPropagation();
      // @TODO can we actually click *the* button object instead?
      // e.g. buttons.confirm.click() or similar
      dialog.find(".btn-primary").click();
    });

    dialog = exports.dialog(options);

    // clear the existing handler focusing the submit button...
    dialog.off("shown.bs.modal");

    // ...and replace it with one focusing our input, if possible
    dialog.on("shown.bs.modal", function() {
      // need the closure here since input isn't
      // an object otherwise
      input.focus();
    });

    if (shouldShow === true) {
      dialog.modal("show");
    }

    return dialog;
  };

  exports.dialog = function(options) {
    options = sanitize(options);

    var dialog = $(templates.dialog);
    var innerDialog = dialog.find(".modal-dialog");
    var body = dialog.find(".modal-body");
    var buttons = options.buttons;
    var buttonStr = "";
    var callbacks = {
      onEscape: options.onEscape
    };

    if ($.fn.modal === undefined) {
      throw new Error(
        "$.fn.modal is not defined; please double check you have included " +
        "the Bootstrap JavaScript library. See http://getbootstrap.com/javascript/ " +
        "for more details."
      );
    }

    each(buttons, function(key, button) {

      // @TODO I don't like this string appending to itself; bit dirty. Needs reworking
      // can we just build up button elements instead? slower but neater. Then button
      // can just become a template too
      buttonStr += "<button data-bb-handler='" + key + "' type='button' class='btn " + button.className + "'>" + button.label + "</button>";
      callbacks[key] = button.callback;
    });

    body.find(".bootbox-body").html(options.message);

    if (options.animate === true) {
      dialog.addClass("fade");
    }

    if (options.className) {
      dialog.addClass(options.className);
    }

    if (options.size === "large") {
      innerDialog.addClass("modal-lg");
    } else if (options.size === "small") {
      innerDialog.addClass("modal-sm");
    }

    if (options.title) {
      body.before(templates.header);
    }

    if (options.closeButton) {
      var closeButton = $(templates.closeButton);

      if (options.title) {
        dialog.find(".modal-header").prepend(closeButton);
      } else {
        closeButton.css("margin-top", "-10px").prependTo(body);
      }
    }

    if (options.title) {
      dialog.find(".modal-title").html(options.title);
    }

    if (buttonStr.length) {
      body.after(templates.footer);
      dialog.find(".modal-footer").html(buttonStr);
    }


    /**
     * Bootstrap event listeners; used handle extra
     * setup & teardown required after the underlying
     * modal has performed certain actions
     */

    dialog.on("hidden.bs.modal", function(e) {
      // ensure we don't accidentally intercept hidden events triggered
      // by children of the current dialog. We shouldn't anymore now BS
      // namespaces its events; but still worth doing
      if (e.target === this) {
        dialog.remove();
      }
    });

    /*
    dialog.on("show.bs.modal", function() {
      // sadly this doesn't work; show is called *just* before
      // the backdrop is added so we'd need a setTimeout hack or
      // otherwise... leaving in as would be nice
      if (options.backdrop) {
        dialog.next(".modal-backdrop").addClass("bootbox-backdrop");
      }
    });
    */

    dialog.on("shown.bs.modal", function() {
      dialog.find(".btn-primary:first").focus();
    });

    /**
     * Bootbox event listeners; experimental and may not last
     * just an attempt to decouple some behaviours from their
     * respective triggers
     */

    if (options.backdrop !== "static") {
      // A boolean true/false according to the Bootstrap docs
      // should show a dialog the user can dismiss by clicking on
      // the background.
      // We always only ever pass static/false to the actual
      // $.modal function because with `true` we can't trap
      // this event (the .modal-backdrop swallows it)
      // However, we still want to sort of respect true
      // and invoke the escape mechanism instead
      dialog.on("click.dismiss.bs.modal", function(e) {
        // @NOTE: the target varies in >= 3.3.x releases since the modal backdrop
        // moved *inside* the outer dialog rather than *alongside* it
        if (dialog.children(".modal-backdrop").length) {
          e.currentTarget = dialog.children(".modal-backdrop").get(0);
        }

        if (e.target !== e.currentTarget) {
          return;
        }

        dialog.trigger("escape.close.bb");
      });
    }

    dialog.on("escape.close.bb", function(e) {
      if (callbacks.onEscape) {
        processCallback(e, dialog, callbacks.onEscape);
      }
    });

    /**
     * Standard jQuery event listeners; used to handle user
     * interaction with our dialog
     */

    dialog.on("click", ".modal-footer button", function(e) {
      var callbackKey = $(this).data("bb-handler");

      processCallback(e, dialog, callbacks[callbackKey]);
    });

    dialog.on("click", ".bootbox-close-button", function(e) {
      // onEscape might be falsy but that's fine; the fact is
      // if the user has managed to click the close button we
      // have to close the dialog, callback or not
      processCallback(e, dialog, callbacks.onEscape);
    });

    dialog.on("keyup", function(e) {
      if (e.which === 27) {
        dialog.trigger("escape.close.bb");
      }
    });

    // the remainder of this method simply deals with adding our
    // dialogent to the DOM, augmenting it with Bootstrap's modal
    // functionality and then giving the resulting object back
    // to our caller

    $(options.container).append(dialog);

    dialog.modal({
      backdrop: options.backdrop ? "static": false,
      keyboard: false,
      show: false
    });

    if (options.show) {
      dialog.modal("show");
    }

    // @TODO should we return the raw element here or should
    // we wrap it in an object on which we can expose some neater
    // methods, e.g. var d = bootbox.alert(); d.hide(); instead
    // of d.modal("hide");

   /*
    function BBDialog(elem) {
      this.elem = elem;
    }

    BBDialog.prototype = {
      hide: function() {
        return this.elem.modal("hide");
      },
      show: function() {
        return this.elem.modal("show");
      }
    };
    */

    return dialog;

  };

  exports.setDefaults = function() {
    var values = {};

    if (arguments.length === 2) {
      // allow passing of single key/value...
      values[arguments[0]] = arguments[1];
    } else {
      // ... and as an object too
      values = arguments[0];
    }

    $.extend(defaults, values);
  };

  exports.hideAll = function() {
    $(".bootbox").modal("hide");

    return exports;
  };


  /**
   * standard locales. Please add more according to ISO 639-1 standard. Multiple language variants are
   * unlikely to be required. If this gets too large it can be split out into separate JS files.
   */
  var locales = {
    bg_BG : {
      OK      : "Ок",
      CANCEL  : "Отказ",
      CONFIRM : "Потвърждавам"
    },
    br : {
      OK      : "OK",
      CANCEL  : "Cancelar",
      CONFIRM : "Sim"
    },
    cs : {
      OK      : "OK",
      CANCEL  : "Zrušit",
      CONFIRM : "Potvrdit"
    },
    da : {
      OK      : "OK",
      CANCEL  : "Annuller",
      CONFIRM : "Accepter"
    },
    de : {
      OK      : "OK",
      CANCEL  : "Abbrechen",
      CONFIRM : "Akzeptieren"
    },
    el : {
      OK      : "Εντάξει",
      CANCEL  : "Ακύρωση",
      CONFIRM : "Επιβεβαίωση"
    },
    en : {
      OK      : "OK",
      CANCEL  : "Cancel",
      CONFIRM : "OK"
    },
    es : {
      OK      : "OK",
      CANCEL  : "Cancelar",
      CONFIRM : "Aceptar"
    },
    et : {
      OK      : "OK",
      CANCEL  : "Katkesta",
      CONFIRM : "OK"
    },
    fa : {
      OK      : "قبول",
      CANCEL  : "لغو",
      CONFIRM : "تایید"
    },
    fi : {
      OK      : "OK",
      CANCEL  : "Peruuta",
      CONFIRM : "OK"
    },
    fr : {
      OK      : "OK",
      CANCEL  : "Annuler",
      CONFIRM : "D'accord"
    },
    he : {
      OK      : "אישור",
      CANCEL  : "ביטול",
      CONFIRM : "אישור"
    },
    hu : {
      OK      : "OK",
      CANCEL  : "Mégsem",
      CONFIRM : "Megerősít"
    },
    hr : {
      OK      : "OK",
      CANCEL  : "Odustani",
      CONFIRM : "Potvrdi"
    },
    id : {
      OK      : "OK",
      CANCEL  : "Batal",
      CONFIRM : "OK"
    },
    it : {
      OK      : "OK",
      CANCEL  : "Annulla",
      CONFIRM : "Conferma"
    },
    ja : {
      OK      : "OK",
      CANCEL  : "キャンセル",
      CONFIRM : "確認"
    },
    lt : {
      OK      : "Gerai",
      CANCEL  : "Atšaukti",
      CONFIRM : "Patvirtinti"
    },
    lv : {
      OK      : "Labi",
      CANCEL  : "Atcelt",
      CONFIRM : "Apstiprināt"
    },
    nl : {
      OK      : "OK",
      CANCEL  : "Annuleren",
      CONFIRM : "Accepteren"
    },
    no : {
      OK      : "OK",
      CANCEL  : "Avbryt",
      CONFIRM : "OK"
    },
    pl : {
      OK      : "OK",
      CANCEL  : "Anuluj",
      CONFIRM : "Potwierdź"
    },
    pt : {
      OK      : "OK",
      CANCEL  : "Cancelar",
      CONFIRM : "Confirmar"
    },
    ru : {
      OK      : "OK",
      CANCEL  : "Отмена",
      CONFIRM : "Применить"
    },
    sq : {
      OK : "OK",
      CANCEL : "Anulo",
      CONFIRM : "Prano"
    },
    sv : {
      OK      : "OK",
      CANCEL  : "Avbryt",
      CONFIRM : "OK"
    },
    th : {
      OK      : "ตกลง",
      CANCEL  : "ยกเลิก",
      CONFIRM : "ยืนยัน"
    },
    tr : {
      OK      : "Tamam",
      CANCEL  : "İptal",
      CONFIRM : "Onayla"
    },
    zh_CN : {
      OK      : "OK",
      CANCEL  : "取消",
      CONFIRM : "确认"
    },
    zh_TW : {
      OK      : "OK",
      CANCEL  : "取消",
      CONFIRM : "確認"
    }
  };

  exports.addLocale = function(name, values) {
    $.each(["OK", "CANCEL", "CONFIRM"], function(_, v) {
      if (!values[v]) {
        throw new Error("Please supply a translation for '" + v + "'");
      }
    });

    locales[name] = {
      OK: values.OK,
      CANCEL: values.CANCEL,
      CONFIRM: values.CONFIRM
    };

    return exports;
  };

  exports.removeLocale = function(name) {
    delete locales[name];

    return exports;
  };

  exports.setLocale = function(name) {
    return exports.setDefaults("locale", name);
  };

  exports.init = function(_$) {
    return init(_$ || $);
  };

  return exports;
}));

///#source 1 1 /JavaScript-Mvc-framework/Prototype/Array.js
Array.prototype.isEqual = function (array) {
    /// <summary>
    /// Returns bool based on if both array contains same items.
    /// </summary>
    /// <param name="array" type="type">Array list</param>
    /// <returns type="">Returns true/false based if both of those array are same or not. If not same then false. If both empty then also return true.</returns>
    "use strict";
    
    var isEmpty = this.length === 0;
    var arrayIsEmpty = array === undefined || array === null || array.length === 0;
    if (isEmpty === arrayIsEmpty && isEmpty === true) {
        return true;
    } else {
        if (this.length !== array.length) {
            return false;
        } else {
            // length is same , now loop through
            for (var i = 0; i < this.length; i++) {
                if (this[i] !== array[i]) {
                    return false;
                }
            }
            return true; // both arrays are same.
        }
    }
};

Array.prototype.getDifferentIndexes = function (array) {
    /// <summary>
    /// Returns array of indexes which are different between two arrays.
    /// </summary>
    /// <param name="array" type="type">Must pass same length array. Otherwise exception will be thrown.</param>
    /// <returns type="">Return an array of indexes  which are different between two arrays</returns>
    "use strict";
    var isEmpty = this.length === 0;
    var arrayIsEmpty = array === undefined || array === null || array.length === 0;
    if (isEmpty === arrayIsEmpty && isEmpty !== false) {
        return [];
    } else {
        var results = [];
        if (this.length !== array.length) {
            throw new Error("Array indexes are not same.");
        } else {
            // length is same , now loop through
            for (var i = 0; i < this.length; i++) {
                if (this[i] !== array[i]) {
                    results.push(i);
                }
            }
            return results; 
        }
    }
};
///#source 1 1 /JavaScript-Mvc-framework/jQueryCaching.js
/// <reference path="devOrg.js" />
/// <reference path="initialize.js" />
/// <reference path="jQueryExtend.js" />
/// <reference path="jsonCombo.js" />
/// <reference path="regularExp.js" />
/// <reference path="selectors.js" />
/// <reference path="upload.js" />
/// <reference path="urls.js" />
/// <reference path="country-phone.js" />
/// <reference path="constants.js" />
/// <reference path="byId.js" />
/// <reference path="../jQuery/jquery-2.1.4.js" />
/// <reference path="../jQuery/jquery-2.1.4-vsdoc.js" />
/// <reference path="schema/hashset.js" />
;
$.jQueryCaching = {
    hashset: null,
    /**
     * 
     * @param {} capacity  : default is 350
     * @returns {} 
     */
    initialize: function (capacity, force) {
        var hashset = $.app.schema.hashset;

        if (!capacity) {
            capacity = 350;
        }
        var self = $.jQueryCaching;
        if (self.hashset === null || force === true) {
            self.hashset = hashset.create(capacity);
        }
    }
}

$.findCached = function (selector, force) {
    /// <summary>
    /// get jquery searched items, if exist in the 
    /// </summary>
    /// <param name="selector" type="type"></param>
    var self = $.jQueryCaching;
    var $e;
    if (force === true) {
        $e = $(selector);
        self.hashset.addUnique(selector, $e, true);
        return $e;
    } else {
        var item = self.hashset.getItemObject(selector);
        if (item === null) {
            $e = $(selector);
            self.hashset.addUnique(selector, $e, true);
            return $e;
        }
        return item.value;
    }
}
$.findCachedId = function (id, force) {
    /// <summary>
    /// get jquery searched items, if exist in the 
    /// </summary>
    /// <param name="selector" type="type"></param>
    var self = $.jQueryCaching;
    var $e;
    if (force === true) {
        $e = $.byId(id);
        self.hashset.addUnique(id, $e, true);
        return $e;
    } else {
        var item = self.hashset.getItemObject(id);
        if (item === null) {
            $e = $.byId(id);
            self.hashset.addUnique(id, $e, true);
            return $e;
        }
        return item.value;
    }
}
///#source 1 1 /JavaScript-Mvc-framework/app.js
/// <reference path="libs/jQuery/jquery-2.2.3.js" />
/// <reference path="libs/jQuery/jquery-2.2.3.intellisense.js" />
/// <reference path="byId.js" />
/// <reference path="schema/schema.js" />
/// <reference path="schema/hashset.js" />
/// <reference path="schema/url.js" />
/// <reference path="extensions/constants.js" />
/// <reference path="extensions/selectors.js" />

/*
 * JavaScript Mvc framework.
 * Version                      : 2.0
 * Last Modified                : 19 Jun 2016  
 * 
 * Copyright (c) Md. Alim Ul Karim
 * Source Code Available at     : https://github.com/aukgit/JavaScript-MVC-Framework
 * Linkedin profile             : https://bd.linkedin.com/in/alimkarim
 * Facebook profile             : https://fb.com/alim.karim
 * Available under MIT license  : https://opensource.org/licenses/MIT
 * Facebook Page                : https://www.facebook.com/DevelopersOrganism
 * Mail to                      : info{at}developers-organism.com
 * Download                     : https://github.com/aukgit/JavaScript-MVC-Framework/archive/master.zip
 * 
 * JavaScript Mvc framework works with convention :
 * JavaScript Framework how it is implemented :  http://bit.ly/1KdWSHD | http://bit.ly/1KdX0qq 
 */


; $.app = $.app || {};
$.app = {
    isDebugging: true,
    getProcessForm: function () {
        /// <summary>
        /// Get the processing form.
        /// </summary>
        var app = $.app,
              selectors = app.selectors,
              ids = selectors.ids,
              $processForm = $.findCachedId(ids.processForm);

        return $processForm;
    }
};
///#source 1 1 /JavaScript-Mvc-framework/app/app.config.js
/// <reference path="extensions/hiddenContainer.js" />
; $.app = $.app || {};
; $.app.config = {
    /**
     * app configuration settings.
     * Runs before initializing everything.
     * 
     */
    setup: function() {
        /// <summary>
        /// Setup all configuration.
        /// </summary>
        var app = $.app;
        var classesToCallInitialize = [
            app.hiddenContainer,
            app.spinner,
            $.jQueryCaching,
            $.app.component
        ];
        $.executeArrayOfInitilizeMethods(classesToCallInitialize);

        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            options.async = true;
        });
    }
};
///#source 1 1 /JavaScript-Mvc-framework/app/app.executeAfter.js
/// <reference path="byId.js" />
/// <reference path="app.global.js" />
; $.app = $.app || {};
/**
 * method which runs after all the initialization is done.
 */
$.app.executeAfter = {
    /**
     * method which runs after all the initialization is done.
     * @returns {} 
     */
    documentSpinnerHide: function () {
        $.app.global.documentFullSpinnerHide();
        var timer = setTimeout(function () {
            $.app.global.documentFullSpinnerHide();
            clearTimeout(timer);
        }, 2500);
    },
    /**
     * bind anchor click prevention 
     * @returns {} 
     */
    captureAnchorAndShowSpinner: function () {
        var $anchors = $.findCached("a:link");
        $anchors.click(function (e) {
            var $link = $(this),
                href = $link.attr("href");
            if (!$.isEmpty(href)) {
                var startsWith = href[0];
                var isInvalidUrl = href === "" || startsWith === "" || startsWith === "#" || href.indexOf("javascript") > -1;
                if (!isInvalidUrl) {
                    e.preventDefault();
                    $.app.global.documentFullSpinnerShow("...Please Wait...");
                    window.location = $link.attr("href");
                }
            }
        });
    },
    
};
///#source 1 1 /JavaScript-Mvc-framework/app/app.executeBefore.js
/// <reference path="byId.js" />
/// <reference path="D:\Working (SSD)\GitHub\WereViewProject\WereViewApp\Content/Scripts/toastr.js" />
/// <reference path="D:\Working (SSD)\GitHub\WereViewProject\WereViewApp\Content/Scripts/jquery-2.1.4.js" />
/// <reference path="D:\Working (SSD)\GitHub\WereViewProject\WereViewApp\Content/Scripts/jquery.blockUI.js" />
/// <reference path="D:\Working (SSD)\GitHub\WereViewProject\WereViewApp\Content/Scripts/jquery-2.1.4.intellisense.js" />
; $.app = $.app || {};
/**
* runs all the methods after initialize method.
*/
$.app.executeBefore = {
    /**
     * runs all the methods after initialize method.
     */
    toasterComponentSetup: function () {
        if (!$.isEmpty(toastr)) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-bottom-left",
                "preventDuplicates": true,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
        }
    },
    dynamicDependedCombo: function () {
        // load dynamic and depended select or combo
        var $selectPickers = $(".selectpicker");
        if ($selectPickers.length > 0) {
            $.devOrg.dynamicSelect.initialize();
            $selectPickers.selectpicker();
            $.devOrg.bootstrapComboSelectIndex($selectPickers, 0);
        }
    },
    elasticTextAreas: function () {
        var $textAreas = $("textarea");
        if ($textAreas.length > 0) {
            $textAreas.filter(".big-multiline").focus(function () {
                $(this).animate({ 'height': '300px', 'width': '630px', 'max-width': '630px' }, 400);
            }).blur(function () {
                $(this).animate({ 'height': 'auto', 'width': '294px', 'max-width': '294px' }, 400);
            });
            //making textarea's elastic
            $textAreas.elastic().trigger('update');
        }

    },
    toolTipShow: function () {
        var $tooltipItems = $('.tooltip-show');
        if ($tooltipItems.length > 0) {
            $tooltipItems.tooltip({ container: 'body' });
        }

    },
    seoHide: function () {
        var $seoHideItems = $(".seo-hide");
        if ($seoHideItems.length > 0) {
            $seoHideItems.hide();
        }
    },
    menuEnable: function () {
        $().jetmenu();
        var $menuPage = $("#menu-item-edit-page");
        if ($menuPage.length > 0) {
            var $div = $("#hasDropdownDiv"),
                $hasDropDown = $("#HasDropDown");
            $div.hide();
            $hasDropDown.click(function () {
                if (this.checked) {
                    $div.show('slow');
                } else {
                    $div.hide('slow');
                }
            });
        }
    },
    bootstrapTableComponentEnable: function () {
        var $tables = $(".bootstrap-table-do");
        if ($tables.length > 0) {
            $tables.bootstrapTable();
        }
    },
    datePickerComponentEnable: function () {
        var $dateTimePicker = $(".datetimepicker-start"),
            options = {
                pickDate: true, //en/disables the date picker
                pickTime: true, //en/disables the time picker
                useMinutes: true, //en/disables the minutes picker
                useSeconds: true, //en/disables the seconds picker
                useCurrent: true, //when true, picker will set the value to the current date/time     
                minuteStepping: 1, //set the minute stepping
                defaultDate: "", //sets a default date, accepts js dates, strings and moment objects
                disabledDates: [], //an array of dates that cannot be selected
                enabledDates: [], //an array of dates that can be selected
                sideBySide: true //show the date and time picker side by side
            };
        if ($dateTimePicker.length > 0) {
            $dateTimePicker.datetimepicker(options);
        }
        var $datePicker = $(".datepicker-start");
        if ($datePicker.length > 0) {
            options.pickTime = false;
            options.useMinutes = false;
            options.useSeconds = false;
            $datePicker.datetimepicker(options);
        }
    },
    transactionStatusEnable: function () {
        var $transaction = $("#transaction-container"),
            hideTimeOut = 0;
        if ($transaction.length !== 0) {
            if ($transaction.length > 0) {
                hideTimeOut = parseInt($($transaction[0]).attr("data-hide-duration"));
            }

            var hideStatus = function () {
                $transaction.each(function (index) {
                    var $this = $(this);
                    $this.attr("data-shown", "true")
                        .hide(500);
                });
            };
            var timer = setTimeout(hideStatus, hideTimeOut);

            var stopTimer = function () {
                clearTimeout(timer);
            }

            $transaction.click(function () {
                stopTimer();
                hideStatus();
            });
        }
    },

  

    ratingComponentEnable: function () {
        var $frontPageRatings = $.findCached(".rating-5-front");
        if ($frontPageRatings.length > 0) {
            $frontPageRatings.rating({
                showClear: false,
                showCaption: false
            });
        }

        var $detailPageRatingDisplayItems = $.findCached(".rating-5-page-details");
        if ($detailPageRatingDisplayItems.length > 0) {
            $detailPageRatingDisplayItems.rating({
                showClear: false,
                showCaption: true,
                starCaptions: {
                    0: "0",
                    0.5: "0.5",
                    1: "1",
                    1.5: "1.5",
                    2: "2",
                    2.5: "2.5",
                    3: "3",
                    3.5: "3.5",
                    4: "4",
                    4.5: "4.5",
                    5: "5"
                },
                starCaptionClasses: {
                    0: 'label label-danger',
                    0.5: 'label label-danger',
                    1: 'label label-danger',
                    1.5: 'label label-warning',
                    2: 'label label-warning',
                    2.5: 'label label-info',
                    3: 'label label-info',
                    3.5: 'label label-primary',
                    4: 'label label-primary',
                    4.5: 'label label-success',
                    5: 'label label-success'
                }
            });
        }
    },
};
///#source 1 1 /JavaScript-Mvc-framework/app/app.global.js
; $.app = $.app || {};
$.app.global = {
    /**
     * global methods collection 
     * execute methods as per necessary, 
     * ** these methods will NOT run automatically. **
     */
    prop: {

    },
    documentFullSpinnerHide: function () {
        var self = $.app.global,
            $bodyStart = $.findCachedId("body-start"),
            fixedClass = "body-fixed",
            flexible = "body-flexible";

        if ($bodyStart.length > 0) {
            if ($bodyStart.hasClass(fixedClass)) {
                var $loadingBar = $.findCachedId("loading-bar-full-screen");
                $bodyStart.removeClass(fixedClass).addClass(flexible);
                $loadingBar.addClass("animated").removeClass("fadeIn").addClass("fadeOut");
                setTimeout(function () {
                    $loadingBar.hide();
                    $bodyStart.removeClass(fixedClass).addClass(flexible);
                }, 1500);
            }
        }
    },
    enterToNextInputFocus: function ($form, submitAtLast, atLastFocusOnFirst) {
        /// <summary>
        /// Focus to next input if it was visible.
        /// </summary>
        /// <param name="$form" type="type"></param>
        /// <param name="submitAtLast" type="type"></param>
        /// <param name="atLastFocusOnFirst" type="type"></param>
        $form.find("input:text:first-child").focus();

        //var binders = formSelector + " input[type='text']:visible," +
        //    formSelector + " input[type='password']:visible," +
        //    formSelector + " input[type='numeric']:visible," +
        //    formSelector + " input[type='email']:visible," +
        //    //formSelector + " textarea:visible," +
        //    formSelector + " button.selectpicker[type='button']:visible," +
        //    formSelector + " select:visible";
        var binders = "input[type='text']:visible," +
                     "input[type='password']:visible," +
                     "input[type='numeric']:visible," +
                     "input[type='email']:visible," +
                    //formSelector + " textarea:visible," +
                     "button.selectpicker[type='button']:visible," +
                     "select:visible";
        $form.on("keypress", binders, function (e) {
            // var codeAbove = d.keyCode || d.which;
            // console.log("above code :" + codeAbove);
            var code = e.keyCode || e.which;
            // console.log("inside code :" + code);
            if (code === 13) { // Enter key
                e.preventDefault(); // Skip default behavior of the enter key
                var $elements = $form.find(binders);
                //console.log($elements);
                var n = $elements.length;
                var nextIndex = $elements.index(this) + 1;
                if (nextIndex < n) {
                    $elements[nextIndex].focus();
                } else {
                    $elements[nextIndex - 1].blur();
                    if (submitAtLast === true) {
                        $form.submit();
                    } else if (atLastFocusOnFirst === true) {
                        $elements[0].focus();
                    }
                }
            }
        });
    },
    enterToNextInputFocusWithoutTags: function ($form, submitAtLast, isDynamicSelector, atLastFocusOnFirst) {
        $form.find("input:text:first-child").focus();
        var binders = "input[type='text']:visible," +
                     "input[type='password']:visible," +
                     "input[type='numeric']:visible," +
                     "input[type='email']:visible," +
                     "input[type='text']:not(.bootstrap-tagsinput)," +
                    //formSelector + " textarea:visible," +
                     "button.selectpicker[type='button']:visible," +
                     "select:visible";
        var $elements = [];
        var keyPressEvent = function (e) {
            // var codeAbove = d.keyCode || d.which;
            // console.log("above code :" + codeAbove);
            var code = e.keyCode || e.which;
            // console.log("inside code :" + code);
            if (code === 13) { // Enter key
                e.preventDefault(); // Skip default behavior of the enter key
                if (isDynamicSelector === true || $elements.length === 0) {
                    $elements = $form.find(binders);
                }
                //console.log($elements);
                var n = $elements.length;
                var nextIndex = $elements.index(this) + 1;
                if (nextIndex < n) {
                    $elements[nextIndex].focus();
                } else {
                    $elements[nextIndex - 1].blur();
                    if (submitAtLast === true) {
                        $form.submit();
                    } else if (atLastFocusOnFirst === true) {
                        $elements[0].focus();
                    }
                }
            }
        };
        if (isDynamicSelector) {
            $form.on("keypress", binders, keyPressEvent);
        } else {
            var $inputs = $form.find(binders);
            $inputs.on('keypress', keyPressEvent);
        }
    },
    documentFullSpinnerShow: function (message) {
        var $bodyStart = $.findCachedId("body-start");
        var fixedClass = "body-fixed";
        var flexible = "body-flexible";
        if (!message) {
            message = "...Please wait...";
        }
        if ($bodyStart.length > 0) {
            var $content = $.findCachedId("full-screen-spinner-content");
            var $loadingBar = $.findCachedId("loading-bar-full-screen");
            $bodyStart.removeClass(flexible).addClass(fixedClass);
            $content.html(message);
            $loadingBar.addClass("animated").removeClass("fadeOut").addClass("fadeIn");
            $loadingBar.show();
        }
    },

    isGivenUrlMatchedDomain: function (url, domain) {
        var regex = new RegExp("^(?:https:\/\/|http:\/\/)*(www\.)*(?:" + domain + ")+(\/)?", "ig");
        var found = url.match(regex);
        return !$.isEmpty(found) && found.length === 1;
    }


};
///#source 1 1 /JavaScript-Mvc-framework/app/attachInitialize.js
/// <reference path="app.js" />
/// <reference path="byId.js" />
/// <reference path="jQueryExtend.js" />
/// <reference path="jQueryExtend.fn.js" />
/// <reference path="D:\Working (SSD)\GitHub\WereViewProject\WereViewApp\Content/Scripts/jquery-2.1.4.js" />

/**
 * Attach and initial method with the class and execute the method.
 * @param {} $object : attach a initial method to excute all the methods inside that class.
 * @param {} force : if force then it will attach the initial method and execute if exist or not.
 * @returns {} 
 */
$.attachInitialize = function ($object, force) {
    /// <summary>
    /// Attach a initializer method which will call all the other method except for initialize.
    /// </summary>
    /// <param name="$object" type="type">Json object</param>
    /// <param name="force" type="type">Force to add this new method.</param>
    var name = "initialize";

    var initMethod = function () {
        var self = $object;
        var keys = Object.keys(self);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key !== name) {
                // execute all other than "initialize" method
                var functionsOrMethods = self[key];
                $.executeFunction(functionsOrMethods); // execute only if it is function.
            }
        }
    }
    if (!$.isEmpty($object)) {
        var initialize = $object[name];
        if (force === true) {
            $object[name] = initMethod;
        } else if ($.isEmpty(initialize)) {
            $object[name] = initMethod;
        }
    }
}

$.attachAndExecuteInitialize = function($object, force) {
    var name = "initialize";
    $.attachInitialize($object, force);
    $object[name].apply();
};

/**
 * Attach initialize methods to array of elements.
 * @param {} array of json classes
 * @param {} force 
 * @returns {} 
 */
$.attachInitializeToArray = function (array, force) {
    /// <summary>
    /// Attach a initializer method which will call all the other method except for initialize.
    /// </summary>
    /// <param name="$object" type="type">Json object</param>
    /// <param name="force" type="type">Force to add this new method.</param>\
    if (!$.isEmpty(array)) {
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            $.attachInitialize(element, force);
        }
    }

}

/**
 * Attach initialize methods to array of elements and then execute the initialize method.
 * @param {} array of json classes
 * @param {} force 
 * @returns {} 
 */
$.attachInitializeToArrayAndExecute = function (array, force) {
    /// <summary>
    /// Attach a initializer method which will call all the other method except for initialize.
    /// </summary>
    /// <param name="$object" type="type">Json object</param>
    /// <param name="force" type="type">Force to add this new method.</param>
    var name = "initialize";
    if (!$.isEmpty(array)) {
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            $.attachInitialize(element, force);
            element[name].apply();
        }
    }
}

/**
 * excute initialize methods from the array of elements.
 * @param {} array of json classes
 * @param {} force 
 * @returns {} 
 */
$.executeArrayOfInitilizeMethods = function (array) {
    /// <summary>
    /// Attach a initializer method which will call all the other method except for initialize.
    /// </summary>
    /// <param name="$object" type="type">Json object</param>
    /// <param name="force" type="type">Force to add this new method.</param>
    var name = "initialize";
    if (!$.isEmpty(array)) {
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            element[name].apply();
        }
    }
}

///#source 1 1 /JavaScript-Mvc-framework/app/component.js
/**
 * Only initialize components if it has "Component-Enable" named Hidden 
 */
; $.app.component = {
    id: "Component-Enable",
    /**
     * 
     * @returns {} 
     */
    initialize: function () {
        var self = $.app.component,
            id = self.id,
            listOfComponents = self.list, // list of components function resides inside the  component.list.js file.
            //load = self.load,
            $field = $.byId(id),
            extractComponentNameAndParameters = function (componentStringName) {
                /// <summary>
                /// extract component name and parameters
                /// </summary>
                /// <param name="componentStringName" type="type">component(param1,param2)</param>
                /// <returns type="">returns {name:"componentName", parameters: []}</returns>
                var result = {
                    name: "",
                    parameters: []
                };
                var parameterStartingIndex = componentStringName.indexOf("(");
                if (parameterStartingIndex === -1) {
                    // no parameters found
                    result.name = componentStringName;
                } else {
                    result.name = componentStringName.substr(0, parameterStartingIndex);
                    var len = componentStringName.length - parameterStartingIndex - 1 - 1; // -1 more for removing the last parentthesis
                    var paramsString = componentStringName.substr(parameterStartingIndex + 1, len);
                    result.parameters = paramsString.split(",");
                    for (var j = 0; j < result.parameters.length; j++) {
                        var param = result.parameters[j];
                        var captionFoundIndex = param.indexOf(":");
                        if (captionFoundIndex > - 1) {
                            // caption exist
                            len = param.length - 1 - captionFoundIndex;
                            // removing caption
                            result.parameters[j] = param.substr(captionFoundIndex + 1, len);
                        }
                    }
                }
                return result;
            };

        if ($field.length > 0) {
            // If separator is changed then must change the separator in the htmlhelper ComponentsEnableFor method.
            var seperator = "|";
            var loadingComponents = $field.val().split(seperator),
                executeFunction = $.executeFunction,
                executeFunctionWithArguments = $.executeFunctionWithArguments; // list of components to load.
            for (var i = 0; i < loadingComponents.length; i++) {
                var componentNameParam = loadingComponents[i];
                componentNameParam = extractComponentNameAndParameters(componentNameParam);
                var component = listOfComponents[componentNameParam.name];
                if (componentNameParam.parameters.length > 0) {
                    executeFunctionWithArguments(component, componentNameParam.parameters);
                } else {
                    executeFunction(component);
                }
            }
        }
    },
};
///#source 1 1 /JavaScript-Mvc-framework/app/controllers.js
/// <reference path="../find-byId.js" />
/// <reference path="../jquery-2.1.4-vsdoc.js" />
/// <reference path="../application-js/jQueryExtend.js" />
/// <reference path="../application-js/app.initialize.js" />
/// <reference path="../application-js/app.js" />
/// <reference path="../application-js/app.run.js" />
/// <reference path="controllers.js" />
/// <reference path="../detect-browser.js" />
/// <reference path="initialize.js" />
/// <reference path="programsearch.js" />
//; $.app = $.app || {};
$.app.controllers = {
    // any thing related to controllers.
    isCurrentPage: function (controllerExtendedTypeObject) {
        /// <summary>
        /// Returns true/false if the page is executable or not.
        /// </summary>
        /// <param name="controllerExtendedTypeObject">Controller extended object , which must have pageId, $pageElement prop</param>
        /// <returns type=""></returns>
        var pageId = controllerExtendedTypeObject.pageId,
            $page = $.app.controllers.getPage(controllerExtendedTypeObject);
        controllerExtendedTypeObject.$pageElement = $.byId(pageId);
        $page = controllerExtendedTypeObject.$pageElement;
        return !$.isEmpty($page);
    },
    getPage: function (controllerExtendedTypeObject) {
        return controllerExtendedTypeObject.$pageElement;
    },
    getPageActionName: function (controllerExtendedTypeObject) {
        /// <summary>
        /// Get which mvc action it is referring to.
        /// </summary>
        /// <param name="controllerExtendedTypeObject"></param>
        /// <returns type="">String of name(i.e. Index, Edit etc... which set in the data-action attribute.)</returns>
        var $page = $.app.controllers.getPage(controllerExtendedTypeObject);
        if (!$.isEmpty($page)) {
            return $page.attr("data-action");
        }
        return "";
    },
    getPageBindings: function (controllerExtendedTypeObject) {
        /// <summary>
        /// Get binding events names
        /// </summary>
        /// <param name="controllerExtendedTypeObject"></param>
        /// <returns type="">String of name(i.e. Index, Edit etc... which set in the data-action attribute.)</returns>
        var $page = $.app.controllers.getPage(controllerExtendedTypeObject);
        if (!$.isEmpty($page)) {
            var value = $page.attr("data-event-binding");
            if (!$.isEmpty(value)) {
                return value;
            }
        }
        return "";
    },
    execute: function (controllerExtendedTypeObject, runAll) {
        /// <summary>
        /// execute all the actions if in the same page and page is related to that action.
        /// </summary>
        /// <param name="controllerExtendedTypeObject">Controller extended object , which must have actions array of methods.</param>
        /// <returns type=""></returns>
        var actions = controllerExtendedTypeObject.actions,
            actionNames = Object.keys(actions),
            pageAction = $.app.controllers.getPageActionName(controllerExtendedTypeObject),
            needToStop = runAll === false,
           isOneRan = false;

        for (var i = 0; i < actionNames.length; i++) {
            var actionName = actionNames[i],
                action = actions[actionName];
            if (actionName === pageAction) {
                if ($.executeFunction(action)) {
                    isOneRan = true;
                }
                if (needToStop === true) {
                    return true;
                }
            }
        }
        return isOneRan;
    }
}
///#source 1 1 /JavaScript-Mvc-framework/app/initialize.js
/// <reference path="../app.executeBefore.js" />
/// <reference path="../app.executeAfter.js" />
/// <reference path="../attachInitialize.js" />

$.app.initilizeClasses = [
    $.app.executeBefore
];

$.app.initialize = function () {
    /// <summary>
    /// Run all modules.
    /// First runs config.setup() then all initialize methods in all the controllers.js. 
    /// Then run app.initializeMethods.initialize();
    /// </summary>

    var app = $.app;
    app.config.setup(); // runs all configuration before running all initialize methods.

    $.attachInitializeToArrayAndExecute(app.initilizeClasses);

    // run controller module
    app.controllers.initialize(); // runs all controllers modules.
};

$.app.initializeController = function (controllerCsv) {
    /// <summary>
    /// Run only the controller methods + initialize hidden container , spinner.
    /// First runs config.setup() then all initialize methods in all the controllers.js. 
    /// Then run app.initializeMethods.initialize();
    /// </summary>
    /// <param name="controllerCsv" type="string">controller name csv string.</param>

    var app = $.app;
    app.config.setup(); // runs all configuration before running all initialize methods.
    // run controller module
    app.controllers.initialize(controllerCsv); // run only specific controllers modules.
};

$.app.initializeControllerWithExcuteBeforeMethods = function (controllerCsv) {
    /// <summary>
    /// Run only the controller methods + initialize hidden container , spinner.
    /// First runs config.setup() then all initialize methods in all the controllers.js. 
    /// Then run app.initializeMethods.initialize();
    /// </summary>
    /// <param name="controllerCsv" type="string">controller name csv string.</param>

    var app = $.app;
    app.config.setup(); // runs all configuration before running all initialize methods.

    $.executeArrayOfInitilizeMethods(app.initilizeClasses);

    // run controller module
    app.controllers.initialize(controllerCsv); // run only specific controllers modules.
};
///#source 1 1 /JavaScript-Mvc-framework/app/jQueryExtend.fn.js
/// <reference path="devOrg.js" />
/// <reference path="initialize.js" />
/// <reference path="jQueryExtend.js" />
/// <reference path="jsonCombo.js" />
/// <reference path="regularExp.js" />
/// <reference path="selectors.js" />
/// <reference path="upload.js" />
/// <reference path="urls.js" />
/// <reference path="country-phone.js" />
/// <reference path="constants.js" />
/// <reference path="byId.js" />
/// <reference path="../jQuery/jquery-2.1.4.js" />
/// <reference path="../jQuery/jquery-2.1.4-vsdoc.js" />
;
$.fn.extend({
    getClassesList: function () {
        /// <summary>
        /// jQuery element get all classes as an array.
        /// </summary>
        /// <returns type="array">array list of classes.</returns>
        return $.getClassesList(this);
    },
    isEmpty: function () {
        /// <summary>
        /// Compare any object to null , unidentified or empty then returns true/false.
        /// </summary>
        /// <param name="variable"> Anything can be possible.</param>
        /// <returns type="boolean">True/False</returns>
        return $.isEmpty(this);
    },
    getSelectorElement: function () {
        /// <summary>
        /// get $(selector) element if data-selector attribute exists with the element.
        /// </summary>
        var selector = this.attr("data-selector");
        if ($.isEmpty(selector) === false) {
            //exist
            return $(selector);
        }
        return [];
    },
    getUrlString: function () {
        /// <summary>
        /// get attr("data-url") property.
        /// </summary>
        var url = this.attr("data-url");
        if ($.isEmpty(url) === false) {
            //exist
            return url;
        }
        return "";
    },
    getReferenceIdElement: function () {
        /// <summary>
        /// get $("#id") element if data-ref-id attribute exists.
        /// </summary>
        var id = this.attr("data-ref-id");
        if ($.isEmpty(id) === false) {
            //exist
            return $.byId(id);
        }
        return [];
    },
    disableElement: function () {
        this.attr("disabled", "disabled");
    },
    enableElement: function () {
        this.removeAttr("disabled");
    },
    isDisabledElement: function () {
        return this.hasAttr("disabled");
    },
    toArrayWithValues: function () {
        var len = this.length,
            array = new Array(len);
        for (var i = 0; i < len; i++) {
            array[i] = this[i].value;
        }
        return array;
    },
    multiformSerialize: function () {
        var len = this.length,
            array = [];
        for (var i = 0; i < len; i++) {
            var $from = $(this[i]);
            array.push($.serializeToJson($from));
        }
        return array;
    },
    toggleClasses: function (classes) {
        /// <summary>
        /// toggle classes from the given $element, order doesn't matter..
        /// </summary>
        /// <param name="$element" type="type">jquery element</param>
        /// <param name="classes" type="type">Use spaces( ) to combine and give classes names.</param>
        if (this.length > 0) {
            var classList = classes.split(" ");
            for (var i = 0; i < classList.length; i++) {
                var _class = classList[i];
                this.toggleClass(_class);
            }
        }
    },

    anyClassesExist: function (classes) {
        /// <summary>
        /// toggle classes from the given $element, order doesn't matter..
        /// </summary>
        /// <param name="$element" type="type">jquery element</param>
        /// <param name="classes" type="type">Use spaces( ) to combine and give classes names.</param>
        if (this.length > 0) {
            var classList = classes.split(" ");
            for (var i = 0; i < classList.length; i++) {
                var cssClass = classList[i];
                if (this.hasClass(cssClass)) {
                    return true;
                }
            }
        }
        return false;
    },

    allClassesExist: function (classes) {
        /// <summary>
        /// toggle classes from the given $element, order doesn't matter..
        /// </summary>
        /// <param name="$element" type="type">jquery element</param>
        /// <param name="classes" type="type">Use spaces( ) to combine and give classes names.</param>
        var result = false;
        if (this.length > 0) {
            result = true;
            var classList = classes.split(" ");
            for (var i = 0; i < classList.length; i++) {
                var cssClass = classList[i];
                if (!this.hasClass(cssClass)) {
                    result = false;
                }
            }
        }
        return result;
    },
    toggleAttrValue: function (attr) {
        /// <summary>
        /// toggle given attribute value to "true" => "false" or "false" => "true".
        /// If not present then default insert true.
        /// </summary>
        /// <param name="attr" type="type">attribute name</param>
        if (this.length > 0) {
            var val = this.attr(attr);
            if (val === "true") {
                this.attr(attr, "false");
            } else {
                this.attr(attr, "true");
            }
        }
    },
    isBoolAttr: function (attr) {
        /// <summary>
        /// checks if the given attribute value is not "false".
        /// If attr not present then true.
        /// If no element present then false.
        /// </summary>
        /// <param name="attr" type="type">attribute name</param>
        if (this.length > 0) {
            var val = this.attr(attr);
            return val !== "false";
        }
        return false;
    },
    setBoolTrueAttr: function (attr) {
        /// <summary>
        /// checks if the given attribute value is "false".
        /// If attr not present then true.
        /// </summary>
        /// <param name="attr" type="type">attribute name</param>
        if (this.length > 0) {
            this.attr(attr, "true");
        }
    },
    setBoolFalseAttr: function (attr) {
        /// <summary>
        /// checks if the given attribute value is "false".
        /// If attr not present then true.
        /// </summary>
        /// <param name="attr" type="type">attribute name</param>
        if (this.length > 0) {
            this.attr(attr, "false");
        }
    }
});
///#source 1 1 /JavaScript-Mvc-framework/app/jQueryExtend.js
/// <reference path="devOrg.js" />
/// <reference path="initialize.js" />
/// <reference path="jQueryExtend.js" />
/// <reference path="jsonCombo.js" />
/// <reference path="regularExp.js" />
/// <reference path="selectors.js" />
/// <reference path="upload.js" />
/// <reference path="urls.js" />
/// <reference path="country-phone.js" />
/// <reference path="constants.js" />
/// <reference path="byId.js" />
/// <reference path="../jQuery/jquery-2.1.4.js" />
/// <reference path="../jQuery/jquery-2.1.4-vsdoc.js" />
;

$.isEmpty = function (variable) {
    /// <summary>
    /// Compare any object to null , unidentified or empty then returns true/false.
    /// </summary>
    /// <param name="variable"> Anything can be possible.</param>
    /// <returns type="boolean">True/False</returns>
    return variable === undefined || variable === null || variable === '' || variable.length === 0;
};
/**
 * Set default value if the given variable is empty or not provided.
 * @param {} variable 
 * @param {} defaultValue 
 * @returns {} 
 */
$.setDefaultOnEmpty = function (variable, defaultValue) {
    /// <summary>
    /// Compare any object to null , unidentified or empty then sets the default value to that object and then returns
    /// </summary>
    /// <param name="variable"> Anything can be possible.</param>
    /// <returns type="boolean">True/False</returns>
    if (variable === undefined || variable === null || variable === '' || variable.length === 0) {
        variable = defaultValue;
    }
    return variable;
};
/**
 * Set default value if the given variable is empty or not provided.
 * @param {} variable 
 * @param {} defaultValue 
 * @returns {} 
 */
$.setDefaultBoolOnEmpty = function (variable, defaultValue) {
    /// <summary>
    /// Compare any object to null , unidentified or empty then sets the default value to that object and then returns
    /// </summary>
    /// <param name="variable"> Anything can be possible.</param>
    /// <returns type="boolean">True/False</returns>
    if (variable === undefined || variable === null || variable === '' || variable.length === 0) {
        variable = defaultValue;
    }
    return variable === "true" || variable === true;
};
/**
 * gets the common classes from the list.
 * @param {} classesWithSpace1 : classes with spaces eg. "Hello world"
 * @param {} classesWithSpace2  : classes with spaces eg "world Hello v"
 * @returns {} return a array list of common classes eg. ["Hello",  "world"]
 */
$.getCommonClasses = function (classesWithSpace1, classesWithSpace2) {
    var list1 = classesWithSpace1.split(" "),
        list2 = classesWithSpace2.split(" "),
        common = [];
    var len = list1.length > list2.length ? list1.length : list2.length;
    var workingList = list1.length > list2.length ? list1 : list2;
    var otherList = list1.length > list2.length ? list2 : list1;

    for (var i = 0; i < len; i++) {
        var item = workingList[i];
        if (otherList.indexof(item) > -1) {
            // present as common
            common.push(item);
        }
    }
    return common;
}


/**
 * gets the uncommon classes from the list.
 * @param {} classesWithSpace1 : classes with spaces eg. "Hello world"
 * @param {} classesWithSpace2  : classes with spaces eg "world Hello v"
 * @returns {} return a array list of common classes eg. ["v"]
 */
$.getUnCommonClasses = function (classesWithSpace1, classesWithSpace2) {
    var list1 = classesWithSpace1.split(" "),
        list2 = classesWithSpace2.split(" "),
        unCommon = [];
    var len = list1.length > list2.length ? list1.length : list2.length;
    var workingList = list1.length > list2.length ? list1 : list2;
    var otherList = list1.length > list2.length ? list2 : list1;

    for (var i = 0; i < len; i++) {
        var item = workingList[i];
        if (otherList.indexof(item) === -1) {
            // not present uncommon
            unCommon.push(item);
        }
        item = otherList.length < i ? otherList[i] : null;
        if (item !== null && workingList.indexof(item) === -1) {
            // not present uncommon
            unCommon.push(item);
        }
    }
    return unCommon;
}
/**
 *  @returns array of classes names.
 */
$.getClassesList = function ($jQueryObject) {
    /// <summary>
    /// jQuery element get all classes as an array.
    /// </summary>
    /// <param name="$jQueryObject">Any jQuery object.</param>
    /// <returns type="array">array list of classes.</returns>
    if ($jQueryObject.length === 1) {
        return $jQueryObject.attr("class").split(/\s+/);
    }
    return null;
};

$.getArrayExcept = function (givenArray, excludingArray) {
    /// <summary>
    /// givenArray = ['a','b','c'] , excludingArray=['b','c'], results=['a']
    /// </summary>
    /// <param name="givenArray" type="array">Full list of items (in array format).</param>
    /// <param name="excludingArray" type="array">List of items which needs to be excluded from the list (in array format).</param>
    /// <returns type="array">an array after excluding the items from the given list.</returns>
    "use strict";
    if ($.isEmpty(givenArray)) {
        return [];
    }
    if ($.isEmpty(excludingArray)) {
        return givenArray;
    }

    var len = givenArray.length;
    var results = [];
    for (var i = 0; i < len; i++) {
        if (excludingArray.indexOf(givenArray[i]) === -1) {
            // not found
            results.push(givenArray[i]);
        }
    }
    return results;
};


$.isString = function (variable) {
    /// <summary>
    /// Checks wheater it is a string type or not.
    /// </summary>
    /// <param name="variable"></param>
    /// <returns type="boolean">true/false</returns>
    return typeof variable === 'string';
};

$.returnUrlWithSlash = function (url) {
    /// <summary>
    /// First checks if slash exist at the bottom or not.
    /// </summary>
    /// <param name="url" type="string">Give an url.</param>
    /// <returns type="string">Url with slash at the bottom or empty string if type doesn't match or null or undefined.</returns>
    if ($.isEmpty(url) === false && $.isString(url)) {
        var len = url.length;
        if (url[len - 1] !== '/') {
            url += "/";
            return url;
        }
    }
    return "";
};
$.getFriendlyUrlSlug = function (str) {
    /// <summary>
    /// Returns friendly url slug from given string
    /// Hello & World -> hello-world
    /// </summary>
    /// <param name="str">Give an string "Hello & World"</param>

    var regularExpressions = $.app.regularExp;
    if ($.isEmpty(str) === false) {
        //"[^A-Za-z0-9_\.~]+"
        var regexString = regularExpressions.friendlyUrl;
        str = str.trim();
        var regExp = new RegExp(regexString, 'gi');
        return str.replace(regExp, "-");
    }
    return "";
};
/**
 * single input IFRAME code HTML  to Square
 */
$.htmlToSquareTag = function ($jQueryInputText) {
    /// <summary>
    /// Any HTML tag to square tag inside the input text.
    /// <iframe width="560" height="315" src="//www.youtube.com/embed/ob-P2a6Mrjs" frameborder="0" allowfullscreen> to Square
    /// </summary>
    /// <param name="$jQueryInput">jQuery element.</param>
    var currentText = $jQueryInputText.val();
    //currentText = currentText.toLowerCase();
    var reg = new RegExp("<" + tag, 'gi');
    currentText = currentText.replace(reg, "[" + tag);
    reg = new RegExp("</" + tag + ">", 'gi');
    currentText = currentText.replace(reg, "[/" + tag + "]");
    currentText = currentText.replace(">", "]");
    $jQueryInputText.val(currentText);
};

/**
 * single input IFRAME code Square  to HTML
 */
$.squareToHtmlTag = function ($jQueryInput, tag) {
    /// <summary>
    /// Any square tag to html tag inside the input text.
    /// [iframe width="560" height="315" src="//www.youtube.com/embed/ob-P2a6Mrjs" frameborder="0" allowfullscreen] to html
    /// </summary>
    /// <param name="$jQueryInput">jQuery element.</param>
    var currentText = $jQueryInput.val();
    //currentText = currentText.toLowerCase();
    var reg = new RegExp("\\[" + tag, 'gi');
    currentText = currentText.replace(reg, "<" + tag);
    reg = new RegExp("\\[/" + tag + "\\]", 'gi');
    currentText = currentText.replace(reg, "</" + tag + ">");
    currentText = currentText.replace("]", ">");
    $jQueryInput.val(currentText);
};
//validation modification
$.checkValidInputs = function ($inputsCollection, starRatingLabel, invalidStarRatingCss) {
    /// <summary>
    /// Check all the inputs jQuery validations.
    /// Also mark to red when invalid by the default valid method. 
    /// Bootstrap star rating is also validated in custom way.
    /// </summary>
    /// <param name="$inputsCollection" type="jQuery element">All input collection. </param>
    /// <param name="starRatingLabel">Can be null or full html for the label to be injected when star rating is not selected or rated.</param>
    /// <param name="invalidStarRatingCss" type="json with css properties">When null: {'text-shadow': "2px 2px red"}</param>
    /// <returns type="boolean">true/false</returns>
    "use strict";

    var $currentInput = null;
    var length = $inputsCollection.length;
    var labelHtml = starRatingLabel;
    if ($.isEmpty(labelHtml)) {
        labelHtml = "<label class='label label-danger small-font-size'>Please rate first.</label>";
    }

    if ($.isEmpty(invalidStarRatingCss)) {
        invalidStarRatingCss = {
            'text-shadow': "2px 2px red"
        };
    }
    if (length > 0) {
        for (var i = 0; i < length; i++) {
            $currentInput = $($inputsCollection[i]);

            if ($currentInput.hasClass("common-rating")) {
                var $ratingContainer = $currentInput.closest(".rating-container");
                var $wholeContainer = $ratingContainer.closest(".star-rating");

                if ($currentInput.val() === "0") {
                    $ratingContainer.css(invalidStarRatingCss);
                    if (!$wholeContainer.attr("data-warned")) {
                        $wholeContainer.append(labelHtml);
                        $wholeContainer.attr("data-warned", "true");
                    }
                    return false;
                } else {
                    // when star rating is valid then 
                    // remove the injected label and make it normal
                    $ratingContainer.css({
                        'text-shadow': "none"
                    });

                    if ($wholeContainer.attr("data-warned")) {
                        // removing injected label.
                        $wholeContainer.find("label").remove();
                        $wholeContainer.attr("data-warned", "false");
                    }
                }
            }
            if (!$currentInput.valid()) {
                return false;
            }
        }
    }
    return true;
};

$.isJson = function (obj) {
    if (!$.isEmpty(obj) && !$.isArray(obj) && typeof obj !== 'string' && typeof obj !== 'function') {
        return Object.keys(obj).length > 0;
    }
    return false;
};
$.getHiddenField = function (name) {
    /// <summary>
    /// Get hidden field object from cache if possible.
    /// </summary>
    /// <param name="name">Name of the field</param>
    /// <returns type=""></returns>
    return $.app.hiddenContainer.getHiddenField(name);
};

$.getHiddenValue = function (name) {
    /// <summary>
    /// Get string value of the hidden field.
    /// </summary>
    /// <param name="name">Name of the field</param>
    /// <returns type="">Get string value of the hidden field. If not found then empty string "".</returns>
    var $field = $.app.hiddenContainer.getHiddenField(name);
    if (!$.isEmpty($field)) {
        return $field.val();
    }
    return "";
};

$.setHiddenValue = function (name, val) {
    /// <summary>
    /// Get string value of the hidden field.
    /// </summary>
    /// <param name="name">Name of the field</param>
    /// <param name="val">value of the field</param>
    /// <returns type="">Get string value of the hidden field. If not found then empty string "".</returns>
    return $.app.hiddenContainer.setHiddenValue(name, val);
};


$.isFunc = function (func) {
    /// <summary>
    /// Is it it a function.
    /// </summary>
    /// <param name="func">Anything</param>
    /// <returns type="">Returns true/false</returns>
    return typeof func === "function";
};
$.executeFunction = function (func) {
    /// <summary>
    /// Execute only if it is a function
    /// </summary>
    /// <param name="func">Anything</param>
    /// <returns type="">Returns true/false</returns>
    if (typeof func === "function") {
        func.apply();
        return true;
    }
    return false;
};

$.executeFunctionWithArguments = function (func, argumentsArray) {
    /// <summary>
    /// Execute only if it is a function.
    /// Catch the arguments with arguments variable inside the function.
    /// </summary>
    /// <param name="func">Anything</param>
    /// <param name="argumentsArray">Pass an array of arguments.</param>
    /// <returns type="">Returns true/false</returns>
    if (typeof func === "function") {
        func.apply(null, argumentsArray);
        return true;
    }
    return false;
};


$.getJsonToQueryString = function (url, json, isQuestionMarkRequired) {
    /// <summary>
    /// Returns a concatenated url with those json array value pair
    /// </summary>
    /// <param name="url"></param>
    /// <param name="json">
    ///    any json  {name: 'value', name2: 'value' },
    /// </param>
    /// <param name="isQuestionMarkRequired">add ? after given url or else add &</param>
    /// <returns type="">returns a url string.</returns>
    if (url !== null && url !== undefined) {
        if (isQuestionMarkRequired) {
            url += "?";
        } else {
            url += "&";
        }
        var keys = Object.keys(json),
            len = keys.length,
            arr = new Array(len);
        for (var i = 0; i < len; i++) {
            var key = keys[i],
                value = json[key];
            arr[i] = key + "=" + value + "";
        }
        url += arr.join("&");
        return url;
    }

    return "";
};

$.applyAutoResizeMultiline = function ($container) {
    /// <summary>
    /// Apply auto size on the elements which has elastic or autosize-enabled class.
    /// </summary>
    /// <param name="$container">can be null, if given the filter will be done only inside that container.</param>
    /// <returns type=""></returns>

    var $autoSizableElements;
    var selectors = ".elastic,.autosize,.multiline-text";
    if (!$.isEmpty($container)) {
        $autoSizableElements = $container.find(selectors);
    } else {
        $autoSizableElements = $(selectors);
    }
    if (!$.isEmpty($autoSizableElements)) {
        $autoSizableElements.elastic();
    }
};
$.hideEmptyFields = function ($container) {
    /// <summary>
    /// Hide elements which has empty input fields.
    /// </summary>
    /// <param name="$container">can be null, if given the filter will be done only inside that container.</param>
    /// <returns type=""></returns>

    var $inputs;
    var selectors = "input[value='']";
    var $formGroups;
    if (!$.isEmpty($container)) {
        $inputs = $container.find(selectors);
        $formGroups = $container.find(".form-group");
    } else {
        $inputs = $(selectors);
        $formGroups = $(".form-group");
    }
    if (!$.isEmpty($inputs)) {
        for (var i = 0; i < $inputs.length; i++) {
            var $input = $($inputs[i]),
                name = $input.attr("data-prop"),
                selector = "[data-prop='" + name + "']",
                $formGroup = $formGroups.filter(selector);
            $formGroup.hide();
            //console.log($formGroup);
            //console.log(selector);
            //console.log(name);
        }
    }
};

/**
 *  
 * @param {} arrayOfSelectors  : Pass array of selectors
 * @returns {} jquery elements
 */
$.getjQueryElementsByArrayOfSelectors = function (arrayOfSelectors) {
    /// <summary>
    /// Get jquery elements by passing array of selectors.
    /// </summary>
    /// <param name="arrayOfSelectors" type="type"></param>
    /// <returns type=""></returns>
    var results = [];
    for (var i = 0; i < arrayOfSelectors.length; i++) {
        var selector = arrayOfSelectors[i];
        var $elems = $(selector);
        for (var j = 0; j < $elems.length; j++) {
            var elem = $elems[i];
            results.push(elem);
        }
    }
    return $(results);
}

/**
 * Convert single form to json object.
 * @param {} $singleForm 
 * @returns {} 
 */
$.serializeToJson = function ($singleForm) {
    var result = {};
    var formItemsArray = $singleForm.serializeArray();
    for (var i = 0; i < formItemsArray.length; i++) {
        var item = formItemsArray[i];
        result[item.name] = item.value;
    }
    return result;
}
///#source 1 1 /JavaScript-Mvc-framework/app/service.js
; $.app = $.app || {};
$.app.service = {

};
///#source 1 1 /JavaScript-Mvc-framework/service/redirect.js
$.app.service.redirect = {

    toLogin: function () {
        var loginUrl = $.app.urls.getGeneralUrlSchema(false, ["login"]).login;
        //console.log(loginUrl);
        $.app.service.redirect.to(loginUrl);
    },

    to: function (url) {
        /// <summary>
        /// url to a location.
        /// </summary>
        /// <param name="url" type="type"></param>
        if (url[0] === "/") {
            // relative path
            var host = window.location.hostname,
                protocol = window.location.protocol,
                port = window.location.port,
                path = url;
            if (!$.isEmpty(port)) {
                port = ":" + port;
            }
            url = protocol + "//" + host + port + path;
            //console.log(url);
            window.location = url;
        } else {
            // absolute path.
            window.location = url;
        }
    }
};
///#source 1 1 /JavaScript-Mvc-framework/service/user.js
$.app.service.user = {
    isLoggedIn: function () {
        $.app.service.redirect.toLogin();
        return $.getHiddenValue("is-logged") === "True";
    },
    
};
///#source 1 1 /JavaScript-Mvc-framework/schema/schema.js
;$.app = $.app || {};
;$.app.schema = {
    create: function (schema) {
        /// <summary>
        /// (non-nested faster) create deep copy of the schema 
        /// </summary>
        /// <param name="schema" type="type">Give a schema type from the schema folder.</param>
        return $.nonNestedClone(schema);
    },
    createNestedClone: function (schema) {
        /// <summary>
        /// (nested , a little bit slower) create deep copy of the schema  
        /// </summary>
        /// <param name="schema" type="type">Give a schema type from the schema folder.</param>
        return $.nestedClone(schema);
    }
};
///#source 1 1 /JavaScript-Mvc-framework/schema/hashset.js
/// <reference path="../extensions/clone.js" />

; $.app = $.app || {};
; $.app.schema.hashset = {
    capacity: 1,
    list: {
        array: null,
        ids: null,
        count: 0
    },
    create: function (capacity) {
        /// <summary>
        /// create a new hash-set with the given capacity.
        /// </summary>
        /// <param name="schema" type="type">Give a schema type from the schema folder.</param>
        var hashset = $.app.schema.createNestedClone($.app.schema.hashset);
        delete hashset.create;
        if ($.isEmpty(capacity)) {
            hashset.capacity = 25;
        } else {
            hashset.capacity = capacity;
        }
        hashset.list.array = new Array(hashset.capacity);
        hashset.list.ids = new Array(hashset.capacity);
        return hashset;
    },
    setItem: function (id, items) {
        /// <summary>
        /// Add items uniquely by the given id and item is the hash item could be array or json or anything.
        /// </summary>
        /// <param name="id" type="type"></param>
        /// <param name="items" type="type"></param>
        var isIdEmpty = (id === undefined || id === null);
        if (isIdEmpty === false) {
            var item = this.getItemObject(id);
            if (item !== null) {
                // item not found in the existing list.
                this.list.array[item.index] = items;
                return true;
            }
            return false;
        }
        throw new Error("No id parameter given to set.");
    },
    setItemByIndex: function (index, id, items) {
        /// <summary>
        /// Add items uniquely by the given id and item is the hash item could be array or json or anything.
        /// </summary>
        /// <param name="id" type="type"></param>
        /// <param name="items" type="type"></param>
        var isIndexEmpty = (index === undefined || index === null);
        if (isIndexEmpty === false) {
            if (index <= this.list.count) {
                this.list.array[index] = items;
                this.list.ids[index] = id;
            } else {
                throw new Error("Sorry ! (index : " + index + ", id: " + id + ") given index is out of boundary.");
            }
        }
    },
    addUnique: function (id, items, modifyIfExist) {
        /// <summary>
        /// Add items uniquely by the given id and item is the hash item could be array or json or anything.
        /// </summary>
        /// <param name="id" type="type"></param>
        /// <param name="items" type="Anything : array, json or anything else."></param>
        /// <returns type="bool">Returns if the item is added to the list. If not unique then returns false.</returns>
        var isIdEmpty = (id === undefined || id === null);
        if (isIdEmpty === false) {
            var index = this.getItemIndex(id);
            if (index === -1) {
                // item not found in the existing list.
                this.add(id, items);
                return true;
            } else if (modifyIfExist) {
                this.setItemByIndex(index, id, items);
                return true;
            }
        } else {
            throw new Error("No id parameter given, so can't add new item to the hash-list.");
        }
        return false;
    },
    add: function (id, items) {
        /// <summary>
        /// First parameter is id and item is the hash item could be array or json or any item.
        /// </summary>
        /// <param name="args" type="type"></param>
        /// <returns type=""></returns>
        var isIdEmpty = (id === undefined || id === null);
        // console.log(this);
        // console.log(this.list);
        if (isIdEmpty === false) {
            var list = this.list,
                count = list.count,
                ids = list.ids,
                arr = list.array;
            // argument passed
            if (this.isPossibleToAddNew()) {
                ids[count] = id;
                arr[count] = items;
                this.list.count++;
            } else {
                ids.push(id);
                arr.push(items);
                this.list.count++;
            }
        } else {
            throw new Error("No id parameter given, so can't add new item to the hash-list.");
        }
    },
    isIdExist: function (id) {
        /// <summary>
        /// Returns true/false based on the if the id exist or not.
        /// </summary>
        /// <param name="id" type="type"></param>
        /// <returns type=""></returns>
        return this.getItemIndex(id) > -1;
    },
    getItemIndex: function (id) {
        /// <summary>
        /// Find and get the item from the list by id.
        /// </summary>
        /// <param name="id" type="type"></param>
        for (var i = 0; i < this.list.count; i++) {
            if (this.list.ids[i] === id) {
                return i;
            }
        }
        return -1;
    },
    getItemValue: function (id) {
        /// <summary>
        /// Find and get the item from the list by id.
        /// </summary>
        /// <param name="id" type="type"></param>
        /// <r
        var index = this.getItemIndex(id);
        if (index > -1) {
            // found
            return this.list.array[index];
        }
        return null;
    },
    getItemObject: function (id) {
        /// <summary>
        /// Find and get the item from the list by id.
        /// </summary>
        /// <param name="id" type="type"></param>
        var index = this.getItemIndex(id);
        if (index > -1) {
            // found
            return {
                value: this.list.array[index],
                index: index,
                id: id
            };
        }
        return null;
    },

    removeItem: function (id) {
        /// <summary>
        /// Remove the hash item from the list.
        /// </summary>
        /// <param name="id" type="type"></param>
        /// <returns type="">
        /// Returns {  
        ///    value: this.list.array[index],
        ///    index: index,
        ///    id: id
        /// };
        /// </returns>
        var isIdEmpty = (id === undefined || id === null);
        if (isIdEmpty === false) {
            var item = this.getItemObject(id);
            if (item !== null) {
                // found
                var list = this.list,
                    ids = list.ids,
                    arr = list.array;
                ids.splice(item.index, 1);
                arr.splice(item.index, 1);
                this.list.count--;
                this.capacity = ids.length;
                return item;
            }
        }
        throw new Error("No id found to remove the element from the list.");
        return null;
    },

    isPossibleToAddNew: function () {
        /// <summary>
        /// Private : Is it possible to add items with item in the array.
        /// </summary>
        /// <returns type="">Return true/false if we can add a item by count++</returns>
        var list = this.list,
            count = list.count,
            increment = count + 1;
        return increment <= this.capacity;
    },

    getList: function () {
        /// <summary>
        /// Get this.list;
        /// </summary>
        /// <returns type="">Get this.list.</returns>
        return this.list;
    },
    getIds: function () {
        /// <summary>
        /// Get this.list;
        /// </summary>
        /// <returns type="">Get this.list.</returns>
        return this.list.ids;
    },

    getItems: function () {
        /// <summary>
        /// Get this.list;
        /// </summary>
        /// <returns type="">Get this.list.</returns>
        return this.list.array;
    },
    count: function () {
        /// <summary>
        /// 
        /// </summary>
        /// <returns type="">Get this.list.count</returns>
        return this.list.count;
    }

};
///#source 1 1 /JavaScript-Mvc-framework/schema/url.js
; $.app = $.app || {};
; $.app.schema = $.app.schema || {};
;$.app.schema.url = {
    Create: null,
    Edit: null,
    Delete: null,
    Index:null
};
///#source 1 1 /JavaScript-Mvc-framework/extensions/ajax.js
;$.app = $.app || {};
/**
 * Ajax library to make any form submit to ajax call.
 */
;$.app.ajax = {
    attr: {
        successMessage: "message-on-success",
        failMessage: "message-on-fail",
        replaceContainerSelector: "replace-container-selector",
        onlyMakeRequestIf: "only-make-request-if",
        showSpinner: "shown-spinner",
        blockUISelector: "block-UI-selector"
    },
    events: {
        beforeSend: "before-sending-call",
        afterReceive: "after-receive-call",
        onSuccess: "on-success-call",
        onfailed: "on-fail-call",
        always: "always-call",
    }
};
///#source 1 1 /JavaScript-Mvc-framework/extensions/clone.js
$.nestedClone = function (schema) {
    /// <summary>
    /// (Little bit slow) Created nested cloned object. It will not work for recursive pointing object.
    /// Cloning test by Alim : http://jsperf.com/js-cloning-performance-test
    /// </summary>
    /// <param name="schema" type="type"></param>
    /// <returns type=""></returns>
    var schemaCopy;

    // Handle the 3 simple types, and null or undefined
    if (null == schema || "object" != typeof schema) return schema;

    // Handle Date
    if (schema instanceof Date) {
        schemaCopy = new Date();
        schemaCopy.setTime(schema.getTime());
        return schemaCopy;
    }

    // Handle Array
    if (schema instanceof Array) {
        schemaCopy = new Array(schema.length);
        for (var i = 0, len = schema.length; i < len; i++) {
            schemaCopy[i] = $.nestedClone(schema[i]);
        }
        return schemaCopy;
    }

    // Handle Object
    if (schema instanceof Object) {
        schemaCopy = {};
        for (var attr in schema) {
            if (schema.hasOwnProperty(attr)) schemaCopy[attr] = $.nestedClone(schema[attr]);
        }
        return schemaCopy;
    }

    throw new Error("Unable to create the given schema type! Its type isn't supported.");
}

$.nonNestedClone = function (schema) {
    /// <summary>
    /// (Very fast) Created non-nested cloned object. It will not create nested json objects.
    /// Cloning test by Alim : http://jsperf.com/js-cloning-performance-test
    /// </summary>
    /// <param name="schema" type="type"></param>
    /// <returns type=""></returns>
    var schemaCopy;

    // Handle the 3 simple types, and null or undefined
    if (null == schema || "object" != typeof schema) return schema;

    // Handle Date
    if (schema instanceof Date) {
        schemaCopy = new Date();
        schemaCopy.setTime(schema.getTime());
        return schemaCopy;
    }

    // Handle Array
    if (schema instanceof Array) {
        schemaCopy = new Array(schema.length);
        for (var i = 0, len = schema.length; i < len; i++) {
            schemaCopy[i] = schema[i];
        }
        return schemaCopy;
    }

    // Handle Object
    if (schema instanceof Object) {
        schemaCopy = {};
        for (var attr in schema) {
            if (schema.hasOwnProperty(attr)) schemaCopy[attr] = schema[attr];
        }
        return schemaCopy;
    }

    throw new Error("Unable to create the given schema type! Its type isn't supported.");
}
///#source 1 1 /JavaScript-Mvc-framework/extensions/constants.js
;$.app.constants = {
    
};
///#source 1 1 /JavaScript-Mvc-framework/extensions/hiddenContainer.js
$.app.hiddenContainer = {
    $hiddenContainer: null,
    $hiddenFieldDictionary: [],
    hiddenFieldNamesDictionary: [],
    initialize: function () {
        /// <summary>
        /// Initialize hidden container if exist.
        /// </summary>
        /// <returns type="">returns hidden container.</returns>
        var app = $.app.hiddenContainer;
        app.$hiddenContainer = $.byId("hidden-fields-container");
        app.$hiddenFieldDictionary = -1; // call GC to remove quickly.
        app.$hiddenFieldDictionary = [];
        app.hiddenFieldNamesDictionary = -1;// call GC to remove quickly.
        app.hiddenFieldNamesDictionary = []; 
        return app.$hiddenContainer;
    },
    isHiddenContainerExist: function () {
        return !$.isEmpty($.app.hiddenContainer.$hiddenContainer);
    },
    _getHiddenFieldDictionary: function (nameOfHiddenField) {
        /// <summary>
        /// Get dictionary hidden field values.
        /// </summary>
        /// <param name="nameOfHiddenField"></param>
        /// <returns type="return $ type object.">null or jquery obejct.</returns>
        var app = $.app.hiddenContainer;
        if (nameOfHiddenField) {
            var namesDictionary = app.hiddenFieldNamesDictionary;
            for (var i = 0; i < namesDictionary.length; i++) {
                var hiddenName = namesDictionary[i];
                if (hiddenName === nameOfHiddenField) {
                    return app.$hiddenFieldDictionary[i];
                }
            }
        }
        return null;
    },
    _addHiddenFieldToDictionary: function ($field) {
        /// <summary>
        /// Only adds the item to the dictionary ($hiddenFieldDictionary, hiddenFieldNamesDictionary)
        /// </summary>
        /// <param name="$field">jQuery object.</param>
        /// <returns type=""></returns>
        var app = $.app.hiddenContainer;
        app.$hiddenFieldDictionary.push($field);
        app.hiddenFieldNamesDictionary.push($field.attr("name"));
    },
    getHiddenField: function (nameOfHiddenField) {
        /// <summary>
        /// Get the hidden field value, if possible get it from dictionary object.
        /// Make sure that you put every hidden field inside #hidden-fields-container container
        /// </summary>
        /// <param name="nameOfHiddenField"></param>
        /// <returns type="return $ type object.">get attribute values $returnedObject.attr() or null</returns>
        var self = $.app.hiddenContainer;
        if (self.isHiddenContainerExist()) {
            var $container = self.$hiddenContainer,
                $field = self._getHiddenFieldDictionary(nameOfHiddenField);
            if ($field) {
                // not null
                return $field;
            } else {
                // is null the get id from DOM
                $field = $.byId(nameOfHiddenField);
                if ($field.length === 0) {
                    $field = $container.find("[name='" + nameOfHiddenField + "']");
                }
                self._addHiddenFieldToDictionary($field);
                return $field;
            }
        }
        return null;
    },
    setHiddenValue: function (nameOfHiddenField, val) {
        /// <summary>
        /// Get the hidden field value, if possible get it from dictionary object.
        /// Make sure that you put every hidden field inside #hidden-fields-container container
        /// </summary>
        /// <param name="nameOfHiddenField"></param>
        /// <returns type="return $ type object.">get attribute values $returnedObject.attr() or null</returns>
        var app = $.app.hiddenContainer;
        if (app.isHiddenContainerExist()) {
            var $field = app.getHiddenField(nameOfHiddenField);
            if ($field.length > 0) {
                $field.val(val);
                return $field;
            }
        }
        return null;
    }
}
///#source 1 1 /JavaScript-Mvc-framework/extensions/inputChangeTracker.js
/// <reference path="urls.js" />
/// <reference path="constants.js" />
/// <reference path="country-phone.js" />
/// <reference path="devOrg.js" />
/// <reference path="initialize.js" />
/// <reference path="jQueryExtend.js" />
/// <reference path="jsonCombo.js" />
/// <reference path="regularExp.js" />
/// <reference path="selectors.js" />
/// <reference path="upload.js" />
/// <reference path="../../Content/Scripts/jquery-2.1.4.js" />
/// <reference path="../../Content/Scripts/jquery-2.1.4.intellisense.js" />
/// <reference path="../schema/url.js" />
/// <reference path="../schema/schema.js" />
/// <reference path="../jQueryExtend.fn.js" />
/// <reference path="../ProtoType/Array.js" />

$.app.inputChangeTracker = {
    list: {
        $inputs: null, // array
        initalTexts: null,  // array
        idsOrNames: null // array
    },

    createTracker: function ($inputs) {
        /// <summary>
        /// Creates a tracker to track input elements which are changed afterwards.
        /// </summary>
        /// <param name="$inputs" type="type"></param>
        var tracker = $.app.schema.createNestedClone($.app.inputChangeTracker);
        delete tracker.createTracker;
        var list = tracker.list;
        list.$inputs = $inputs;
        list.initalTexts = $inputs.toArrayWithValues();
        list.idsOrNames = tracker.getAllInputsIdsOrNameArray();
        return tracker;
    },
    isChanged: function ($input) {
        var item = this.getInputfromListWithInitialText($input);
        if (item !== null) {
            var currentText = item.$input.val();
            if (item.initText !== currentText) {
                return true;
            }
        }
        return false;
    },
    getInputfromListWithInitialText: function ($input) {
        var textArr = this.list.initalTexts,
            findingId = this.getInputIdOrName($input);
        for (var i = 0; i < textArr.length; i++) {
            var currentInputId = this.list.idsOrNames[i];
            if (findingId === currentInputId) {
                return {
                    $input: $input,
                    initText: textArr[i]
                }
            }
        }
        return null;
    },

    getInputIdOrName: function ($input) {
        var name;
        if (!$.isEmpty($input.length)) {
            name = $input.attr("id");
            if ($.isEmpty(name)) {
                name = $input.attr("name");
            }
            return name;
        } else {
            name = $input.id;
            if ($.isEmpty(name)) {
                name = $input.getAttribute("name");
            }
        }
        return name;
    },
    getInputIdOrNameByIndex: function (index) {
        return this.list.idsOrNames[index];
    },
    getChangedInputs: function () {
        /// <summary>
        /// Get all inputs array which are changed at moment of calling this method.
        /// </summary>
        /// <returns type=""></returns>
        var list = this.list,
            $inputs = this.list.$inputs,
            len = $inputs.length;
        var changedInputsList = [];
        for (var i = 0; i < len; i++) {
            var input = $inputs[i],
                currentText = input.value,
                previousValue = list.initalTexts[i];
            if (currentText !== previousValue) {
                // different 
                changedInputsList.push(input);
            }
        }
        return $(changedInputsList);
    },
    getUnchangedInputs: function () {
        /// <summary>
        /// Get all inputs array which are changed at moment of calling this method.
        /// </summary>
        /// <returns type=""></returns>
        var list = this.list,
            $inputs = this.list.$inputs,
            len = $inputs.length;
        var changedInputsList = [];
        for (var i = 0; i < len; i++) {
            var input = $inputs[i],
                currentText = input.value,
                previousValue = list.initalTexts[i];
            if (currentText === previousValue) {
                // different.
                changedInputsList.push(input);
            }
        }
        return $(changedInputsList);
    },
    getChangedInputsAttrArray: function (attr) {
        /// <summary>
        /// Get an array of the given attribute values for changed inputs.
        /// </summary>
        /// <param name="attr" type="type">Give a attr name.</param>
        /// <returns type="">Get an array of the given attribute values for changed inputs.</returns>
        var $changedInputs = this.getChangedInputs();
        var attrArray = new Array($changedInputs.length);
        for (var i = 0; i < $changedInputs.length; i++) {
            attrArray[i] = $changedInputs[i].getAttribute(attr);
        }
        return attrArray;
    },
    getUnchangedInputsAttrArray: function (attr) {
        /// <summary>
        /// Get an array of the given attribute values for changed inputs.
        /// </summary>
        /// <param name="attr" type="type">Give a attr name.</param>
        /// <returns type="">Get an array of the given attribute values for changed inputs.</returns>
        var $changedInputs = this.getUnchangedInputs();
        var attrArray = new Array($changedInputs.length);
        for (var i = 0; i < $changedInputs.length; i++) {
            attrArray[i] = $changedInputs[i].getAttribute(attr);
        }
        return attrArray;
    },
    getAllInputsIdsOrNameArray: function () {
        /// <summary>
        /// Get an array of the given attribute values for changed inputs.
        /// </summary>
        /// <param name="attr" type="type">Give a attr name.</param>
        /// <returns type="">Get an array of the given attribute values for changed inputs.</returns>
        var $inputs = this.list.$inputs;
        var attrArray = new Array($inputs.length);
        for (var i = 0; i < $inputs.length; i++) {
            var input = $inputs[i];
            var idOrName = input.id;
            if ($.isEmpty(idOrName)) {
                idOrName = input.getAttribute("name");
            }
            attrArray[i] = idOrName;
        }
        return attrArray;
    },
    setChangedInputsAttr: function (attr, value) {
        /// <summary>
        /// Set common attribute value to all the changed input elements.
        /// </summary>
        /// <param name="attr" type="type"></param>
        /// <param name="value" type="type"></param>
        var $changedInputs = this.getChangedInputs();
        for (var i = 0; i < $changedInputs.length; i++) {
            var input = $changedInputs[i];
            input.setAttribute(attr, value);
        }
    }
};
///#source 1 1 /JavaScript-Mvc-framework/extensions/modal.js
$.app.modal = {
    $modalStacks: [],
    $modalIds: [],
    push: function ($modal) {
        var self = $.app.modal,
            list = self.$modalStacks;
        list.push($modal);
    },
    pop: function () {
        var self = $.app.modal,
            list = self.$modalStacks,
            $modal = list[list.length - 1];
        list.pop();
        return $modal;
    },
    hidePrevious: function () {
        var self = $.app.modal,
           list = self.$modalStacks,
           $modal = list[list.length - 2];
        if (!$.isEmpty($modal)) {
            $modal.modal('hide');
        }
    },
    showPrevious: function () {
        var self = $.app.modal,
            len = self.$modalStacks.length,
            list = self.$modalStacks;
        var $modal = list[len-2]; // get previous one.
        if (!$.isEmpty($modal)) {
            $modal.modal('hide');
            setTimeout(function () {
                $modal.modal('show');
            }, 400);
        }
    },
    show: function ($modal, $modalBody, url, spinnerShowMethod, spinnerHideMethod, onBeforeRequest,onComplete) {
        /// <summary>
        /// Shows modal and track it..
        /// Calling showPrevious will display previous modal.
        /// </summary>
        /// <param name="$modal"></param>
        /// <param name="$modalBody"></param>
        /// <param name="url"></param>
        /// <param name="spinnerShowMethod"></param>
        /// <param name="spinnerHideMethod"></param>
        /// <param name="onComplete"></param>
        /// <returns type=""></returns>

        //console.log(url);
        $.executeFunction(onBeforeRequest);
        $.executeFunction(spinnerShowMethod);
        var self = $.app.modal;
        jQuery.ajax({
            method: "Get", // by default "GET"
            url: url,
            dataType: "Html" //, // "Text" , "HTML", "xml", "script" 
        }).done(function (response) {
            $.executeFunction(spinnerHideMethod);
            $modalBody.html(response);
            $modal.modal("show");
            self.push($modal);
            $.executeFunction(onComplete);
        }).fail(function (jqXHR, textStatus, exceptionMessage) {
            console.log("Request failed: " + exceptionMessage);
        });
    }

}
///#source 1 1 /JavaScript-Mvc-framework/extensions/pagination.js
$.app.pagination = function($paginationContainer, pageCountUrl, selectedPage, pagesNumberToDisplay, additionalClass, paginationClass, onComplete) {
    /// <summary>
    /// render pagination numbers
    /// </summary>
    /// <param name="$paginationContainer">The jQuery container where the pagination will be created.</param>
    /// <param name="pageCountUrl">Where to retrieve the page count.</param>
    /// <param name="selectedPage">Which page is currently selected.</param>
    /// <param name="pagesNumberToDisplay"></param>
    /// <param name="additionalClass">If any additional class need to be added with the pagination ul.</param>
    /// <param name="paginationClass">class will be added with the anchors by default it would be 'pagination-request'</param>
    /// <param name="onComplete">On complete this function will run.</param>
    var renderPagination = function(totalPageCount) {
        if ($.app.isDebugging) {
            console.log("Page count:");
            console.log(totalPageCount);
        }
        if (!paginationClass) {
            paginationClass = "pagination-request";
        }
        if (!additionalClass) {
            additionalClass = "";
        }
        var pagesCount = totalPageCount,
            $ul = $("<ul></ul>", {
                'class': "pagination " + additionalClass
            });
        var start = 2, end = pagesCount;
        var mid = Math.ceil(pagesNumberToDisplay / 2); // 5/2 = 2
        if (pagesCount > pagesNumberToDisplay) {
            end = selectedPage + mid;
            start = selectedPage - mid;
            if (start <= 0) {
                start = 0 - start;
                end += start;
                start = 2;
            }
            if (end >= pagesCount) {
                start = selectedPage - mid - (end - pagesCount);
                end = pagesCount;
            }
        }
        // first page link
        var differentPage = 1,
            differnetPageStringName = "First",
            isSelectedPage = selectedPage === differentPage;
        var $li = $("<li></li>", {
            'class': isSelectedPage === true ? "active" : null
        });
        var linkUrl = "#" + differentPage,
            anchorHtml = "<a class='" + paginationClass + "' href='" + linkUrl + "' data-page='" + differentPage + "'>" + differnetPageStringName + "</a>";
        $li.append(anchorHtml);
        $li.appendTo($ul);

        if (start !== 2) {
            differentPage = start - 1;
            differnetPageStringName = "...";
            isSelectedPage = selectedPage === differentPage;
            linkUrl = "#" + differentPage;
            $li = $("<li></li>", {
                'class': isSelectedPage === true ? "active" : null
            });
            anchorHtml = "<a class='" + paginationClass + "' href='" + linkUrl + "' data-page='" + differentPage + "'>" + differnetPageStringName + "</a>";
            $li.append(anchorHtml);
            $li.appendTo($ul);
        }

        for (var i = start; i <= end; i++) {
            isSelectedPage = selectedPage === i;
            linkUrl = "#" + i; //tableUrl + queryStringforPage;
            $li = $("<li></li>", {
                'class': isSelectedPage === true ? "active" : null
            });
            anchorHtml = "<a class='" + paginationClass + "' href='" + linkUrl + "' data-page='" + i + "'>" + i + "</a>";
            $li.append(anchorHtml);
            $li.appendTo($ul);
        }
        if (end + 1 < pagesCount) {
            // ... for end
            differentPage = end + 1 <= pagesCount ? end + 1 : pagesCount;
            differnetPageStringName = "...";
            isSelectedPage = selectedPage === differentPage;
            linkUrl = "#" + differentPage;
            $li = $("<li></li>", {
                'class': isSelectedPage === true ? "active" : null
            });
            anchorHtml = "<a class='" + paginationClass + "' href='" + linkUrl + "' data-page='" + differentPage + "'>" + differnetPageStringName + "</a>";
            $li.append(anchorHtml);
            $li.appendTo($ul);
        }
        differentPage = pagesCount;
        differnetPageStringName = "Last";
        isSelectedPage = selectedPage === differentPage;
        linkUrl = "#" + differentPage;
        $li = $("<li></li>");
        anchorHtml = "<a class='" + paginationClass + "' href='" + linkUrl + "' data-page='" + differentPage + "'>" + differnetPageStringName + "</a>";
        $li.append(anchorHtml);
        $li.appendTo($ul);
        $ul.appendTo($paginationContainer);
        if (typeof onComplete === "function") {
            onComplete.apply();
        }
    }

    jQuery.ajax({
        method: "POST", // by default "GET"
        url: pageCountUrl,
        dataType: "JSON" //, // "Text" , "HTML", "xml", "script" 
    }).done(function(response) {
        var totalCountOfPages = response;
        $.setHiddenValue("pages-exist", totalCountOfPages);
        renderPagination(totalCountOfPages);
    });

};
///#source 1 1 /JavaScript-Mvc-framework/extensions/regularExp.js
;$.app.regularExp = {
    friendlyUrl : "[^A-Za-z0-9_\.~]+"
};
///#source 1 1 /JavaScript-Mvc-framework/extensions/selectors.js
$.app.selectors = {
    ids : {
        processForm: "server-validation-form",
        bodyStart: "body-start"
    }
};
///#source 1 1 /JavaScript-Mvc-framework/extensions/spinner.js
/// <reference path="../jQueryExtend.fn.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../byId.js" />
/// <reference path="../jquery-2.1.4.intellisense.js" />
;$.app.spinner = {
    id: 'loading-bar',
    $spinner: [],
    spinnerDisplayTypeId: 1,
    type: {
        HtmlTemplate: 1, // renders spinner from Html element
        JsTemplate: 2 // render Html by generating Html from JavaScript.
    },
    prop: {
        spinnerClass: "fa-spin-custom fa-spinner",
        spinnerVisibleAttr: "data-is-spinner-visible"
    },
    initialize: function () {
        var self = $.app.spinner;
        self.$spinner = $.byId(self.id);
        if (!$.isFunc($.blockUI)) {
            throw new Error("Spinner requires jQueryUI Block + Animate.css library. Please download and add those to your project.");
        }
    },
    setMessage: function (contentMessage) {
        /// <summary>
        /// Set message on spinner
        /// </summary>
        /// <param name="tooltipMessage">tooltipMessage message</param>
        /// <param name="contentMessage">content message</param>
        var self = $.app.spinner,
            $loadingbar = self.get(),
            $content = $loadingbar.find(".spinner-content");


        if ($.isEmpty(contentMessage)) {
            contentMessage = "Please wait!";
        }

        if ($.isEmpty(contentMessage) === false) {
            $content.attr("title", contentMessage)
                .html(contentMessage);
        } else {
            $content.attr("title", "")
                .html("");
        }
    },
    quickShow: function ($blockingElement, $elementToHide, onBlockExecuteMethod) {
        /// <summary>
        /// Show a spiner with default messages.
        /// </summary>
        /// <param name="$blockingElement" type="type">Element which to block.</param>
        /// <param name="$elementToHide" type="type">Element which to hide during the display of the spinner.</param>
        /// <param name="onBlockExecuteMethod" type="type">An event to execute when the element is blocked.</param>
        var self = $.app.spinner;
        self.show(null, $blockingElement, $elementToHide, onBlockExecuteMethod);
    },
    show: function (message, $blockingElement, $elementToHide, onBlockExecuteMethod) {
        /// <summary>
        /// show spinner and block UI
        /// </summary>
        /// <param name="message" type="type">
        /// set message to the loading spinner.
        /// </param>
        /// <param name="$blockingElement" type="type">
        /// If any $element is given then UI will only be blocked $element. If none given then whole screen will be blocked.
        /// </param>
        /// <param name="$elementToHide" type="type">
        /// If any $elementToHide is given then this element will be hidden when the UI is blocked.
        /// </param>
        var self = $.app.spinner,
            $spinner = self.get();
        self.setMessage(message);

        if (!$.isEmpty($elementToHide)) {
            $elementToHide.hide();
        }
        var options = {
            message: $spinner,
            onBlock: onBlockExecuteMethod
        };
        if (!$.isEmpty($blockingElement)) {
            $blockingElement.block(options);
        } else {
            // block whole screen
            $.blockUI(options);
        }
    },

    hide: function ($unBlockingElement, $elementToDisplay) {
        /// <summary>
        /// hide spinner and unblock the UI
        /// </summary>
        /// <param name="$unBlockingElement" type="type"></param>
        /// <param name="$elementToDisplay" type="type"></param>
        var self = $.app.spinner;
        if (!$.isEmpty($unBlockingElement)) {
            $unBlockingElement.unblock();
        } else {
            // unblock whole screen
            $.unblockUI();
        }
        if (!$.isEmpty($elementToDisplay)) {
            $elementToDisplay.show("slow");
        }
    },


    get: function () {
        /// <summary>
        /// Get the spinner element.
        /// </summary>
        /// <returns type="">Returns $.app.spinner.$spinner</returns>
        return $.app.spinner.$spinner;
    },

    toogleSpinnerClass: function ($e, newClasses, hideOnSpinnerOnSpinnerClassesRemoved) {
        /// <summary>
        /// Toggle spinner classes on the given $element.
        /// </summary>
        /// <param name="$e" type="type">Element to toggle hide.</param>
        /// <param name="newClasses" type="type">use spaces for multiple classes</param>
        /// <param name="hideOnSpinnerOnSpinnerClassesRemoved" type="type">true/false if the spinner element should hide when removing the spinner classes.</param>
        var self = $.app.spinner,
            prop = self.prop,
            spinnerClass = prop.spinnerClass;
        if ($e.length > 0) {
            if (!$e.hasClass("fa")) {
                spinnerClass += " fa";
            }
            if (hideOnSpinnerOnSpinnerClassesRemoved === true) {
                $e.toggleClass("hide");
            }
            $e.toggleClasses(spinnerClass);
            $e.toggleClasses(newClasses);
        }
    },
    isSpinnerVisibleAt: function ($btn) {
        if ($btn.length > 0) {
            var self = $.app.spinner,
                prop = self.prop,
                attr = prop.spinnerVisibleAttr;
            return $btn.isBoolAttr(attr);
        }
        return false;
    },
    toggleSpinnerWithBtnPlusUIBlock: function ($btn, $currentIcon, $blockingUI, message, onCompleteFunction, spinnerClasses, nonSpinnerClasses, commonClass, right, hideOnSpinnerOnSpinnerClassesRemoved) {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="$btn" type="type">Where to add the spinner.</param>
        /// <param name="$currentIcon" type="type">$ element if any icon present in the btn. This element will be hidden when spinner css is added.</param>
        /// <param name="spinnerClasses" type="type">custom spinner classes. if not given default one will be set : fa-spin-custom fa-spinner</param>
        /// <param name="nonSpinnerClasses" type="type">custom classes to be displayed when spinner is disabled. If not given nothing will happen. if given then it will be added with the i.spinner when by toggling</param>
        /// <param name="right" type="type">if place in right or left. by default left.</param>
        /// <param name="hideOnSpinnerOnSpinnerClassesRemoved" type="type">Hide the spinner icon when toggled. If true then when spinner class is removed this spinner icon object will be hidden and nonSpinnerClasses will have no effect on the system.</param>
        /// <param name="$blockingUI" type="type">Blocking ui</param>
        /// <param name="message" type="type">Message to display when blocks the ui</param>
        /// <param name="onCompleteFunction" type="type">onCompletetion function.</param>
        var self = $.app.spinner;
        var isSpinnerVisible = self.toggleSpinnerWithBtn($btn, $currentIcon, spinnerClasses, nonSpinnerClasses, commonClass, right, hideOnSpinnerOnSpinnerClassesRemoved);
        if (isSpinnerVisible === true) {
            self.show(message, $blockingUI, null, onCompleteFunction);
        } else {
            self.hide($blockingUI, null);
        }
    },
    toggleSpinnerWithBtn: function ($btn, $currentIcon, spinnerClasses, nonSpinnerClasses, commonClass, right, hideOnSpinnerOnSpinnerClassesRemoved) {
        /// <summary>
        /// Attach spinner icon inside a button or anchor or any div tag.
        /// </summary>
        /// <param name="$btn" type="type">Where to add the spinner.</param>
        /// <param name="$currentIcon" type="type">$ element if any icon present in the btn. This element will be hidden when spinner css is added.</param>
        /// <param name="spinnerClasses" type="type">custom spinner classes. if not given default one will be set : fa-spin-custom fa-spinner</param>
        /// <param name="nonSpinnerClasses" type="type">custom classes to be displayed when spinner is disabled. If not given nothing will happen. if given then it will be added with the i.spinner when by toggling</param>
        /// <param name="right" type="type">if place in right or left. by default left.</param>
        /// <param name="hideOnSpinnerOnSpinnerClassesRemoved" type="type">Hide the spinner icon when toggled. If true then when spinner class is removed this spinner icon object will be hidden and nonSpinnerClasses will have no effect on the system.</param>
        if ($btn !== undefined && $btn.length > 0) {
            var $spinner,
                self = $.app.spinner,
                prop = self.prop,
                attr = prop.spinnerVisibleAttr,
                spinnerClass = prop.spinnerClass;
            if ($.isEmpty(spinnerClasses)) {
                if (!$btn.hasClass("fa")) {
                    spinnerClass += " fa";
                }
                spinnerClasses = spinnerClass;
            }

            if (!$.isEmpty($btn.$attachtedSpinner)) {
                $spinner = $btn.$attachtedSpinner;
                if (hideOnSpinnerOnSpinnerClassesRemoved === true) {
                    $spinner.toggleClass("hide");
                }
                var currentlySpinnerDisplaying = $btn.isBoolAttr(attr);
                $spinner.toggleClasses(spinnerClasses); // toggle spinner visible/invisible classes.
                if (currentlySpinnerDisplaying) {
                    // currently spinner is visible , now make it invisible.
                    $btn.setBoolFalseAttr(attr);
                } else {
                    // currently spinner is not visible, make it visible.
                    $btn.setBoolTrueAttr(attr);
                }
                if (!$.isEmpty(nonSpinnerClasses)) {
                    $spinner.toggleClasses(nonSpinnerClasses);
                }
            } else {
                // creating the spinner
                commonClass = $.setDefaultOnEmpty(commonClass, "");
                $spinner = $("<i>", { class: "spinner-icon " + commonClass + " " + spinnerClasses });
                $btn.$attachtedSpinner = $spinner;
                if (right === true) {
                    $btn.append($spinner);
                } else {
                    $btn.prepend($spinner);
                }
                $btn.setBoolTrueAttr(attr);
            }
            if (!$.isEmpty($currentIcon) && $currentIcon.length > 0) {
                $currentIcon.toggleClass("hide");
            }
            return $btn.isBoolAttr(attr);
        }
        return false;
    }
};
///#source 1 1 /JavaScript-Mvc-framework/extensions/urls.js
/// <reference path="urls.js" />
/// <reference path="constants.js" />
/// <reference path="country-phone.js" />
/// <reference path="devOrg.js" />
/// <reference path="initialize.js" />
/// <reference path="jQueryExtend.js" />
/// <reference path="jsonCombo.js" />
/// <reference path="regularExp.js" />
/// <reference path="selectors.js" />
/// <reference path="upload.js" />
/// <reference path="D:\Working\GitHub\WereViewProject\WeReviewApp\Content/Scripts/jquery-2.1.4.js" />
/// <reference path="D:\Working\GitHub\WereViewProject\WeReviewApp\Content/Scripts/jquery-2.1.4.intellisense.js" />
/// <reference path="../schema/url.js" />
$.app.urls = {
    /*
     * hostUrl will be retrieved from hidden field "#host-url"
     * Contains a slash at the end.
     */
    hostUrl: null,

    validator: "Validator/",
    usernameValidation: "Username",
    emailValidation: "Email",
    timeZoneJson: "Services/GetTimeZone", // look like this /Partials/GetTimeZone/CountryID
    languageJson: "Services/GetLanguage", // look like this /Partials/GetTimeZone/CountryID
    getHostUrl: function () {
        /// <summary>
        /// Retrieve host url from host-url id hidden field
        /// Return host url with a slash at the bottom.
        /// </summary>
        /// <returns type="">Returns the host url.</returns>
        var self = $.app.urls;
        var hostUrl = self.hostUrl;

        if ($.isEmpty(hostUrl)) {
            var dev = $.app,
                selectors = dev.selectors;
            var id = selectors.hostFieldId;
            var $hostUrlHidden = $.byId(id);
            if ($hostUrlHidden.length > 0) {
                var url = $hostUrlHidden.val();
                self.hostUrl = $.returnUrlWithSlash(url);
            }
        }
        return self.hostUrl;
    },

    getAbsUrl: function (givenUrl) {
        /// <summary>
        /// Given url shouldn't have any slash at the begining.
        /// </summary>
        /// <param name="givenUrl">url shouldn't have any slash at the begining.</param>
        /// <returns type="">Return absolute url containing host name and url.</returns>
        var self = $.app.urls;
        var hostUrl = self.hostUrl;
        if (!$.isEmpty(hostUrl)) {
            return hostUrl + givenUrl;
        }
        hostUrl = self.getHostUrl();
        return hostUrl + givenUrl;
    },


    getAbsValidatorUrl: function (url) {
        /// <summary>
        /// Returns absolute url of a validation
        /// </summary>
        /// <param name="url"></param>
        /// <returns type="string">returns absolute url.</returns>
        var self = $.app.urls;

        var urlCombined = self.validator + url;
        return self.getAbsUrl(urlCombined);

    },

    getGeneralUrlSchema: function (shouldGetDefaultSchema, otherUrlsList) {
        /// <summary>
        /// Generate a general url schema , which contains
        /// It will look for hidden fields : edit-url, add-url, delete-url, save-url
        /// </summary>
        /// <param name="shouldGetDefaultSchema" type="bool">
        /// T/F , T/undefined : gets the default schmea.
        /// </param>
        /// <param name="otherUrlsList" type="type">
        /// Array of list items containing new url names.
        /// If null then only return url schema with add,edit,save,remove urls.
        /// For example, retrieving "edit-url" hidden value pass "edit".
        /// </param>
        /// <returns type="$.app.schema.url">
        /// Returns a url schema object from schema folder's url (schema).
        /// </returns>
        var urlSchema, i, urlName;
        if ($.isEmpty(shouldGetDefaultSchema) || shouldGetDefaultSchema === true) {
            urlSchema = $.app.schema.create($.app.schema.url);
            var keys = Object.keys(urlSchema);
            for (i = 0; i < keys.length; i++) {
                urlName = keys[i];
                urlSchema[urlName] = $.getHiddenValue(urlName + "-url");
            }
        } else {
            urlSchema = {};
        }

        if (!$.isEmpty(otherUrlsList)) {
            for (i = 0; i < otherUrlsList.length; i++) {
                urlName = otherUrlsList[i];
                urlSchema[urlName] = $.getHiddenValue(urlName + "-url");
            }
        }
        return urlSchema;
    }
};
///#source 1 1 /JavaScript-Mvc-framework/controllers/initialize.js
/// <reference path="../extensions/ajax.js" />
/// <reference path="../extensions/clone.js" />
/// <reference path="../extensions/constants.js" />
/// <reference path="../extensions/hiddenContainer.js" />
/// <reference path="../extensions/inputChangeTracker.js" />
/// <reference path="../extensions/modal.js" />
/// <reference path="../extensions/pagination.js" />
/// <reference path="../extensions/regularExp.js" />
/// <reference path="../extensions/selectors.js" />
/// <reference path="../extensions/spinner.js" />
/// <reference path="../libs/DevOrgPlugins/WeReviewApps.js" />
/// <reference path="../libs/jquery.blockUI.js" />
/// <reference path="../extensions/urls.js" />
/// <reference path="../libs/toastr.js" />
/// <reference path="../libs/underscore.js" />
/// <reference path="../byId.js" />
/// <reference path="../controllers.js" />
/// <reference path="../jQueryCaching.js" />
/// <reference path="../jQueryExtend.fn.js" />
/// <reference path="../app.global.js" />
/// <reference path="../jQueryExtend.js" />
/// <reference path="../schema/hashset.js" />
/// <reference path="../attachInitialize.js" />
/// <reference path="../schema/schema.js" />
/// <reference path="../libs/jQuery/jquery-2.2.3.intellisense.js" />
/// <reference path="../schema/url.js" />
/// <reference path="../Prototype/Array.js" />

//; $.app.controllers = $.app.controllers || {};
$.app.controllers.initialize = function (controllerName) {
    /// <summary>
    /// Run all modules inside controllers.
    /// </summary>
    var app = $.app,
        controllersList = app.controllers,
        runAll = true,
        keys = [],
        key,
        pageId,
        i,
        controllers = app.controllers,
        currentController,
        bindingEventsNames,
        binding = app.events.binding,
        addController = false;
    if ($.isEmpty(controllerName)) {
        keys = Object.keys(controllersList);
    } else {
        keys = controllerName.split(",");
        addController = true;
    }

    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        if (addController === true) {
            currentController = controllersList[key + "Controller"];
        } else {
            currentController = controllersList[key];
        }
        pageId = currentController["pageId"];
        if (!$.isEmpty(pageId)) {
            if (controllers.isCurrentPage(currentController)) {
                controllers.execute(currentController, runAll);
                bindingEventsNames = controllers.getPageBindings(currentController);
                if (bindingEventsNames === "*") {
                    // binds all bindings
                    binding.executeAll(currentController);
                } else if (bindingEventsNames !== "") {
                    // binds specific events using csv
                    binding.execute(currentController, bindingEventsNames);
                }
                $.executeFunction(currentController["initialize"]);
            }
        }
    }
}
///#source 1 1 /JavaScript-Mvc-framework/controllers/account-controller.js
/// <reference path="../libs/jQuery/jquery-2.2.3.js" />
/// <reference path="../libs/jQuery/jquery-2.2.3.intellisense.js" />
/// <reference path="../libs/jquery.blockUI.js" />
/// <reference path="../extensions/ajax.js" />
/// <reference path="../extensions/clone.js" />
/// <reference path="../extensions/constants.js" />
/// <reference path="../extensions/hiddenContainer.js" />
/// <reference path="../extensions/initialize.js" />
/// <reference path="../extensions/inputChangeTracker.js" />
/// <reference path="../extensions/modal.js" />
/// <reference path="../extensions/pagination.js" />
/// <reference path="../extensions/regularExp.js" />
/// <reference path="../extensions/selectors.js" />
/// <reference path="../extensions/spinner.js" />
/// <reference path="../extensions/urls.js" />
/// <reference path="AccountController.js" />
/// <reference path="AppController.js" />
/// <reference path="controllers.js" />
/// <reference path="homeController.js" />
/// <reference path="initialize.js" />
/// <reference path="../component/component.list.js" />
/// <reference path="../component/component.js" />


;$.app.controllers = $.app.controllers || {};
$.app.controllers.accountController = {
    // any thing related to controllers.
    pageId: "account-controller",
    $pageElement: null,
    prop: {
        /// populated from bindEvents.orderingTextBoxChange
        tracker: null,
        formId: "form-id-",
        youtubePlayableBtnId: "apps-preview"
    },
    isDebugging: true,
    initialize: function () {
        /// <summary>
        /// config elements
        /// </summary>
    },
    getPage: function() {
        return $.app.controllers.accountController.$pageElement;
    },
    config :  function() {
        
    },
    actions: {
        /// <summary>
        /// Represents the collection of actions exist inside a controller.
        /// </summary>
        register: function () {
            /// <summary>
            /// Represents list action page.
            /// Refers to the data-action attribute.
            /// </summary>
            /// <returns type=""></returns>
            //var self = $.app.controllers.accountController,
            //    $page = self.getPage(),
            //    prop = self.prop;
            //$form = ;
            // urlSchema = $.app.urls.getGeneralUrlSchema(false, ["SaveOrder"]); // pass nothing will give Create,Edit,Delete,Index url
            // urlSchema.edit  will give edit url.
            //var $form = $page.find(".register-form"),
            //    $inputs = $form.find("input:not([type='hidden'])");
            //for (var i = 0; i < $inputs.length; i++) {
            //    var $input = $($inputs[i]);
            //    $input.val("uioui123");
            //}
            ////$form.submit(function(e) {
            ////    e.preventDefault();
            ////});
        }
    },

    bindEvents: {
        
    }

}


///#source 1 1 /JavaScript-Mvc-framework/controllers/app-controller.js
/// <reference path="../extensions/ajax.js" />
/// <reference path="../extensions/clone.js" />
/// <reference path="../extensions/constants.js" />
/// <reference path="../extensions/hiddenContainer.js" />
/// <reference path="../extensions/inputChangeTracker.js" />
/// <reference path="../extensions/modal.js" />
/// <reference path="../extensions/pagination.js" />
/// <reference path="../extensions/regularExp.js" />
/// <reference path="../extensions/selectors.js" />
/// <reference path="../extensions/spinner.js" />
/// <reference path="../libs/DevOrgPlugins/WeReviewApps.js" />
/// <reference path="../libs/jquery.blockUI.js" />
/// <reference path="../extensions/urls.js" />
/// <reference path="../libs/toastr.js" />
/// <reference path="../libs/underscore.js" />
/// <reference path="../byId.js" />
/// <reference path="../controllers.js" />
/// <reference path="../jQueryCaching.js" />
/// <reference path="../jQueryExtend.fn.js" />
/// <reference path="../app.global.js" />
/// <reference path="../jQueryExtend.js" />
/// <reference path="../schema/hashset.js" />
/// <reference path="../attachInitialize.js" />
/// <reference path="../schema/schema.js" />
/// <reference path="../libs/jQuery/jquery-2.2.3.intellisense.js" />
/// <reference path="../schema/url.js" />
/// <reference path="../Prototype/Array.js" />


//;$.app.controllers = $.app.controllers || {};
$.app.controllers.appController = {
    // any thing related to controllers.
    pageId: "app-controller",
    $pageElement: null,
    prop: {
        /// populated from bindEvents.orderingTextBoxChange
        tracker: null,
        formId: "form-id-",
        youtubePlayableBtnId: "apps-preview"
    },
    isDebugging: true,
    initialize: function () {
        //anything to config
    },
    getPage: function () {
        return $.app.controllers.appController.$pageElement;
    },
    config: function () {

    },
    actions: {
        /// <summary>
        /// Represents the collection of actions exist inside a controller.
        /// </summary>
        SingleAppDisplay: function () {
            /// <summary>
            /// Represents list action page.
            /// Refers to the data-action attribute.
            /// </summary>
            /// <returns type=""></returns>
            var self = $.app.controllers.appController,
                $page = self.getPage(),
                prop = self.prop,
                urlSchema = $.app.urls.getGeneralUrlSchema(false, ["SaveOrder"]); // pass nothing will give Create,Edit,Delete,Index url
            // urlSchema.edit  will give edit url.


            // bind events
            self.bindEvents.youtubePlayBtnClick();



            $.frontEndAppDetailsPage = {
                $showMoreBtnContainer: [],
                $showMoreBtns: [],
                $showLessBtns: [],
                $moreExcert: [],
                execute: function () {
                    this.$showMoreBtnContainer = $(".show-more-btns-container");
                    this.$showMoreBtns = $(".see-more-btn");
                    this.$showLessBtns = $(".less-btn");
                    this.$moreExcert = $(".more");
                    if (this.$moreExcert.length > 0) {
                        this.$moreExcert.hide();
                    }

                    var $numberElement = $(".app-viewed-numbers");
                    if ($numberElement.length > 0) {
                        $numberElement.number(true);
                    }

                    this.$showMoreBtns.click(function () {
                        var $this = $(this);
                        var moreReference = $this.attr("data-ref");
                        var dataId = $this.attr("data-id");
                        var dataRefSelector;
                        var dataIdSelector = _.isUndefined(dataId) === false ? "[data-id='" + dataId + "']" : "";
                        if (_.isUndefined(moreReference) === false) {
                            dataRefSelector = "[data-ref='" + moreReference + "']" + dataIdSelector + ":first";

                            var $specificMoreExcertFound = $.frontEndAppDetailsPage.$moreExcert.filter(dataRefSelector);
                            if ($specificMoreExcertFound.length > 0) {
                                $specificMoreExcertFound.show("slow");
                                $specificMoreExcertFound.css("display", "inline");
                            }
                            var $moreBtnContainer = $.frontEndAppDetailsPage.$showMoreBtnContainer.filter(dataRefSelector);
                            if ($moreBtnContainer.length > 0) {
                                $moreBtnContainer.hide("slow");
                            }
                        }
                    });

                    this.$showLessBtns.click(function () {
                        var $this = $(this);
                        var moreReference = $this.attr("data-ref");
                        var dataId = $this.attr("data-id");
                        var dataRefSelector;
                        var dataIdSelector = _.isUndefined(dataId) === false ? "[data-id='" + dataId + "']" : "";
                        if (_.isUndefined(moreReference) === false) {
                            dataRefSelector = "[data-ref='" + moreReference + "']" + dataIdSelector + ":first";

                            var $specificMoreExcertFound = $.frontEndAppDetailsPage.$moreExcert.filter(dataRefSelector);
                            if ($specificMoreExcertFound.length > 0) {
                                $specificMoreExcertFound.hide("slow");
                            }
                            var $moreBtnContainer = $.frontEndAppDetailsPage.$showMoreBtnContainer.filter(dataRefSelector);
                            if ($moreBtnContainer.length > 0) {
                                $moreBtnContainer.show("slow");
                            }
                        }
                    });
                }
            };
            $.frontEndAppDetailsPage.execute();

            // create tracker

        }
    },

    bindEvents: {
        youtubePlayBtnClick: function () {
            var self = $.app.controllers.appController,
                $page = self.getPage(),
                prop = self.prop;

            var $youtubeVideoContainer = $.findCachedId(prop.youtubePlayableBtnId);
            if ($youtubeVideoContainer.length === 1) {
                $youtubeVideoContainer.find(".playable-btn").click(function () {
                    var $iframe = $youtubeVideoContainer.find("iframe");
                    var $this = $(this);
                    if ($iframe.length === 1) {
                        $iframe[0].src += "?rel=0&controls=1&autoplay=1";
                        $this.hide("slow");
                        $this.unbind("click");//or some other way to make sure that this only happens once
                    }
                });
            }
        },
        getReviewForm: function (e, $this) {
            e.preventDefault();
            var $container = $this.getReferenceIdElement();
            var cls = "already-embedded",
                reviewsControllerPageId = "reviews-controller",
                spinnerMessage = null; // 
            if (!$container.hasClass(cls)) {
                $container.addClass(cls);
                $container.hide();
                // inputs to load the review write form only via url
                var reqVerifyFieldsArray = $("#review-request-fields").find("input").serializeArray();
                //console.log(reqVerifyFields);
                $.ajax({
                    type: "POST",
                    dataType: "html",
                    url: $this.getUrlString(),
                    data: reqVerifyFieldsArray,
                    success: function (response) {
                        //var $response = $(response);
                        $container.html(response);
                        $container.show("slow");
                        //var $form = $response.filter("form");
                        //displayModal(htmlResponse);
                        var $form = $.byId(reviewsControllerPageId);
                        if ($form.hasClass("write")) {
                            //stop submitting and go through the processes and pages
                            $.devOrg.uxFriendlySlide("#" + reviewsControllerPageId,
                                true,
                                true //don't submit
                            );
                        }
                        $.app.controllers.initialize("reviews"); //init reviews controller.
                        // Now from reviews controller there is form submit event in the bindEvents json
                        // that method will take care of the rest and submit the form to the appropriate section.
                    },
                    beforeSend: function () {
                        $.app.spinner.show(spinnerMessage);
                    }
                }).always(function () {
                    $.app.spinner.hide();
                });
            } else {
                $container.toggle("slow");

            }
        }

    }
}

///#source 1 1 /JavaScript-Mvc-framework/controllers/home-controller.js
/// <reference path="../extensions/ajax.js" />
/// <reference path="../extensions/clone.js" />
/// <reference path="../extensions/constants.js" />
/// <reference path="../extensions/hiddenContainer.js" />
/// <reference path="../extensions/inputChangeTracker.js" />
/// <reference path="../extensions/modal.js" />
/// <reference path="../extensions/pagination.js" />
/// <reference path="../extensions/regularExp.js" />
/// <reference path="../extensions/selectors.js" />
/// <reference path="../extensions/spinner.js" />
/// <reference path="../libs/DevOrgPlugins/WeReviewApps.js" />
/// <reference path="../libs/jquery.blockUI.js" />
/// <reference path="../extensions/urls.js" />
/// <reference path="../libs/toastr.js" />
/// <reference path="../libs/underscore.js" />
/// <reference path="../byId.js" />
/// <reference path="../controllers.js" />
/// <reference path="../jQueryCaching.js" />
/// <reference path="../jQueryExtend.fn.js" />
/// <reference path="../app.global.js" />
/// <reference path="../jQueryExtend.js" />
/// <reference path="../schema/hashset.js" />
/// <reference path="../attachInitialize.js" />
/// <reference path="../schema/schema.js" />
/// <reference path="../libs/jQuery/jquery-2.2.3.intellisense.js" />
/// <reference path="../schema/url.js" />
/// <reference path="../Prototype/Array.js" />

$.app.controllers.homeController = {
    // any thing related to controllers.
    pageId: "home",
    $pageElement: null,
    initialize: function () {
        //anything to config

    },
    isDebugging: true,
    actions: {
        /// <summary>
        /// Represents the collection of actions exist inside a controller.
        /// </summary>
        index: function () {
            /// <summary>
            /// Represents index action page.
            /// Refers to the data-action attribute.
            /// </summary>
            /// <returns type=""></returns>
            var self = $.app.controllers.homeController,
                urlSchema = $.app.url.getGeneralUrlSchema(); // pass nothing will give add,edit,save,delete url
            
        }

    }
}
///#source 1 1 /JavaScript-Mvc-framework/controllers/reviews-controller.js
/// <reference path="../extensions/ajax.js" />
/// <reference path="../extensions/clone.js" />
/// <reference path="../extensions/constants.js" />
/// <reference path="../extensions/hiddenContainer.js" />
/// <reference path="../extensions/inputChangeTracker.js" />
/// <reference path="../extensions/modal.js" />
/// <reference path="../extensions/pagination.js" />
/// <reference path="../extensions/regularExp.js" />
/// <reference path="../extensions/selectors.js" />
/// <reference path="../extensions/spinner.js" />
/// <reference path="../libs/DevOrgPlugins/WeReviewApps.js" />
/// <reference path="../libs/jquery.blockUI.js" />
/// <reference path="../extensions/urls.js" />
/// <reference path="../libs/toastr.js" />
/// <reference path="../libs/underscore.js" />
/// <reference path="../byId.js" />
/// <reference path="../controllers.js" />
/// <reference path="../jQueryCaching.js" />
/// <reference path="../jQueryExtend.fn.js" />
/// <reference path="../app.global.js" />
/// <reference path="../jQueryExtend.js" />
/// <reference path="../schema/hashset.js" />
/// <reference path="../attachInitialize.js" />
/// <reference path="../schema/schema.js" />
/// <reference path="../libs/jQuery/jquery-2.2.3.intellisense.js" />
/// <reference path="../schema/url.js" />
/// <reference path="../Prototype/Array.js" />
/// <reference path="../app.js" />

$.app.controllers.reviewsController = {
    // any thing related to controllers.
    pageId: "reviews-controller",
    $pageElement: null,
    prop: {
        /// populated from bindEvents.orderingTextBoxChange
        tracker: null
    },
    isDebugging: true,
    initialize: function () {
        //anything to config
    },
    getPage: function () {
        return $.app.controllers.reviewsController.$pageElement;
    },
    config: function () {

    },
    actions: {
        /// <summary>
        /// Represents the collection of actions exist inside a controller.
        /// </summary>
        //write: function () {
        //    /// <summary>
        //    /// Represents list action page.
        //    /// Refers to the data-action attribute.
        //    /// </summary>
        //    /// <returns type=""></returns>
        //    //var self = $.app.controllers.reviewsController,
        //    //    $page = self.getPage(),
        //    //    prop = self.prop,
        //    //    urlSchema = $.app.urls.getGeneralUrlSchema(false, ["SaveOrder"]); // pass nothing will give Create,Edit,Delete,Index url
        //    // urlSchema.edit  will give edit url.

        //    //console.log(this);

        //}
    },

    bindEvents: {
        reviewFormSubmit: function (evt, $form) {
            evt.preventDefault(); //stop from submitting.
            console.log($form);
            var currformData = 0,
                url = $form.attr("action"),
                $inputs = $form.find("input"),
                $btn = $.findCachedId("review-submit-btn"),
                $icon = $btn.find("i"),
                $comment = $("#Comments"),
                commentValue = $comment.val();
            if ($.devOrg.checkValidInputs($inputs) && !$.isEmpty(commentValue)) {
                currformData = $form.serializeArray();
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url,
                    data: currformData,
                    beforeSend: function () {
                        $.app.spinner
                            .toggleSpinnerWithBtnPlusUIBlock($btn, $icon);
                    }
                }).done(function (response) {
                    console.log(response);
                    var isDone = response.isDone;
                    if (isDone) {
                        // reload the page, because we can't change the review from here.
                        location.reload(true);
                        //$container.fadeOut("slow");
                    } else {
                        toastr["error"]("Sorry! Failed to update or post the review.", "Failed");
                    }
                }).fail(function (jqXHR, textStatus, exceptionMessage) {
                    console.log("Request failed: " + exceptionMessage);
                }).always(function () {
                    $.app.spinner
                      .toggleSpinnerWithBtnPlusUIBlock($btn, $icon);
                });
            }
        }
    }

}


///#source 1 1 /JavaScript-Mvc-framework/controllers/tags-controller.js
/// <reference path="../../../jQueryExtend.js" />
/// <reference path="../../../extensions/spinner.js" />
/// <reference path="../../../extensions/ajax.js" />
/// <reference path="../../../extensions/pagination.js" />
/// <reference path="../../../extensions/selectors.js" />
/// <reference path="../../../extensions/urls.js" />
/// <reference path="../../../extensions/constants.js" />
/// <reference path="../../../extensions/ajax.js" />
/// <reference path="../../../controllers/controllers.js" />
/// <reference path="../../../controllers/initialize.js" />
/// <reference path="../../../app.global.js" />
/// <reference path="../../../app.js" />
/// <reference path="../../../app.run.js" />
/// <reference path="../../../byId.js" />
/// <reference path="../../../extensions/inputChangeTracker.js" />
/// <reference path="../../../ProtoType/Array.js" />
/// <reference path="../../../extensions/spinner.js" />
/// <reference path="../app.executeAfter.js" />
/// <reference path="../app.executeBefore.js" />
/// <reference path="../app.global.js" />
/// <reference path="../app.config.js" />
/// <reference path="../jQueryCaching.js" />
/// <reference path="../jQueryExtend.js" />
/// <reference path="../jQueryExtend.fn.js" />

$.app.controllers.tagsController = {
    // any thing related to controllers.
    pageId: "tags-controller",
    $pageElement: null,
    prop: {
        /// populated from bindEvents.orderingTextBoxChange
        tracker: null,
        formId: "form-id-",
        youtubePlayableBtnId: "apps-preview"
    },
    isDebugging: true,
    initialize: function () {
        /// <summary>
        /// anything to config
        /// </summary>
    },
    getPage: function() {
        return $.app.controllers.tagsController.$pageElement;
    },
    config :  function() {
        
    },
    actions: {
        /// <summary>
        /// Represents the collection of actions exist inside a controller.
        /// </summary>
        index: function () {
            /// <summary>
            /// Represents list action page.
            /// Refers to the data-action attribute.
            /// </summary>
            /// <returns type=""></returns>
            //var self = $.app.controllers.tagsController,
            //    $page = self.getPage(),
            //    prop = self.prop;
                //urlSchema = $.app.urls.getGeneralUrlSchema(false, ["SaveOrder"]); // pass nothing will give Create,Edit,Delete,Index url
            // urlSchema.edit  will give edit url.

            //console.log($page);
            //console.log($page.attr("data-hello"));
            
            // create tracker

        }
    },

    bindEvents: {
        
    }

}


///#source 1 1 /JavaScript-Mvc-framework/areas/admin/controllers/navItems-controller.js
/// <reference path="../../../jQueryExtend.js" />
/// <reference path="../../../extensions/spinner.js" />
/// <reference path="../../../extensions/ajax.js" />
/// <reference path="../../../extensions/pagination.js" />
/// <reference path="../../../extensions/selectors.js" />
/// <reference path="../../../extensions/urls.js" />
/// <reference path="../../../extensions/constants.js" />
/// <reference path="../../../extensions/ajax.js" />
/// <reference path="../../../controllers/controllers.js" />
/// <reference path="../../../controllers/initialize.js" />
/// <reference path="../../../app.global.js" />
/// <reference path="../../../app.js" />
/// <reference path="../../../app.run.js" />
/// <reference path="../../../byId.js" />
/// <reference path="D:\Working\GitHub\WereViewProject\WeReviewApp\Content/Scripts/jquery-2.1.4.js" />
/// <reference path="../../../extensions/inputChangeTracker.js" />
/// <reference path="../../../ProtoType/Array.js" />
/// <reference path="../../../extensions/spinner.js" />

;$.app.controllers = $.app.controllers || {};
$.app.controllers.navItemsController = {
    // any thing related to controllers.
    pageId: "navitems-controller",
    $pageElement: null,
    prop: {
        /// populated from bindEvents.orderingTextBoxChange
        tracker: null,
        formId: "form-id-"
    },
    isDebugging: true,
    initialize: function () {

    },
    getPage: function() {
        return $.app.controllers.navItemsController.$pageElement;
    },
    config :  function() {
        
    },
    actions: {
        /// <summary>
        /// Represents the collection of actions exist inside a controller.
        /// </summary>
        list: function() {
            /// <summary>
            /// Represents list action page.
            /// Refers to the data-action attribute.
            /// </summary>
            /// <returns type=""></returns>
            var self = $.app.controllers.navItemsController,
                $page = self.getPage(),
                urlSchema = $.app.urls.getGeneralUrlSchema(false, ["SaveOrder"]); // pass nothing will give Create,Edit,Delete,Index url
            // urlSchema.edit  will give edit url.


            // create tracker
            var $allInputs = $(".ordering-textbox");
            self.prop.tracker = $.app.inputChangeTracker.createTracker($allInputs);

            // bind events
            self.bindEvents.saveOrderButtonClick(urlSchema.SaveOrder);
            self.bindEvents.onBlurInputs($allInputs, urlSchema.SaveOrder);



            console.log(urlSchema);
        }
    },

    bindEvents: {
        onBlurInputs: function ($allInputs) {
            var self = $.app.controllers.navItemsController,
                tracker = self.prop.tracker;
            $allInputs.on('blur', function () {
                var $input = $(this),
                    $tr = $input.parent().parent().parent();
                console.log($tr);
                if (tracker.isChanged($input)) {
                    $tr.addClass("changed-row");
                } else {
                    $tr.removeClass("changed-row");
                }
            });
        },
        saveOrderButtonClick: function(saveingUrl) {
            var $saveBtn = $.byId("save-order-btn");
            var self = $.app.controllers.navItemsController,
                $page = self.getPage(),
                prop = self.prop,
                tracker = prop.tracker,
                formIdFormat = prop.formId;

            var getFormsData = function (ids, formIdFormat) {
                var formArray = new Array(ids.length);
                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i],
                        $form = $.byId(formIdFormat + id);
                    formArray[i] = $.serializeToJson($form);
                }
                return JSON.stringify(formArray);
            }

            $saveBtn.click(function(e) {
                e.preventDefault();
                // changed inputs ids array, only contains id values.
                var idsArray = tracker.getChangedInputsAttrArray("data-id");
                var data = getFormsData(idsArray, formIdFormat);
                var isInTestingMode = true;
                jQuery.ajax({
                    method: "POST", // by default "GET"
                    url: saveingUrl,
                    data: data, // PlainObject or String or Array
                    dataType: "JSON", //, // "Text" , "HTML", "xml", "script" 
                    contentType: "application/json", // must add this line for server json submit
                }).done(function (response) {
                    if (isInTestingMode) {
                        console.log(response);
                    }
                }).fail(function (jqXHR, textStatus, exceptionMessage) {
                    console.log("Request failed: " + exceptionMessage);
                }).always(function () {
                    console.log("complete");
                });
                console.log(idsArray);
                console.log(data);
            });
        }
    }

}


///#source 1 1 /JavaScript-Mvc-framework/component/component.list.js
/// <reference path="../libs/jQuery/jquery-2.2.3.js" />
/// <reference path="../libs/jQuery/jquery-2.2.3.intellisense.js" />
/// <reference path="../jQueryCaching.js" />
/// <reference path="../app.js" />
/// <reference path="../Prototype/Array.js" />
/// <reference path="../extensions/selectors.js" />
; $.app = $.app || {};
; $.app.component = $.app.component || {};
; $.app.component.list = $.app.component.list || {};

/**
 * Loads this component if this string value present in the hidden field of "Component-Enable"
 * Please add a hidden with id "Component-Enable"
 * <input id="Component-Enable" value="revolution-gallery,form-validation,enter-to-focus-next(id)" />
 * @returns {} 
 */

$.app.component.list = {
    "enter-to-focus-next": function (id, submitAtLast, atLastFocusOnFirst) {
        submitAtLast = $.setDefaultBoolOnEmpty(submitAtLast, false);
        atLastFocusOnFirst = $.setDefaultBoolOnEmpty(atLastFocusOnFirst, true);
        var $form = $.byId(id);
        $.app.global.enterToNextInputFocus($form, submitAtLast, atLastFocusOnFirst);
    },
    "enter-to-focus-next-no-tags": function (id, submitAtLast, isDynamicSelector, atLastFocusOnFirst) {
        submitAtLast = $.setDefaultBoolOnEmpty(submitAtLast, false);
        isDynamicSelector = $.setDefaultBoolOnEmpty(isDynamicSelector, false);
        atLastFocusOnFirst = $.setDefaultBoolOnEmpty(atLastFocusOnFirst, true);
        var $form = $.byId(id);
        $.app.global.enterToNextInputFocusWithoutTags($form, submitAtLast, isDynamicSelector, atLastFocusOnFirst);
    },
    "revolution-gallery": function () {
        var $frontPageGallyery = $(".tp-banner");
        if ($frontPageGallyery.length > 0) {
            $frontPageGallyery.show().revolution({
                dottedOverlay: "none",
                delay: 5000,
                startwidth: 960,
                startheight: 320,
                hideThumbs: 10,
                fullWidth: "off",
                navigationType: "bullet",
                navigationStyle: "preview2",
                forceFullWidth: "off"
            });
        }
    },
    "wow" : function() {
        var wow = new WOW({
            boxClass: 'wow', // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset: 100, // distance to the element when triggering the animation (default is 0)
            mobile: false // trigger animations on mobile devices (true is default)
        });
        wow.init();
    },
    "form-validation": function () {
        var app = $.app,
            $processForm = app.getProcessForm(); // get the form #server-validation-form


        if ($processForm.length > 0) {
            var $submitBtn = $.byId("submit-btn");
            $processForm.serverValidate({
                crossDomain: false,
                multipleRequests: true,
                checkValidationBeforeSendingRequest: true,
                dontSendSameRequestTwice: false,
                disableInputOnValidation: false,
                focusPersistIfNotValid: false,
                hideOnValidation: false,
                $formElement: $processForm,
                $submitButton : $submitBtn,
                triggerValidationBeforeFormSubmit: true
            });
        }
    },
    "tag": function () {
        var app = $.app,
            $processForm = app.getProcessForm();

        if ($processForm.length > 0) {
            var $createdTags = $(".tag-inputs");
            if ($createdTags.length > 0) {
                var $tokenField = $processForm.find("[name='__RequestVerificationToken']"),
                    token = $tokenField.val();
                for (var i = 0; i < $createdTags.length; i++) {
                    var $tagsInput = $($createdTags[0]),
                        urlToPost = $tagsInput.attr("data-url");
                    //
                    $tagsInput.tagsinput({
                        freeInput: true,
                        trimValue: true,
                        typeahead: {
                            source: function (query) {
                                return $.post(urlToPost, { id: query, __RequestVerificationToken: token }).done(function (response) {
                                    //console.log("tags:");
                                    //console.log("response:");
                                    //console.log(response);
                                });
                            }
                        },
                        onTagExists: function (item, $tag) {
                            if ($.isEmpty($tag)) {
                                $tag.hide.fadeIn();
                            }
                        }
                    });
                }
            }

        }
    },
    "isotop": function () {
        var $isotopContainer = $(".search-page-apps-list");
        if ($isotopContainer.length > 0) {
            var $filterIsotopItems = $('.filter').find("li").find("a");
            if ($filterIsotopItems.length > 0) {
                $filterIsotopItems.click(function () {
                    $filterIsotopItems.removeClass('active');
                    $(this).addClass('active');
                    var selector = $(this).attr('data-filter');

                    $isotopContainer.isotope({
                        filter: selector
                    });
                    return false;
                });
            }
        }
    },
    "convert-youtube-link-to-embed": function () {
        /// <summary>
        /// Add id "youtube-link-convert" on input or put the input as "#server-validation-form .youtube-link-convert"
        /// then it will work.
        /// </summary>
        var app = $.app,
            cssClass = "youtube-link-convert",
            $anyInputs = $.findCachedId(cssClass),
            $processForm = app.getProcessForm(),
            $inputs = [],
            isGivenUrlMatchedDomain = app.global.isGivenUrlMatchedDomain;

        if ($anyInputs.length > 0) {
            $inputs = $anyInputs;
        } else if ($processForm.length > 0) {
            $inputs = $processForm.find("." + cssClass);
        }

        if ($inputs.length > 0) {
            $inputs.blur(function () {
                var $this = $(this),
                    text = $this.val();
                if (!$.isEmpty(text) && text.indexOf("<iframe") === -1 && isGivenUrlMatchedDomain(text, "youtu\.be|youtube\.com")) {
                    text = text.replace(/(?:https:\/\/|http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '$1');
                    var split = text.split("&");
                    var id = split[0];
                    var html = "<iframe src=\"//youtube.com/embed/" + id + "\" frameborder=\"0\" allowfullscreen></iframe>";
                    $this.val(html);
                }
            });
        }
    },
    "owl-carousel": function () {
        var owlOptions = {
            responsiveClass: true,
            navigation: true,
            navigationText: [
                "<i class='fa fa-chevron-circle-left'></i>",
                "<i class='fa fa-chevron-circle-right'></i>"
            ],
            items: 1, //10 items above 1000px browser width
            //itemsDesktop: [1152, 6], //5 items between 1000px and 901px
            //itemsDesktopSmall: [900, 4], // betweem 900px and 601px
            //itemsTablet: [600, 3], //2 items between 600 and 0
            //itemsMobile: [450, 2],
            itemsCustom: [370, 1]
        };

        $(".app-suggested-list-items-mobile").owlCarousel(owlOptions);
        $(".featured-apps-list-items").owlCarousel(owlOptions);

        var $suggestionCarosel = $(".owl-list");
        if ($suggestionCarosel.length > 0) {
            $suggestionCarosel.owlCarousel({
                navigation: true,
                navigationText: [
                    "<i class='fa fa-chevron-circle-left'></i>",
                    "<i class='fa fa-chevron-circle-right'></i>"
                ],
                items: 7, //10 items above 1000px browser width
                itemsDesktop: [1152, 6], //5 items between 1000px and 901px
                itemsDesktopSmall: [966, 5], // betweem 900px and 601px
                itemsTabletSmall: [730, 4],
                itemsTablet: [600, 3], //2 items between 600 and 0
                //itemsCustom: [[0, 2], [435, 3], [450, 2], [600, 3], [730, 4], [900, 5],  [950, 6]], // [[740, 6], [1000, 8], [1200, 10], [1600, 16]]
                itemsMobile: [450, 2]
            });
        }

        var $appsPreview = $.findCachedId("apps-preview");
        if ($appsPreview.length > 0) {
            $appsPreview.owlCarousel({
                slideSpeed: 300,
                paginationSpeed: 400,
                singleItem: true,
                items: 1,
                itemsDesktop: false,
                itemsDesktopSmall: false,
                itemsTablet: false,
                itemsMobile: false,
                stopOnHover: true,
                navigation: true, // Show next and prev buttons
                pagination: false,
                autoHeight: true,
                navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
            });
        }
    }
}

///#source 1 1 /JavaScript-Mvc-framework/events/binding.js
; $.app = $.app || {};
; $.app.events = $.app.events || {};
/**
 * Use "data-event-binding" attribute with js controller to execute specific events or write using csv or use * for finding all events if exist.
 */
; $.app.events.binding = {
    executeAll: function($controller) {
        var list = $.app.events.list, i,
            event;
        for (i = 0; i < list.length; i++) {
            event = list[i];
            $.executeFunctionWithArguments(event, [$controller]);
        }
    },
    execute: function ($controller, csvEvents) {
        var events = csvEvents.split(","),
            i,
            list = $.app.events.list,
            eventName,
            event;
        for (i = 0; i < events.length; i++) {
            eventName = events[i];
            event = list[eventName];
            $.executeFunctionWithArguments(event, [$controller]);
        }
    }
}
///#source 1 1 /JavaScript-Mvc-framework/events/list.js
; $.app = $.app || {};
; $.app.events = $.app.events || {};
/**
 * Use "data-event-binding" attribute with js controller to execute specific events or write using csv or use * for finding all events if exist.
 */
; $.app.events.list = {
    click: function ($controller) {
        var name = "click",
            attr = "data-" + name,
            $page = $controller.$pageElement,
            $elements = $page.find("[" + attr + "]");
        if ($elements.length > 0) {
            $elements.click(function (e) {
                var $this = $(this),
                    name = $this.attr(attr),
                    executingEvent = $controller.bindEvents[name];
                if ($.executeFunctionWithArguments(executingEvent, [e, $this, name]) === false) {
                    console.log($controller);
                    throw new Error("Controller(pageId:" + $controller.pageId + ") doesn't have [" + name + "()] method in the bindEvents. Please add that.");
                }
            });
        }
    },
    submit: function ($controller) {
        var name = "submit",
            attr = "data-" + name,
            $page = $controller.$pageElement,
            $elements = $page.find("[" + attr + "]");
        if ($elements.length > 0) {
            $elements.submit(function (e) {
                var $this = $(this),
                    name = $this.attr(attr),
                    executingEvent = $controller.bindEvents[name];
                if ($.executeFunctionWithArguments(executingEvent, [e, $this, name]) === false) {
                    console.log($controller);
                    throw new Error("Controller(pageId:" + $controller.pageId + ") doesn't have [" + name + "()] method in the bindEvents. Please add that.");
                }
            });
        }
    }

}
///#source 1 1 /JavaScript-Mvc-framework/app.run.js
/// <reference path="app.initialize.js" />
/// <reference path="app.js" />
/// <reference path="app.run.js" />
/// <reference path="jQueryExtend.js" />
/// <reference path="../Controllers/controllers.js" />
/// <reference path="../Controllers/initialize.js" />
/// <reference path="../Controllers/programsearch.js" />
/// <reference path="../jquery-2.1.4-vsdoc.js" />
/// <reference path="../find-byId.js" />
/// <reference path="attachInitialize.js" />
; $.app = $.app || {};
$.app.initialize = $.app.initialize || {};
$(document).ready(function () {
    $.app.initialize(); // initialize everything
});

window.onload = function () {
    var app = $.app;
    $.attachAndExecuteInitialize(app.executeAfter);
}
