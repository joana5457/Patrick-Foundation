 AOS.init({
 	duration: 800,
 	easing: 'slide'
 });

(function($) {
	"use strict";

	var addKenteFooterFlags = function() {
		var footers = document.querySelectorAll('.ftco-footer');
		if (!footers.length || document.querySelector('.kente-wave-definitions')) {
			return;
		}

		var svgNamespace = 'http://www.w3.org/2000/svg';
		var definitions = document.createElementNS(svgNamespace, 'svg');
		definitions.setAttribute('class', 'kente-wave-definitions');
		definitions.setAttribute('aria-hidden', 'true');
		definitions.setAttribute('focusable', 'false');

		var filter = document.createElementNS(svgNamespace, 'filter');
		filter.setAttribute('id', 'kente-wave-filter');
		filter.setAttribute('x', '-2%');
		filter.setAttribute('y', '-12%');
		filter.setAttribute('width', '104%');
		filter.setAttribute('height', '124%');

		var turbulence = document.createElementNS(svgNamespace, 'feTurbulence');
		turbulence.setAttribute('type', 'fractalNoise');
		turbulence.setAttribute('baseFrequency', '0.006 0.04');
		turbulence.setAttribute('numOctaves', '1');
		turbulence.setAttribute('seed', '4');
		turbulence.setAttribute('result', 'kenteNoise');

		var frequencyMotion = document.createElementNS(svgNamespace, 'animate');
		frequencyMotion.setAttribute('attributeName', 'baseFrequency');
		frequencyMotion.setAttribute('values', '0.006 0.04;0.009 0.052;0.005 0.036;0.006 0.04');
		frequencyMotion.setAttribute('dur', '9.6s');
		frequencyMotion.setAttribute('repeatCount', 'indefinite');
		frequencyMotion.setAttribute('calcMode', 'spline');
		frequencyMotion.setAttribute('keyTimes', '0;0.33;0.66;1');
		frequencyMotion.setAttribute('keySplines', '0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1');
		turbulence.appendChild(frequencyMotion);

		var flowingNoise = document.createElementNS(svgNamespace, 'feOffset');
		flowingNoise.setAttribute('in', 'kenteNoise');
		flowingNoise.setAttribute('dx', '-32');
		flowingNoise.setAttribute('result', 'kenteFlow');

		var flowMotion = document.createElementNS(svgNamespace, 'animate');
		flowMotion.setAttribute('attributeName', 'dx');
		flowMotion.setAttribute('values', '-32;32;-32');
		flowMotion.setAttribute('dur', '8.4s');
		flowMotion.setAttribute('repeatCount', 'indefinite');
		flowMotion.setAttribute('calcMode', 'spline');
		flowMotion.setAttribute('keyTimes', '0;0.5;1');
		flowMotion.setAttribute('keySplines', '0.42 0 0.58 1;0.42 0 0.58 1');
		flowingNoise.appendChild(flowMotion);

		var displacement = document.createElementNS(svgNamespace, 'feDisplacementMap');
		displacement.setAttribute('in', 'SourceGraphic');
		displacement.setAttribute('in2', 'kenteFlow');
		displacement.setAttribute('scale', '18');
		displacement.setAttribute('xChannelSelector', 'R');
		displacement.setAttribute('yChannelSelector', 'G');

		filter.appendChild(turbulence);
		filter.appendChild(displacement);
		definitions.appendChild(filter);
		document.body.appendChild(definitions);

		var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		var observer = null;
		definitions.pauseAnimations();

		var addFlag = function(footer) {
			if (footer.previousElementSibling && footer.previousElementSibling.classList.contains('kente-footer-flag')) {
				return null;
			}

			var flag = document.createElement('div');
			flag.className = 'kente-footer-flag';
			flag.setAttribute('aria-hidden', 'true');

			var cloth = document.createElement('div');
			cloth.className = 'kente-footer-flag__cloth';
			var pole = document.createElement('span');
			pole.className = 'kente-footer-flag__pole';
			var binding = document.createElement('span');
			binding.className = 'kente-footer-flag__binding';

			flag.appendChild(cloth);
			flag.appendChild(binding);
			flag.appendChild(pole);
			footer.parentNode.insertBefore(flag, footer);
			if (observer) {
				observer.observe(flag);
			} else if (!reducedMotion.matches) {
				flag.classList.add('is-visible');
			}
			return flag;
		};

		var updateMotion = function() {
			if (reducedMotion.matches) {
				Array.prototype.forEach.call(document.querySelectorAll('.kente-footer-flag'), function(flag) {
					flag.classList.remove('is-visible');
				});
				definitions.pauseAnimations();
				return;
			}

			if (observer) {
				observer.disconnect();
				Array.prototype.forEach.call(document.querySelectorAll('.kente-footer-flag'), function(flag) {
					flag.classList.remove('is-visible');
					observer.observe(flag);
				});
			} else {
				Array.prototype.forEach.call(document.querySelectorAll('.kente-footer-flag'), function(flag) {
					flag.classList.add('is-visible');
				});
				definitions.unpauseAnimations();
			}
		};

		if ('IntersectionObserver' in window) {
			observer = new IntersectionObserver(function(entries) {
				Array.prototype.forEach.call(entries, function(entry) {
					if (reducedMotion.matches) {
						entry.target.classList.remove('is-visible');
					} else {
						entry.target.classList.toggle('is-visible', entry.isIntersecting);
					}
				});

				if (document.querySelector('.kente-footer-flag.is-visible')) {
					definitions.unpauseAnimations();
				} else {
					definitions.pauseAnimations();
				}
			}, { threshold: 0.05 });
		}

		Array.prototype.forEach.call(footers, addFlag);
		if (!observer && !reducedMotion.matches) {
			definitions.unpauseAnimations();
		}

		if ('MutationObserver' in window) {
			var footerObserver = new MutationObserver(function(records) {
				Array.prototype.forEach.call(records, function(record) {
					Array.prototype.forEach.call(record.addedNodes, function(node) {
						if (node.nodeType !== 1) {
							return;
						}
						if (node.matches('.ftco-footer')) {
							addFlag(node);
						}
						Array.prototype.forEach.call(node.querySelectorAll('.ftco-footer'), addFlag);
					});
				});
			});
			footerObserver.observe(document.body, { childList: true, subtree: true });
		}

		if (reducedMotion.addEventListener) {
			reducedMotion.addEventListener('change', updateMotion);
		} else if (reducedMotion.addListener) {
			reducedMotion.addListener(updateMotion);
		}
	};

	addKenteFooterFlags();

	$(window).stellar({
    responsive: false,
    parallaxBackgrounds: true,
    parallaxElements: true,
    horizontalScrolling: false,
    hideDistantElements: false,
    scrollProperty: 'scroll'
  });


	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	// loader
	var loader = function() {
		setTimeout(function() { 
			if($('#ftco-loader').length > 0) {
				$('#ftco-loader').removeClass('show');
			}
		}, 1);
	};
	loader();

	// Scrollax
   $.Scrollax();

	var carousel = function() {
		$('.carousel-cause').owlCarousel({
			autoplay: true,
			center: true,
			loop: true,
			items:1,
			margin: 30,
			stagePadding:0,
			nav: true,
			navText: ['<span class="ion-ios-arrow-back">', '<span class="ion-ios-arrow-forward">'],
			responsive:{
				0:{
					items: 1,
					stagePadding: 0
				},
				600:{
					items: 2,
					stagePadding: 50
				},
				1000:{
					items: 3,
					stagePadding: 100
				}
			}
		});

	};
	carousel();

	$('nav .dropdown').hover(function(){
		var $this = $(this);
		// 	 timer;
		// clearTimeout(timer);
		$this.addClass('show');
		$this.find('> a').attr('aria-expanded', true);
		// $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').addClass('show');
	}, function(){
		var $this = $(this);
			// timer;
		// timer = setTimeout(function(){
			$this.removeClass('show');
			$this.find('> a').attr('aria-expanded', false);
			// $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
			$this.find('.dropdown-menu').removeClass('show');
		// }, 100);
	});


	$('#dropdown04').on('show.bs.dropdown', function () {
	  console.log('show');
	});

	// scroll
	var scrollWindow = function() {
		$(window).scroll(function(){
			var $w = $(this),
					st = $w.scrollTop(),
					navbar = $('.ftco_navbar'),
					sd = $('.js-scroll-wrap');

			if (st > 150) {
				if ( !navbar.hasClass('scrolled') ) {
					navbar.addClass('scrolled');	
				}
			} 
			if (st < 150) {
				if ( navbar.hasClass('scrolled') ) {
					navbar.removeClass('scrolled sleep');
				}
			} 
			if ( st > 350 ) {
				if ( !navbar.hasClass('awake') ) {
					navbar.addClass('awake');	
				}
				
				if(sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if ( st < 350 ) {
				if ( navbar.hasClass('awake') ) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if(sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
		});
	};
	scrollWindow();

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	
	var counter = function() {
		
		$('#section-counter').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number').each(function(){
					var $this = $(this),
						num = $this.data('number');
						console.log(num);
					$this.animateNumber(
					  {
					    number: num,
					    numberStep: comma_separator_number_step
					  }, 7000
					);
				});
				
			}

		} , { offset: '95%' } );

	}
	counter();

	var contentWayPoint = function() {
		var i = 0;
		$('.ftco-animate').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .ftco-animate.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn ftco-animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft ftco-animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight ftco-animated');
							} else {
								el.addClass('fadeInUp ftco-animated');
							}
							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '95%' } );
	};
	contentWayPoint();


	// navigation
	var OnePageNav = function() {
		$(".smoothscroll[href^='#'], #ftco-nav ul li a[href^='#']").on('click', function(e) {
		 	e.preventDefault();

		 	var hash = this.hash,
		 			navToggler = $('.navbar-toggler');
		 	$('html, body').animate({
		    scrollTop: $(hash).offset().top
		  }, 700, 'easeInOutExpo', function(){
		    window.location.hash = hash;
		  });


		  if ( navToggler.is(':visible') ) {
		  	navToggler.click();
		  }
		});
		$('body').on('activate.bs.scrollspy', function () {
		  console.log('nice');
		})
	};
	OnePageNav();


	// magnific popup
	$('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
     gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    }
  });

  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false
  });


  $('#appointment_date').datepicker({
	  'format': 'm/d/yyyy',
	  'autoclose': true
	});

	$('#appointment_time').timepicker();




})(jQuery);
