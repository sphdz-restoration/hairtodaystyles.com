// GLOBAL SOUNDS CONTAINER
var soundList = {};


(function () {

    var thisScriptDirname = (function() {
        var scriptTagList = document.getElementsByTagName('script');
        var thisScriptUrl = scriptTagList[scriptTagList.length - 1].src;
        return thisScriptUrl.replace(/\/[^\/]+$/, '');
    }());

    // CONFIGURE SOUND MANAGER AND LOAD SOUNDS
    soundManager.url = thisScriptDirname + '/soundmanager2/';
    soundManager.flashVersion = 9;
    soundManager.useFlashBlock = false;
    soundManager.onready(function() {
        if (soundManager.supported()) {
            soundList.doorsOpening = soundManager.createSound({
                id: 'doorsOpening',
                url: thisScriptDirname + '/../media/zia/door-open.mp3',
                volume: 100
            });
            soundList.doorsOpening.load();
            soundList.accessDenied = soundManager.createSound({
                id: 'accessDenied',
                url: thisScriptDirname + '/../media/zia/access-denied.mp3',
                volume: 100
            });
            soundList.accessDenied.load();
        } else {
            soundList.doorsOpening = {
                play: function () {}
            }
            soundList.accessDenied = {
                play: function () {}
            }
        }
    });


    jQuery(function () {
    
    
            // OPEN DOOR BEHAVIOR DEFINITION
            var openDoors = function () {
    
                var transitionTime = 5000;
    
                soundList.doorsOpening.play();

                jQuery('.zia_door_right').animate({
                    right: '-420px'
                }, transitionTime);
    
                jQuery('.zia_door_left').animate({
                    left: '-420px'
                }, transitionTime);
    
                jQuery('html').animate({
                    backgroundColor: '#000011'
                }, {
                    duration: transitionTime,
                    complete: function () {
                        setTimeout(activateZiaLogin, 25000);
                    }
                });
    
            }

            // ZIA LOGIN PROMPT BEHAVIOR
            var activateZiaLogin = function () {
                jQuery('.zia_login_layout').animate({
                    top: 0
                }, 250);
                
                var countdownInterval = null;
                var countdownElement = jQuery('#zia_login_countdown');
                countdownInterval = setInterval(function () {
                    var yPos = parseInt(countdownElement.css('backgroundPosition')
                        .replace('px', '').split(' ')[1]);
                    yPos = (yPos > -20) ? 0 : yPos + 20;
                    countdownElement.css('backgroundPosition', "0px "+yPos+"px");
                    if (yPos == 0) {
                        clearInterval(countdownInterval);
                    }
                }, 1000)
                setTimeout(function () {
                    window.location.reload();
                }, 10000);
            }
    
    
            // REQUEST APPOINTMENT BEHAVIOR
            jQuery('#hair_today_form').bind('submit', function () {
                jQuery(this).find('input[type=submit]').hide();
                jQuery(this).find('.spinner').show();
                setTimeout(toggleAppointmentForm, 2000);
            });
            jQuery('#hair_today_form_results input').bind('click', function () {
                toggleAppointmentForm();
            });

            var toggleAppointmentForm = function () {
                var form = jQuery('#hair_today_form');
                var formResults = jQuery('#hair_today_form_results');
                if (formResults.is(':visible')) {
                    form.show();
                    formResults.hide();
                } else {
                    formResults.find('.stylist_name').html(
                        form.find('[name="stylist"]:checked').val()
                    );
                    formResults.find('.appointment_date').html(form.find('[name="date"]').val());
                    formResults.find('.appointment_time').html(form.find('[name="time"]').val());
                    form.hide();
                    formResults.show();
                    form.find('input[type=submit]').show();
                    form.find('.spinner').hide();
                }
            }

    
    
            // ZIA LOGIN ACCESS DENIED BEHAVIOR
            var isDenyAccessActive = false;
            jQuery('#zia_login_form').bind('submit', function () {
                if (isDenyAccessActive) {
                    return;
                }
                isDenyAccessActive = true;
                soundList.accessDenied.play();
                this.reset();
                var accessDeniedMessage = jQuery('#zia_access_denied');
                jQuery('#zia_access_denied').show('pulsate', {}, 250, function () {
                    setTimeout(function () {
                        accessDeniedMessage.hide()
                        isDenyAccessActive = false;
                    }, 1000);
                });
            });
    
            // ATTACH SECRET BUTTON BEHAVIOR
            jQuery('#secret_button').click(function () {
                imageCarousel.stop();
                jQuery('.hair_today_layout').slideUp({ 
                    duration: 500, 
                    easing: 'easeInCubic',
                    complete: function () {
                        setTimeout(openDoors, 1000);
                    }
                });
                jQuery('.zia_layout').show();
            });
    

            // ACTIVATE IMAGE CAROUSEL
            jQuery('.hair_today_gallery').imageCarousel();
            var imageCarousel = jQuery.imageCarousel.instanceList[0];


            // ACTIVATE DATE PICKERS
            var initialDate = new Date();
            var millisecondsIn7Day = 7 * 24 * 60 * 60 * 1000;
            initialDate.setTime(initialDate.getTime() + millisecondsIn7Day);
            jQuery('.pickable_date').datepicker().each(function () {
                this.value = (initialDate.getMonth() + 1) + "/" + initialDate.getDate() + "/" + initialDate.getFullYear();
            });

    
    });

})();
