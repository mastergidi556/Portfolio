var mod_pagespeed_DEB3ZxHMfK = "/*!\n * imagesLoaded PACKAGED v4.1.4\n * JavaScript is all like \"You images are done yet or what?\"\n * MIT License\n */\n\n/**\n * EvEmitter v1.1.0\n * Lil' event emitter\n * MIT License\n */\n\n /* jshint unused: true, undef: true, strict: true */\n\n ( function( global, factory ) {\n  // universal module definition\n  /* jshint strict: false */ /* globals define, module, window */\n  if ( typeof define == 'function' && define.amd ) {\n    // AMD - RequireJS\n    define( 'ev-emitter/ev-emitter',factory );\n  } else if ( typeof module == 'object' && module.exports ) {\n    // CommonJS - Browserify, Webpack\n    module.exports = factory();\n  } else {\n    // Browser globals\n    global.EvEmitter = factory();\n  }\n\n}( typeof window != 'undefined' ? window : this, function() {\n\n\n\n  function EvEmitter() {}\n\n  var proto = EvEmitter.prototype;\n\n  proto.on = function( eventName, listener ) {\n    if ( !eventName || !listener ) {\n      return;\n    }\n  // set events hash\n  var events = this._events = this._events || {};\n  // set listeners array\n  var listeners = events[ eventName ] = events[ eventName ] || [];\n  // only add once\n  if ( listeners.indexOf( listener ) == -1 ) {\n    listeners.push( listener );\n  }\n\n  return this;\n};\n\nproto.once = function( eventName, listener ) {\n  if ( !eventName || !listener ) {\n    return;\n  }\n  // add event\n  this.on( eventName, listener );\n  // set once flag\n  // set onceEvents hash\n  var onceEvents = this._onceEvents = this._onceEvents || {};\n  // set onceListeners object\n  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};\n  // set flag\n  onceListeners[ listener ] = true;\n\n  return this;\n};\n\nproto.off = function( eventName, listener ) {\n  var listeners = this._events && this._events[ eventName ];\n  if ( !listeners || !listeners.length ) {\n    return;\n  }\n  var index = listeners.indexOf( listener );\n  if ( index != -1 ) {\n    listeners.splice( index, 1 );\n  }\n\n  return this;\n};\n\nproto.emitEvent = function( eventName, args ) {\n  var listeners = this._events && this._events[ eventName ];\n  if ( !listeners || !listeners.length ) {\n    return;\n  }\n  // copy over to avoid interference if .off() in listener\n  listeners = listeners.slice(0);\n  args = args || [];\n  // once stuff\n  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];\n\n  for ( var i=0; i < listeners.length; i++ ) {\n    var listener = listeners[i]\n    var isOnce = onceListeners && onceListeners[ listener ];\n    if ( isOnce ) {\n      // remove listener\n      // remove before trigger to prevent recursion\n      this.off( eventName, listener );\n      // unset once flag\n      delete onceListeners[ listener ];\n    }\n    // trigger listener\n    listener.apply( this, args );\n  }\n\n  return this;\n};\n\nproto.allOff = function() {\n  delete this._events;\n  delete this._onceEvents;\n};\n\nreturn EvEmitter;\n\n}));\n\n/*!\n * imagesLoaded v4.1.4\n * JavaScript is all like \"You images are done yet or what?\"\n * MIT License\n */\n\n ( function( window, factory ) { 'use strict';\n  // universal module definition\n\n  /*global define: false, module: false, require: false */\n\n  if ( typeof define == 'function' && define.amd ) {\n    // AMD\n    define( [\n      'ev-emitter/ev-emitter'\n      ], function( EvEmitter ) {\n        return factory( window, EvEmitter );\n      });\n  } else if ( typeof module == 'object' && module.exports ) {\n    // CommonJS\n    module.exports = factory(\n      window,\n      require('ev-emitter')\n      );\n  } else {\n    // browser global\n    window.imagesLoaded = factory(\n      window,\n      window.EvEmitter\n      );\n  }\n\n})( typeof window !== 'undefined' ? window : this,\n\n// --------------------------  factory -------------------------- //\n\nfunction factory( window, EvEmitter ) {\n\n\n\n  var $ = window.jQuery;\n  var console = window.console;\n\n// -------------------------- helpers -------------------------- //\n\n// extend objects\nfunction extend( a, b ) {\n  for ( var prop in b ) {\n    a[ prop ] = b[ prop ];\n  }\n  return a;\n}\n\nvar arraySlice = Array.prototype.slice;\n\n// turn element or nodeList into an array\nfunction makeArray( obj ) {\n  if ( Array.isArray( obj ) ) {\n    // use object if already an array\n    return obj;\n  }\n\n  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';\n  if ( isArrayLike ) {\n    // convert nodeList to array\n    return arraySlice.call( obj );\n  }\n\n  // array of single index\n  return [ obj ];\n}\n\n// -------------------------- imagesLoaded -------------------------- //\n\n/**\n * @param {Array, Element, NodeList, String} elem\n * @param {Object or Function} options - if function, use as callback\n * @param {Function} onAlways - callback function\n */\n function ImagesLoaded( elem, options, onAlways ) {\n  // coerce ImagesLoaded() without new, to be new ImagesLoaded()\n  if ( !( this instanceof ImagesLoaded ) ) {\n    return new ImagesLoaded( elem, options, onAlways );\n  }\n  // use elem as selector string\n  var queryElem = elem;\n  if ( typeof elem == 'string' ) {\n    queryElem = document.querySelectorAll( elem );\n  }\n  // bail if bad element\n  if ( !queryElem ) {\n    console.error( 'Bad element for imagesLoaded ' + ( queryElem || elem ) );\n    return;\n  }\n\n  this.elements = makeArray( queryElem );\n  this.options = extend( {}, this.options );\n  // shift arguments if no options set\n  if ( typeof options == 'function' ) {\n    onAlways = options;\n  } else {\n    extend( this.options, options );\n  }\n\n  if ( onAlways ) {\n    this.on( 'always', onAlways );\n  }\n\n  this.getImages();\n\n  if ( $ ) {\n    // add jQuery Deferred object\n    this.jqDeferred = new $.Deferred();\n  }\n\n  // HACK check async to allow time to bind listeners\n  setTimeout( this.check.bind( this ) );\n}\n\nImagesLoaded.prototype = Object.create( EvEmitter.prototype );\n\nImagesLoaded.prototype.options = {};\n\nImagesLoaded.prototype.getImages = function() {\n  this.images = [];\n\n  // filter & find items if we have an item selector\n  this.elements.forEach( this.addElementImages, this );\n};\n\n/**\n * @param {Node} element\n */\n ImagesLoaded.prototype.addElementImages = function( elem ) {\n  // filter siblings\n  if ( elem.nodeName == 'IMG' ) {\n    this.addImage( elem );\n  }\n  // get background image on element\n  if ( this.options.background === true ) {\n    this.addElementBackgroundImages( elem );\n  }\n\n  // find children\n  // no non-element nodes, #143\n  var nodeType = elem.nodeType;\n  if ( !nodeType || !elementNodeTypes[ nodeType ] ) {\n    return;\n  }\n  var childImgs = elem.querySelectorAll('img');\n  // concat childElems to filterFound array\n  for ( var i=0; i < childImgs.length; i++ ) {\n    var img = childImgs[i];\n    this.addImage( img );\n  }\n\n  // get child background images\n  if ( typeof this.options.background == 'string' ) {\n    var children = elem.querySelectorAll( this.options.background );\n    for ( i=0; i < children.length; i++ ) {\n      var child = children[i];\n      this.addElementBackgroundImages( child );\n    }\n  }\n};\n\nvar elementNodeTypes = {\n  1: true,\n  9: true,\n  11: true\n};\n\nImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {\n  var style = getComputedStyle( elem );\n  if ( !style ) {\n    // Firefox returns null if in a hidden iframe https://bugzil.la/548397\n    return;\n  }\n  // get url inside url(\"...\")\n  var reURL = /url\\((['\"])?(.*?)\\1\\)/gi;\n  var matches = reURL.exec( style.backgroundImage );\n  while ( matches !== null ) {\n    var url = matches && matches[2];\n    if ( url ) {\n      this.addBackground( url, elem );\n    }\n    matches = reURL.exec( style.backgroundImage );\n  }\n};\n\n/**\n * @param {Image} img\n */\n ImagesLoaded.prototype.addImage = function( img ) {\n  var loadingImage = new LoadingImage( img );\n  this.images.push( loadingImage );\n};\n\nImagesLoaded.prototype.addBackground = function( url, elem ) {\n  var background = new Background( url, elem );\n  this.images.push( background );\n};\n\nImagesLoaded.prototype.check = function() {\n  var _this = this;\n  this.progressedCount = 0;\n  this.hasAnyBroken = false;\n  // complete if no images\n  if ( !this.images.length ) {\n    this.complete();\n    return;\n  }\n\n  function onProgress( image, elem, message ) {\n    // HACK - Chrome triggers event before object properties have changed. #83\n    setTimeout( function() {\n      _this.progress( image, elem, message );\n    });\n  }\n\n  this.images.forEach( function( loadingImage ) {\n    loadingImage.once( 'progress', onProgress );\n    loadingImage.check();\n  });\n};\n\nImagesLoaded.prototype.progress = function( image, elem, message ) {\n  this.progressedCount++;\n  this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;\n  // progress event\n  this.emitEvent( 'progress', [ this, image, elem ] );\n  if ( this.jqDeferred && this.jqDeferred.notify ) {\n    this.jqDeferred.notify( this, image );\n  }\n  // check if completed\n  if ( this.progressedCount == this.images.length ) {\n    this.complete();\n  }\n\n  if ( this.options.debug && console ) {\n    console.log( 'progress: ' + message, image, elem );\n  }\n};\n\nImagesLoaded.prototype.complete = function() {\n  var eventName = this.hasAnyBroken ? 'fail' : 'done';\n  this.isComplete = true;\n  this.emitEvent( eventName, [ this ] );\n  this.emitEvent( 'always', [ this ] );\n  if ( this.jqDeferred ) {\n    var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';\n    this.jqDeferred[ jqMethod ]( this );\n  }\n};\n\n// --------------------------  -------------------------- //\n\nfunction LoadingImage( img ) {\n  this.img = img;\n}\n\nLoadingImage.prototype = Object.create( EvEmitter.prototype );\n\nLoadingImage.prototype.check = function() {\n  // If complete is true and browser supports natural sizes,\n  // try to check for image status manually.\n  var isComplete = this.getIsImageComplete();\n  if ( isComplete ) {\n    // report based on naturalWidth\n    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );\n    return;\n  }\n\n  // If none of the checks above matched, simulate loading on detached element.\n  this.proxyImage = new Image();\n  this.proxyImage.addEventListener( 'load', this );\n  this.proxyImage.addEventListener( 'error', this );\n  // bind to image as well for Firefox. #191\n  this.img.addEventListener( 'load', this );\n  this.img.addEventListener( 'error', this );\n  this.proxyImage.src = this.img.src;\n};\n\nLoadingImage.prototype.getIsImageComplete = function() {\n  // check for non-zero, non-undefined naturalWidth\n  // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671\n  return this.img.complete && this.img.naturalWidth;\n};\n\nLoadingImage.prototype.confirm = function( isLoaded, message ) {\n  this.isLoaded = isLoaded;\n  this.emitEvent( 'progress', [ this, this.img, message ] );\n};\n\n// ----- events ----- //\n\n// trigger specified handler for event type\nLoadingImage.prototype.handleEvent = function( event ) {\n  var method = 'on' + event.type;\n  if ( this[ method ] ) {\n    this[ method ]( event );\n  }\n};\n\nLoadingImage.prototype.onload = function() {\n  this.confirm( true, 'onload' );\n  this.unbindEvents();\n};\n\nLoadingImage.prototype.onerror = function() {\n  this.confirm( false, 'onerror' );\n  this.unbindEvents();\n};\n\nLoadingImage.prototype.unbindEvents = function() {\n  this.proxyImage.removeEventListener( 'load', this );\n  this.proxyImage.removeEventListener( 'error', this );\n  this.img.removeEventListener( 'load', this );\n  this.img.removeEventListener( 'error', this );\n};\n\n// -------------------------- Background -------------------------- //\n\nfunction Background( url, element ) {\n  this.url = url;\n  this.element = element;\n  this.img = new Image();\n}\n\n// inherit LoadingImage prototype\nBackground.prototype = Object.create( LoadingImage.prototype );\n\nBackground.prototype.check = function() {\n  this.img.addEventListener( 'load', this );\n  this.img.addEventListener( 'error', this );\n  this.img.src = this.url;\n  // check if image is already complete\n  var isComplete = this.getIsImageComplete();\n  if ( isComplete ) {\n    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );\n    this.unbindEvents();\n  }\n};\n\nBackground.prototype.unbindEvents = function() {\n  this.img.removeEventListener( 'load', this );\n  this.img.removeEventListener( 'error', this );\n};\n\nBackground.prototype.confirm = function( isLoaded, message ) {\n  this.isLoaded = isLoaded;\n  this.emitEvent( 'progress', [ this, this.element, message ] );\n};\n\n// -------------------------- jQuery -------------------------- //\n\nImagesLoaded.makeJQueryPlugin = function( jQuery ) {\n  jQuery = jQuery || window.jQuery;\n  if ( !jQuery ) {\n    return;\n  }\n  // set local variable\n  $ = jQuery;\n  // $().imagesLoaded()\n  $.fn.imagesLoaded = function( options, callback ) {\n    var instance = new ImagesLoaded( this, options, callback );\n    return instance.jqDeferred.promise( $(this) );\n  };\n};\n// try making plugin\nImagesLoaded.makeJQueryPlugin();\n\n// --------------------------  -------------------------- //\n\nreturn ImagesLoaded;\n\n});\n";
var mod_pagespeed_zA_i6FjQGm = "AOS.init({\n	duration: 800,\n	easing: 'slide',\n	once: true\n});\n\njQuery(document).ready(function($) {\n\n	'use strict';\n\n	$(\".loader\").delay(200).fadeOut(\"slow\");\n	$(\"#overlayer\").delay(200).fadeOut(\"slow\");	\n\n	var siteMenuClone = function() {\n\n		$('.js-clone-nav').each(function() {\n			var $this = $(this);\n			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');\n		});\n\n\n		setTimeout(function() {\n			\n			var counter = 0;\n			$('.site-mobile-menu .has-children').each(function(){\n				var $this = $(this);\n				\n				$this.prepend('<span class=\"arrow-collapse collapsed\">');\n\n				$this.find('.arrow-collapse').attr({\n					'data-toggle' : 'collapse',\n					'data-target' : '#collapseItem' + counter,\n				});\n\n				$this.find('> ul').attr({\n					'class' : 'collapse',\n					'id' : 'collapseItem' + counter,\n				});\n\n				counter++;\n\n			});\n\n		}, 1000);\n\n		$('body').on('click', '.arrow-collapse', function(e) {\n			var $this = $(this);\n			if ( $this.closest('li').find('.collapse').hasClass('show') ) {\n				$this.removeClass('active');\n			} else {\n				$this.addClass('active');\n			}\n			e.preventDefault();  \n			\n		});\n\n		$(window).resize(function() {\n			var $this = $(this),\n			w = $this.width();\n\n			if ( w > 768 ) {\n				if ( $('body').hasClass('offcanvas-menu') ) {\n					$('body').removeClass('offcanvas-menu');\n				}\n			}\n		})\n\n		$('body').on('click', '.js-menu-toggle', function(e) {\n			var $this = $(this);\n			e.preventDefault();\n\n			if ( $('body').hasClass('offcanvas-menu') ) {\n				$('body').removeClass('offcanvas-menu');\n				$('body').find('.js-menu-toggle').removeClass('active');\n			} else {\n				$('body').addClass('offcanvas-menu');\n				$('body').find('.js-menu-toggle').addClass('active');\n			}\n		}) \n\n		// click outisde offcanvas\n		$(document).mouseup(function(e) {\n			var container = $(\".site-mobile-menu\");\n			if (!container.is(e.target) && container.has(e.target).length === 0) {\n				if ( $('body').hasClass('offcanvas-menu') ) {\n					$('body').removeClass('offcanvas-menu');\n					$('body').find('.js-menu-toggle').removeClass('active');\n				}\n			}\n		});\n	}; \n	siteMenuClone();\n\n	var owlPlugin = function() {\n		if ( $('.owl-2-slider').length > 0 ) {\n			var owl2 = $('.owl-2-slider').owlCarousel({\n				loop: true,\n				autoHeight: true,\n				margin: 40,\n				autoplay: true,\n				smartSpeed: 700,\n				items: 2,\n				stagePadding: 0,\n				nav: true,\n				dots: true,\n				navText: ['<span class=\"icon-keyboard_backspace\"></span>','<span class=\"icon-keyboard_backspace\"></span>'],\n				responsive:{\n					0:{\n						items:1\n					},\n					600:{\n						items:1\n					},\n					800: {\n						items:2\n					},\n					1000:{\n						items:2\n					},\n					1100:{\n						items:2\n					}\n				}\n			});\n\n			$('.js-custom-next-v2').click(function(e) {\n				e.preventDefault();\n				owl2.trigger('next.owl.carousel');\n			})\n			$('.js-custom-prev-v2').click(function(e) {\n				e.preventDefault();\n				owl2.trigger('prev.owl.carousel');\n			})\n		}\n		if ( $('.owl-3-slider').length > 0 ) {\n			var owl3 = $('.owl-3-slider').owlCarousel({\n				loop: true,\n				autoHeight: true,\n				margin: 40,\n				autoplay: true,\n				smartSpeed: 700,\n				items: 4,\n				stagePadding: 0,\n				nav: true,\n				dots: true,\n				navText: ['<span class=\"icon-keyboard_backspace\"></span>','<span class=\"icon-keyboard_backspace\"></span>'],\n				responsive:{\n					0:{\n						items:1\n					},\n					600:{\n						items:1\n					},\n					800: {\n						items:2\n					},\n					1000:{\n						items:2\n					},\n					1100:{\n						items:3\n					}\n				}\n			});\n		}\n		\n		if ( $('.owl-4-slider').length > 0 ) {\n			var owl4 = $('.owl-4-slider').owlCarousel({\n				loop: true,\n				autoHeight: true,\n				margin: 10,\n				autoplay: true,\n				smartSpeed: 700,\n				items: 4,\n				nav: false,\n				dots: true,\n				navText: ['<span class=\"icon-keyboard_backspace\"></span>','<span class=\"icon-keyboard_backspace\"></span>'],\n				responsive:{\n					0:{\n						items:1\n					},\n					600:{\n						items:2\n					},\n					800: {\n						items:2\n					},\n					1000:{\n						items:3\n					},\n					1100:{\n						items:4\n					}\n				}\n			});\n		}\n		\n\n		if ( $('.owl-single-text').length > 0 ) {\n			var owlText = $('.owl-single-text').owlCarousel({\n				loop: true,\n				autoHeight: true,\n				margin: 0,\n				autoplay: true,\n				smartSpeed: 1200,\n				items: 1,\n				nav: false,\n				navText: ['<span class=\"icon-keyboard_backspace\"></span>','<span class=\"icon-keyboard_backspace\"></span>']\n			});\n		}\n		if ( $('.owl-single').length > 0 ) {\n			var owl = $('.owl-single').owlCarousel({\n				loop: true,\n				autoHeight: true,\n				margin: 0,\n				autoplay: true,\n				smartSpeed: 800,\n				mouseDrag: false,\n				touchDrag: false,\n				items: 1,\n				nav: false,\n				navText: ['<span class=\"icon-keyboard_backspace\"></span>','<span class=\"icon-keyboard_backspace\"></span>'],\n				onChanged: changed,\n			});\n\n			function changed(event) {\n				var i = event.item.index;\n				if ( i == 0 || i == null) {\n					i = 1;\n				} else {\n					i = i - 1;\n\n					$('.js-custom-dots a').removeClass('active');\n					$('.js-custom-dots a[data-index=\"'+i+'\"]').addClass('active');\n				}				\n			}\n\n			$('.js-custom-dots a').each(function(i) {\n				var i = i + 1;\n				$(this).attr('data-index', i);\n			});\n\n			$('.js-custom-dots a').on('click', function(e){\n				e.preventDefault();\n				owl.trigger('stop.owl.autoplay');\n				var k = $(this).data('index');\n				k = k - 1;\n				owl.trigger('to.owl.carousel', [k, 500]);\n			})\n\n		}\n\n	}\n	owlPlugin();\n\n	var OnePageNavigation = function() {\n		var navToggler = $('.site-menu-toggle');\n		$(\"body\").on(\"click\", \".site-nav .site-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a\", function(e) {\n			e.preventDefault();\n			var hash = this.hash;\n			\n			$('html, body').animate({\n\n				scrollTop: $(hash).offset().top\n			}, 400, 'easeInOutExpo', function(){\n				window.location.hash = hash;\n			});\n\n		});\n\n    // $(\"#menu li a[href^='#']\").on('click', function(e){\n    //   e.preventDefault();\n    //   navToggler.trigger('click');\n    // });\n\n    $('body').on('activate.bs.scrollspy', function () {\n      // console.log('nice');\n      // alert('yay');\n    })\n  };\n  OnePageNavigation();\n\n  var scrollWindow = function() {\n  	$(window).scroll(function(){\n  		var $w = $(this),\n  		st = $w.scrollTop(),\n  		navbar = $('.js-site-navbar'),\n  		sd = $('.js-scroll-wrap'), \n  		toggle = $('.site-menu-toggle');\n\n      // if ( toggle.hasClass('open') ) {\n      //   $('.site-menu-toggle').trigger('click');\n      // }\n      \n\n      if (st > 150) {\n      	if ( !navbar.hasClass('scrolled') ) {\n      		navbar.addClass('scrolled');  \n      	}\n      } \n      if (st < 150) {\n      	if ( navbar.hasClass('scrolled') ) {\n      		navbar.removeClass('scrolled sleep');\n      	}\n      } \n      if ( st > 350 ) {\n      	if ( !navbar.hasClass('awake') ) {\n      		navbar.addClass('awake'); \n      	}\n      	\n      	if(sd.length > 0) {\n      		sd.addClass('sleep');\n      	}\n      }\n      if ( st < 350 ) {\n      	if ( navbar.hasClass('awake') ) {\n      		navbar.removeClass('awake');\n      		navbar.addClass('sleep');\n      	}\n      	if(sd.length > 0) {\n      		sd.removeClass('sleep');\n      	}\n      }\n    });\n  };\n  scrollWindow();\n\n  var counter = function() {\n  	\n  	$('.count-numbers').waypoint( function( direction ) {\n\n  		if( direction === 'down' && !$(this.element).hasClass('ut-animated') ) {\n\n  			var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')\n  			$('.counter > span').each(function(){\n  				var $this = $(this),\n  				num = $this.data('number');\n  				$this.animateNumber(\n  				{\n  					number: num,\n  					numberStep: comma_separator_number_step\n  				}, 5000\n  				);\n  			});\n  			\n  		}\n\n  	} , { offset: '95%' } );\n\n  }\n  counter();\n\n	// jarallax\n	var jarallaxPlugin = function() {\n		if ( $('.jarallax').length > 0 ) {\n			$('.jarallax').jarallax({\n				speed: 0.2\n			});\n		}\n	};\n	jarallaxPlugin();\n\n	\n\n	var accordion = function() {\n		$('.btn-link[aria-expanded=\"true\"]').closest('.accordion-item').addClass('active');\n		$('.collapse').on('show.bs.collapse', function () {\n			$(this).closest('.accordion-item').addClass('active');\n		});\n\n		$('.collapse').on('hidden.bs.collapse', function () {\n			$(this).closest('.accordion-item').removeClass('active');\n		});\n	}\n	accordion();\n\n\n	var unfocus = function() {\n		var links = $('.js-hover-focus-one .service-sm')\n		.mouseenter(function(){\n			links.addClass('unfocus');\n			$(this).removeClass('unfocus');\n		}).mouseleave(function(){\n			$(this).removeClass('unfocus');\n			links.removeClass('unfocus');\n		})\n	}\n	// unfocus()\n\n\n	var siteStellar = function() {\n		$(window).stellar({\n			responsive: false,\n			parallaxBackgrounds: true,\n			parallaxElements: true,\n			horizontalScrolling: false,\n			hideDistantElements: false,\n			scrollProperty: 'scroll'\n		});\n	};\n	siteStellar();\n\n	var portfolioMasonry = function() {\n		$('.filters ul li').click(function(){\n			$('.filters ul li').removeClass('active');\n			$(this).addClass('active');\n			\n			var data = $(this).attr('data-filter');\n			$grid.isotope({\n				filter: data\n			})\n		});\n\n\n		if(document.getElementById(\"portfolio-section\")){\n			var $grid = $(\".grid\").isotope({\n				itemSelector: \".all\",\n				percentPosition: true,\n				masonry: {\n					columnWidth: \".all\"\n				}\n			})\n\n			$grid.imagesLoaded().progress( function() {\n				$grid.isotope('layout');\n			});  \n			\n		};\n\n\n	};\n	portfolioMasonry();\n\n\n\n\n\n	\n\n})";