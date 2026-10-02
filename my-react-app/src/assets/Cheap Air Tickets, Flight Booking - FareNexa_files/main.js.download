$(document).ready(function () {
    // back to top //
   // initSession();
    var offset = 250;
    var duration = 1000;
    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.back-to-top').fadeIn(duration);
        } else {
            jQuery('.back-to-top').fadeOut(duration);
        }
    });

    jQuery('.back-to-top').click(function (event) {
        event.preventDefault();
        jQuery('html, body').animate({ scrollTop: 0 }, duration);
        return false;
    })
    // back to top  end//
    $('ul.nav li.dropdown').hover(function () {
        $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(100);
    }, function () {
        $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(100);
    });

    var urlis = window.location.pathname.replace('/', '');
    //debugger;
    if (urlis == 'flights') {
        $("#li-home").removeClass('active');
        $("#li-flights").addClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    } else if (urlis == 'hotels') {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").addClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    } else if (urlis == 'cars') {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").addClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    } else if (urlis == 'vacations') {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").addClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    } else if (urlis == 'business-class-flights') {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").addClass('active');
    } else if (urlis == 'last-minute-travel') {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").addClass('active');
        $("#li-supports").removeClass('active');
    } else if (urlis == 'contact-us') {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").addClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    } else if (urlis == 'about-us') {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").addClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    } else if (urlis == '') {
        $("#li-home").addClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    } else {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    }
    if (urlis.toLowerCase().indexOf("flights/") == 0) {
        $("#li-home").removeClass('active');
        $("#li-flights").addClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    }
    if (urlis.toLowerCase().indexOf("hotels/") == 0) {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").addClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    }
    if (urlis.toLowerCase().indexOf("cars/") == 0) {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").addClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    }
    if (urlis.toLowerCase().indexOf("offers/") == 0) {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").addClass('active');
        $("#li-supports").removeClass('active');
    }
    if (urlis.toLowerCase().indexOf("vacations/") == 0) {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").addClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").removeClass('active');
    }
    if (urlis.toLowerCase().indexOf("business-class-flights/") == 0) {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").removeClass('active');
        $("#li-supports").addClass('active');
    }
    if (urlis.toLowerCase().indexOf("last-minute-travel/") == 0) {
        $("#li-home").removeClass('active');
        $("#li-flights").removeClass('active');
        $("#li-hotels").removeClass('active');
        $("#li-cars").removeClass('active');
        $("#li-vacations").removeClass('active');
        $("#li-contact-us").removeClass('active');
        $("#li-about-us").removeClass('active');
        $("#li-more").addClass('active');
        $("#li-supports").removeClass('active');
    }
});