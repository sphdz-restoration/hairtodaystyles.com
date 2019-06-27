(function () {


    jQuery.fn.imageCarousel = function (config) {
    
        return this.each(function (index) {
            jQuery.imageCarousel.instanceList.push(
                new ImageCarousel(this)
            );
        });

    }

    jQuery.imageCarousel = {};

    jQuery.imageCarousel.instanceList = [];


    var ImageCarousel = function (containerElement) {
        this.containerElement = jQuery(containerElement);
        this.carouselElement = this.containerElement.find('.carousel');
        this.contentCopyA = null;
        this.contentCopyB = null;
        this.contentWidth = null;
        this.init();
        this.start();
        var thisImageCarousel = this;
    };


    ImageCarousel.prototype.init = function () {
        this.carouselElement.wrapInner('<div class="carousel_content"></div>');
        this.contentCopyA = this.carouselElement.children();
        this.contentCopyA.height(this.carouselElement.height());
        this.contentCopyA.css('float', 'left');
        this.contentCopyB = this.contentCopyA.clone(true);
        this.contentWidth = this.contentCopyA.width();
        this.carouselElement.append(this.contentCopyB);
        this.carouselElement.width(this.contentWidth * 2);
    }

    
    ImageCarousel.prototype._slide = function () {
        var thisImageCarousel = this;
        this.carouselElement.animate({
            left: (0 - this.contentWidth) + 'px'
        }, 22000, 'linear', function () {
            thisImageCarousel.carouselElement.css('left', '0px');
            thisImageCarousel._slide();
        })
    }


    ImageCarousel.prototype.start = function () {
        this._slide();
    }


    ImageCarousel.prototype.stop = function () {
        this.carouselElement.stop();
    }


})();