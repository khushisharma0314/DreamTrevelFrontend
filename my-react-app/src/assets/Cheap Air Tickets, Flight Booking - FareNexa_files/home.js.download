$(document).ready(function () {
    // back to top //
    var offset = 150;
    var duration = 1000;
    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('#back-to-top').fadeIn(duration);
			jQuery('#header').addClass("active");
        } else {
            jQuery('#back-to-top').fadeOut(duration);
			jQuery('#header').removeClass("active");
        }
    });

    jQuery('#back-to-top').click(function (event) {
        event.preventDefault();
        jQuery('html, body').animate({ scrollTop: 0 }, duration);
        return false;
    })

    $('.flip').click(function (e) {
        var txtFlyFrom = $("#Origin").val();
        //var spn_flyfrom = $("#spn_flyfrom").html();

        $("#Origin").val($("#Destination").val())
        //$("#Destination").html($("#txtFlyFrom").html())
        $("#Destination").val(txtFlyFrom)
        // $("#spn_flyto").html(spn_flyfrom);

    });
	 $(".MenuIcon").click(function(){
	     $("#Navbar ul").slideToggle();
		$(".MenuIcon").toggleClass("active");
	 });
	 $(".flag").click(function () {
	     $(".flags").slideToggle();
	     $(".flag").toggleClass("active");
	 });
});