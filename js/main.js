$(document).ready(function () {


  if ($('#startSection').length) {

    var elem = document.getElementById('startSection');

    if (elem.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+
        elem.addEventListener("wheel", onWheel);
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        elem.addEventListener("mousewheel", onWheel);
      } else {
        // Firefox < 17
        elem.addEventListener("MozMousePixelScroll", onWheel);
      }
    } else { // IE8-
      elem.attachEvent("onmousewheel", onWheel);
    }


    // Это решение предусматривает поддержку IE8-
    function onWheel (e) {
      e = e || window.event;

      if ($(window).width() >= 768) {

        $('.portfolioShow').trigger('click');

        e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      }
    }
  }


  var initPaginationDrop = function () {
    if (!$(".swiper-pagination-bullet").hasClass('ui-droppable')) {
      $(".swiper-pagination-bullet").droppable({
        over: function (event, ui) {
          if (!$(event.target).hasClass('swiper-pagination-bullet-active')) {
            $(event.target).trigger('click');
          }
        }
      });
    }
  };

  var swiper = new Swiper('.projects.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 'auto',
    centeredSlides: true,
    // grabCursor: true
    slideToClickedSlide: true,
    speed: 1000,
    paginationClickable: true,
    onTransitionStart: function () {
      if (!$('.pagination .bullet').hasClass('ui-draggable-dragging')) {
        $('.pagination .bullet').animate({'left': $('.swiper-pagination-bullet-active').position().left});
      }
    },
    onClick: function () {
      if (!$('.pagination .bullet').hasClass('ui-draggable-dragging')) {
        $('.pagination .bullet').animate({'left': $('.swiper-pagination-bullet-active').position().left});
      }
    },
    onInit: function () {
      $("#draggable").draggable({
        containment: ".pagination",
        axis: 'x',
        stop: function () {
          $('.pagination .bullet').animate({'left': $('.swiper-pagination-bullet-active').position().left});
        }
      });

      initPaginationDrop();
    }
  });


  var blockAnimate = false;

  window.addEventListener('deviceorientation', function (e) {
    var $project = $(".swiper-slide-active .project");
    if ($project.hasClass('active') || blockAnimate) {
      return;
    }
    var rotate = Math.tan(e.gamma * Math.PI / 180);

    if ((e.gamma > 0 && e.beta > 90) || (e.gamma < 0 && e.beta > 90)) {
      rotate = rotate * (-1);
    }
    rotate = Math.sign(rotate) * Math.min(Math.abs(rotate), 3);
    var transform = "rotateY(" + rotate * 10 + "deg) scale(" + ((e.beta / 180) / 4 + 1) + ")";
    $project.css({
      "transform": transform,
      "-webkit-transform": transform,
      "-moz-transform": transform,
    });
  }, false);


  $(document).on("mousemove", function (e) {
    var $project = $(".swiper-slide-active .project");
    if ($project.hasClass('active') || blockAnimate) {
      return;
    }
    var ax = -($(window).innerWidth() / 2 - e.pageX) / 80;
    var ay = ($(window).innerHeight() / 2 - e.pageY) / 40;
    $project.css({
      "transform": "rotateY(" + ax + "deg) rotateX(" + ay + "deg)",
      "-webkit-transform": "rotateY(" + ax + "deg) rotateX(" + ay + "deg)",
      "-moz-transform": "rotateY(" + ax + "deg) rotateX(" + ay + "deg)"
    });
  });


  $(window).resize(function () {
    $('body').css('min-height', $(window).height());

    $('.project').each(function (num, el) {
      $(el).data('offset', $(el).offset().top);

      $(el).find('.info').data('width', Math.ceil($(el).find('.info').width()));
      $(el).find('.info').width($(el).find('.info').data('width'));

      $(el).data('width', Math.ceil($(el).outerWidth()));

      $(el).find('.info').css('max-width', $(el).find('.info').data('width'));
    });

    if (typeof swiper != 'undefined' && typeof swiper.onResize == 'function') {
      swiper.onResize();
    }

    var w = $('.pagination').width() / $('.swiper-slide').length;
    $('body').append('<style> .swiper-pagination .swiper-pagination-bullet, .bullet { width:' + w + 'px; }</style>');
  });
  $(window).resize();


  $(document).on('click', '.portfolioShow', function (e) {
    e.preventDefault();
    $('body').addClass('showPortfolio');

    history.pushState(null, null, $(e.currentTarget).attr('href'));

    initPaginationDrop();

    return false;
  });

  $(document).on('click', '.projects .project a.showTrigger', function (e) {
    e.preventDefault();

    if ($(e.currentTarget).parents('.project').hasClass('active')) {
      return false;
    }

    history.pushState(null, null, $(e.currentTarget).attr('href'));

    var $project = $(e.currentTarget).parents('.project');
    $('.portfolio').addClass('singleMode');
    swiper.detachEvents();
    if ($(window).width() < 768) {
      $('body').addClass('showProject');
      $project.addClass('active');
      $project.find('.hiddenInfo').slideDown(1000);
      $('.backBtn .label').text('返回');
      swiper.onResize();
    } else {

      $project.outerWidth($project.data('width'));
      blockAnimate = true;
      setTimeout(function () {
        $project.css('transform', 'translateY(' + ( 227 - $project.data('offset')) + 'px)');
        $project.addClass('preActive');
        $project.find('.info').addClass('hide');
        $('.requestBtnWrapper').slideUp(1000);
        setTimeout(function () {
          $project.find('.info').css('max-width', '');
          $('body').addClass('showProject');
          $project.css('width', '');
          $project.removeClass('preActive').addClass('active');
          $project.css('transform', 'translateY(0px)');
          $project.find('.info').removeClass('hide');
          $project.find('.hiddenInfo').slideDown(1000);
          $('.backBtn .label').text('返回');
          blockAnimate = false;
          $('.requestBtnWrapper').slideDown(1000);
        }, 1000);
      }, 1);
    }
    return false;
  });

  $(document).on('click', '.backBtn', function (e) {
    e.preventDefault();
    if ($('body').hasClass('showProject')) {
      history.pushState(null, null, $('.portfolioShow').attr('href'));
      var $project = $('.project.active');
      swiper.attachEvents();
      if ($(window).width() < 768) {
        $project.find('.hiddenInfo').slideUp(1000, function () {
          $('body').removeClass('showProject');
          $('.portfolio').removeClass('singleMode');
          $project.removeClass('preUnActive prePreUnActive').removeClass('active');
          $('.backBtn .label').text('首页');
          swiper.onResize();
        });
      } else {
        blockAnimate = true;
        $project.find('.info').addClass('hide');
        $project.outerWidth(600);
        $('.requestBtnWrapper').slideUp(1000);
        $project.addClass('hideAfterLine');
        $project.find('.hiddenInfo').slideUp(1000, function () {
          $project.addClass('prePreUnActive');
          $project.find('.info').css('max-width', 0);
          setTimeout(function () {
            $project.addClass('preUnActive').removeClass('hideAfterLine');
            $project.outerWidth($project.data('width'));
            $project.css('transform', 'translateY(' + ($project.data('offset') - $project.offset().top) + 'px)');
            setTimeout(function () {
              $project.find('.info').css('max-width', $project.find('.info').data('width'));
              $('body').removeClass('showProject');
              $project.css('transform', 'translateY(0px)');
              $project.removeClass('preUnActive prePreUnActive').removeClass('active');
              $project.find('.info').removeClass('hide');
              $('.backBtn .label').text('首页');
              blockAnimate = false;
              $('.requestBtnWrapper').slideDown(1000, function () {
                $project.css('width', '');
              });
              initPaginationDrop();
              $('.portfolio').removeClass('singleMode');
            }, 1000);
          }, 1);
        });
      }
    } else {
      $('body').removeClass('showPortfolio');
      history.pushState(null, null, '/');
    }
    return false;
  });


  $(document).on('click', '.requestBtn', function (e) {
    e.preventDefault();
    $('body').addClass('showForm');
    return false;
  });

  $(document).on('click', '.hideForm', function (e) {
    e.preventDefault();
    $('body').removeClass('showForm');
    return false;
  });


  $(document).on('click', '.modeTrigger:not(.active)', function (e) {
    e.preventDefault();
    var $el = $(e.currentTarget);
    $('.modeTrigger').removeClass('active');
    $el.addClass('active');
    $('.modeName').text($el.data('text'));
    if ($el.data('mode') === 'night') {
      $('body').addClass('nightMode');
      startGrain();
    } else {
      $('body').removeClass('nightMode');
      stopGrain();
    }
  });


// Grain ------------ START

  var Grain = function (el) {

    /**
     * Options
     * Increase the pattern size if visible pattern
     */
    this.patternSize = 150;
    this.patternScaleX = 1;
    this.patternScaleY = 1;
    this.patternRefreshInterval = 3; // 8
    this.patternAlpha = 18; // int between 0 and 255,

    /**
     * Create canvas
     */
    this.canvas = el;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(this.patternScaleX, this.patternScaleY);

    /**
     * Create a canvas that will be used to generate grain and used as a
     * pattern on the main canvas.
     */
    this.patternCanvas = document.createElement('canvas');
    this.patternCanvas.width = this.patternSize;
    this.patternCanvas.height = this.patternSize;
    this.patternCtx = this.patternCanvas.getContext('2d');
    this.patternData = this.patternCtx.createImageData(this.patternSize, this.patternSize);
    this.patternPixelDataLength = this.patternSize * this.patternSize * 4; // rgba = 4


    Grain.prototype.resize = function () {
      this.canvas.width = window.innerWidth * devicePixelRatio;
      this.canvas.height = window.innerHeight * devicePixelRatio;
    };

    Grain.prototype.update = function () {
      const patternPixelDataLength = this.patternPixelDataLength,
        patternData = this.patternData,
        patternAlpha = this.patternAlpha,
        patternCtx = this.patternCtx;

      // put a random shade of gray into every pixel of the pattern
      for (var i = 0; i < patternPixelDataLength; i += 4) {
        // const value = (Math.random() * 255) | 0;
        const value = Math.random() * 255;

        patternData.data[i] = value;
        patternData.data[i + 1] = value;
        patternData.data[i + 2] = value;
        patternData.data[i + 3] = patternAlpha;
      }

      patternCtx.putImageData(patternData, 0, 0);
    }

    Grain.prototype.draw = function () {
      const ctx = this.ctx,
        patternCanvas = this.patternCanvas,
        canvas = this.canvas,
        viewHeight = this.viewHeight;
      const width = canvas.width,
        height = canvas.height;

      // clear canvas
      ctx.clearRect(0, 0, width, height);

      // fill the canvas using the pattern
      ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillRect(0, 0, width, height);
    }

    Grain.prototype.loop = function () {
      // only update grain every n frames
      const shouldDraw = ++this.frame % this.patternRefreshInterval === 0;
      if (shouldDraw) {
        this.update();
        this.draw();
      }

      if (this.loop) {
        window.requestAnimationFrame(this.loop);
      }
    }

    Grain.prototype.destroy = function () {
      window.removeEventListener('resize', this.resize);
      for (var i in this) {
        if (this[i].unbind) {
          this[i].unbind();
        }
        delete this[i];
      }
      document.querySelector('.grain').remove();
    };

    /**
     * Prebind prototype function, so later its easier to user
     */
    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    this.frame = 0;

    window.addEventListener('resize', this.resize);
    this.resize();

    window.requestAnimationFrame(this.loop);

  };

  var grain;

  var startGrain = function () {

    var canvas = document.createElement('canvas');
    $(canvas).addClass('grain');
    $('body').prepend(canvas);

    grain = new Grain(document.querySelector('.grain'));
  };

  var stopGrain = function () {
    grain.destroy();
    delete grain;
  };

// Grain ------------ END


  if (new Date().getHours() > 19 || new Date().getHours() < 8) {
    $('.modeTrigger').removeClass('active');
    $('.modeTrigger[data-mode=night]').addClass('active');
    $('.modeName').text($('.modeTrigger[data-mode=night]').data('text'));
    $('body').addClass('nightMode');
    startGrain();
  }

  $('body').addClass('loaded');
  setTimeout(function () {
    $('.preloader').addClass('hide');
    setTimeout(function () {
      if (typeof initActiveProject != 'undefined') {
        var activeSlide = $('.project[data-id=' + initActiveProject + ']').parents('.swiper-slide');
        swiper.slideTo(activeSlide.index(), 0);
      }
      $('.preloader').fadeOut(500, function () {
        if (typeof initActiveProject != 'undefined') {
          activeSlide.find('a.showTrigger').trigger('click');
        }
        $('.preloader').remove();
        initPaginationDrop();
      });
    }, 700);
  }, 2500);

});