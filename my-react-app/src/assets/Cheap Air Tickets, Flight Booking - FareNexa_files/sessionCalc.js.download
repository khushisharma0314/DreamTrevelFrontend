//-----Reference From
//http://www.codeproject.com/Articles/711196/Session-Time-Out-Warning-Message-Using-jQuery-in-A

var dominName = window.location.origin;
var SdominName = window.location.origin;
//How frequently to check for session expiration in milliseconds
var sess_pollInterval = 60000;// 60000;
//How many minutes the session is valid for
var sess_expirationMinutes = 12;//12
//How many minutes before the warning prompt
var sess_warningMinutes =10;//10
var sess_intervalID;
var sess_lastActivity;
var active = false;
function initSession() {
   // alert('called');
    sess_lastActivity = new Date();
    sessSetInterval();
    $(document).bind('keypress.session', function (ed, e) {
        sessKeyPressed(ed, e);
    });
}
function sessSetInterval() {
    sess_intervalID = setInterval('sessInterval()', sess_pollInterval);
}
function sessClearInterval() {
    clearInterval(sess_intervalID);

}
function sessKeyPressed(ed, e) {
    sess_lastActivity = new Date();
}
function sessLogOut() {
    // alert('sessLogOut');
    if ($('.call-popup').is(':visible')) {
        $('.call-popup').hide();
    }
    $('#ExpireSession').show();
    //if (window.location.href.indexOf("flight") > -1) {
    //$('#FlightsesionExpireDiv').show();}
    //else {$('#HotelsesionExpireDiv').show();}
    //window.location.href = 'Logout.aspx';
}
function sessInterval() {
    //debugger;
    var now = new Date();
    //get milliseconds of differneces
    var diff = now - sess_lastActivity;
    //get minutes between differences
    var diffMins = (diff / 1000 / 60);
    if (diffMins >= sess_warningMinutes) {
        //warn before expiring
        //stop the timer
        // sessClearInterval();
        //prompt for attention
        if (active == false) {
            $('.call-popup').hide();
            //jAlert('Your session will expire in ' + (sess_expirationMinutes - sess_warningMinutes) + ' minutes.', 'Session Notification');
            active = true;
        }

        // var active = confirm('Your session will expire in ' + (sess_expirationMinutes - sess_warningMinutes) +' minutes.');
        if (active == true) {
            now = new Date();
            diff = now - sess_lastActivity;
            diffMins = (diff / 1000 / 60);
            if (diffMins > sess_expirationMinutes) {
                sessLogOut();
            }
            //else {
            //    initSession();
            //    sessSetInterval();
            //    sess_lastActivity = new Date();
            //}
        }
        //else {
        //    sessLogOut();
        //}
    }
}


function SearchFlight(url) {
    // showSearchDiv();
    window.location.href = dominName + '/' + url;
    //$.get("" + SdominName + "/handlers/removesession.ashx", function (response) {
    //    if (response == 'Session Removed') {
    //        window.location.href = dominName + '/' + url;
    //    }
    //});
}


function SearchHotel(url) {
    // showSearchDiv();
    //$.get("" + SdominName + "/handlers/hotelremovesession.ashx", function (response) {
    //    if (response == 'Session Removed') {
    //        window.location.href = dominName + '/' + url;
    //    }
    //});
}
//----------------------------------------------Code To Prompt Customer if Confused In Selection the Right Flight For Booking--------------------


//----------------------------------Notify Alert -----------------------if Customer Stuck on Listing Page----
var idleTime = 0;

$(document).ready(function () {
    var idleInterval = setInterval(timerIncrement, 60000); //10000 value in milli second
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
    $(this).scroll(function () {
        idleTime = 0;
    });
    $('.call_close_btn').on('click', function (e) {
        $('.call-popup').fadeOut(350);
        idleTime = 0;
        e.preventDefault();
    });
    //$('.instant-close').on('click', function (e) {
    //    $('.instant-call').fadeOut(350);
    //    idleTime = 0;
    //    e.preventDefault();
    //});
    //$('.mob-app-close').on('click', function (e) {
    //    $('.app-popup').fadeOut(350);
    //    idleTime = 0;
    //    e.preventDefault();
    //});

    //$('.call-popup').on('click', function (e) {
    //    $('.call-popup').fadeOut(350);
    //    idleTime = 0;
    //    e.preventDefault();
    //});

    $('.call_close_btn').add('.call-popup').click(function (event) {
        event.stopPropagation();
    });

    $(".call-popup").on("click", function (event) {
        event.preventDefault();
    });

});

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 1) {
       // debugger
        if ($('.instant-call').is(':visible')) {
            $('.instant-call').hide();
        }
        $('.call-popup').fadeIn('slow');
        idleTime = 0;
    }
}
