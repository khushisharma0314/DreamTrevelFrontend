var intRegex = /^\d/;
var cntAddDiv = 2;
var IsMultiCity = false;
var totalMultiCity = 0;
var tabindexx = 7;
var urlis = window.location.pathname.replace('/', '');

$(document).ready(function () {	$('.NumberofTraveler').on('click', function () {        $(this).toggleClass('Traveller_but');        $('.adult').toggle();        return false;    });		
    $('#Origin').focus();
    var totMonthToShow = 1;

    $('.multicity_new').hide();
 
    $(".rndtrp").click(function () {

        IsMultiCity = false;
        $('.multicity_new').hide();
        $("#arrivalSpan").show();
  $("#arrivalSpandiv").show();
 $("#arrivalSpans").show();
        $(".rndtrpopt").show(500);
        $("#txtArrival").prop('disabled', false);
        $("#txtArrival").prev("input[type='text']").removeAttr("readonly");
  $("#txtArrivals").prop('disabled', false);
        $("#txtArrivals").prev("input[type='text']").removeAttr("readonly");
        $("#lbl_flight1").hide();
        $(".rndtrp").addClass('trpact');
        $(".onwtrp").removeClass('trpact');
        $(".multitrip").removeClass('trpact');

        var dtret = $('#txtDepartual').datepicker('getDate');
        dtret.setDate(dtret.getDate() + 1);
        var dtret_min = $('#txtDepartual').datepicker('getDate');
        dtret_min.setDate(dtret_min.getDate());
        $("#txtArrival").datepicker("option", "minDate", dtret_min);
        $("#txtArrival").datepicker().datepicker("setDate", dtret);

    });
    $(".onwtrp").click(function () {

        IsMultiCity = false;
        $('.multicity_new').hide();
        $("#arrivalSpan").show();
        $("#txtArrival").prop('disabled', true);
        $("#txtArrival").prev("input[type='text']").attr("readonly", true);
        $("#txtArrival").val("");
        $("#lbl_flight1").hide();
        $(".rndtrp").removeClass('trpact');
        $(".multitrip").removeClass('trpact');
        $(".onwtrp").addClass('trpact');
        $("#arrivalSpan").hide();
		 $("#arrivalSpans").hide();
  $("#arrivalSpandiv").hide();
    });
    $(".multitrip").click(function () {
        IsMultiCity = true;

        $('.multicity_new').show();
        $("#arrivalSpan").hide();
  $("#arrivalSpandiv").hide();
        $("#txtReturn").prop('disabled', false);
        $("#txtReturn").prev("input[type='text']").removeAttr("readonly");
        $("#txtArrival").val("");
        $(".onwtrp").removeClass('trpact');
        $(".rndtrp").removeClass('trpact');
        $(".multitrip").addClass('trpact');

        $("#lbl_flight1").show();
        $("#lbl_flight2").show();

        $("#lbl_departdate").hide();
        $("#arrivalSpan").hide();
        $("#mainErrorCover").html('');

        var dtret = $('.txtDepartual').datepicker('getDate');
        dtret.setDate(dtret.getDate() + 1);
        var dtret_min = $('.txtDepartual').datepicker('getDate');
        dtret_min.setDate(dtret_min.getDate());

        $("#txtDepartingDate_1").datepicker("option", "minDate", dtret_min);
        $("#txtDepartingDate_1").datepicker().datepicker("setDate", dtret);

    });
    $(".qtyplus,.qtyplus1,.qtyplus2").click(function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[name=' + fieldName + ']').val());
        var totaltraveler = parseInt($("#adulttravelers").val()) + parseInt($("#minortravelers").val()) + parseInt($("#infanttravelers").val());

        if (totaltraveler < 9) {
            // If is not undefined

            if (!isNaN(currentVal)) {
                // Increment
                $('input[name=' + fieldName + ']').val(currentVal + 1);
                updateTravelerValue();
            }

            else {
                // Otherwise put a 0 there
                $('input[name=' + fieldName + ']').val(0);
            }
        }
        else {
            $('#myModal').modal('show');
        }
    });
    $(".qtyminus,.qtyminus1,.qtyminus2").click(function (e) {

        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[name=' + fieldName + ']').val());
        var totaltraveler = parseInt($("#adulttravelers").val()) + parseInt($("#minortravelers").val()) + parseInt($("#infanttravelers").val());
        if ((fieldName != "quantity2") && (fieldName != "quantity1") && (parseInt($("#adulttravelers").val()) == 0 || parseInt($("#adulttravelers").val()) == 1)) {
        } else {
            if (!isNaN(currentVal) && currentVal > 1) {
                // Decrement one
                $('input[name=' + fieldName + ']').val(currentVal - 1);
                updateTravelerValue();
            }
            else if (!isNaN(currentVal) && currentVal >= 1 && (fieldName == "quantity2" || fieldName == "quantity1")) {
                // Decrement one
                $('input[name=' + fieldName + ']').val(currentVal - 1);
                updateTravelerValue();
            }
            else {
                // Otherwise put a 0 there
                $('input[name=' + fieldName + ']').val(0);
            }
        }

        // If it isn't undefined or its greater than 0

    });

    $(".txtDepartual").datepicker({
        numberOfMonths: totMonthToShow,
        dateFormat: 'mm/dd/yy',
        minDate: 0,
        onClose: function (selectedDate) {
            if (IsMultiCity = true) {
                $("#txtDepartingDate_1").datepicker("option", "minDate", selectedDate);
            }
            else {
                  $(".txtDepartual").datepicker("option", "minDate", selectedDate);
                $(".txtDepartual").focus();

            }
            return false;
        }
    });
    $(".txtArrival").datepicker({
        numberOfMonths: totMonthToShow,
        dateFormat: 'mm/dd/yy',
        minDate: 0,
        maxDate: "+12m",
        onClose: function (selectedDate) {
            //$(".txtArrival").datepicker("option", "minDate", selectedDate);
            $(".NumberofTraveler").focus();
            return false;
        }
    });
    $("#txtDepartingDate_1").datepicker({
        numberOfMonths: totMonthToShow,
        dateFormat: 'mm/dd/yy',
        minDate: 0,
        maxDate: "+12m",
        monthNames: ["Depart (Jan)", "Depart (Feb)", "Depart (Mar)", "Depart (Apr)", "Depart (May)", "Depart (Jun)", "Depart (Jul)", "Depart (Aug)", "Depart (Sep)", "Depart (Oct)", "Depart (Nov)", "Depart (Dec)"],
        onClose: function (selectedDate) {
            //$(".txtArrival").datepicker("option", "minDate", selectedDate);
            $(".NumberofTraveler").focus();
            return false;
        },
        onSelect: function (selectedDate) {
            var icnt_dt = 2;
            for (icnt_dt = 2; icnt_dt < parseInt(cntAddDiv) ; icnt_dt++) {
                var date_before = $('#txtDepartingDate_' + (parseInt(icnt_dt) - 1) + '').datepicker('getDate');
                date_before.setDate(date_before.getDate() + 1);
                $('#txtDepartingDate_' + icnt_dt + '').datepicker("option", "minDate", $('#txtDepartingDate_' + (parseInt(icnt_dt) - 1) + '').val());
                $('#txtDepartingDate_' + icnt_dt + '').datepicker().datepicker("setDate", date_before);
            }
        }
    });
    // $('#txtDepartingDate_1').datepicker("option", "monthNames", ["Depart (Jan)", "Depart (Feb)", "Depart (Mar)", "Depart (Apr)", "Depart (May)", "Depart (Jun)", "Depart (Jul)", "Depart (Aug)", "Depart (Sep)", "Depart (Oct)", "Depart (Nov)", "Depart (Dec)"]);


    if ('@TempData["IsError"]' != null) {
        if ('@TempData["IsError"]' == "True") {
            document.getElementById("mainErrorCover").style.display = "block";
        }
    }
});
$(document).ready(function () {
    //$(".slidingDiv").hide();
    //$(".show_hide").show();
    //$('.plus').click(function () {
    //    $(this).hide();
    //    $('.minus').show();
    //    $('.slidingDiv').show(500);
    //});
    //$('.minus').click(function () {
    //    $(this).hide();
    //    $('.plus').show();
    //    $('.slidingDiv').hide(500);

    //});
    $('#Origin').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = document.getElementById('Origin').value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                url: "/Flight/GetAutoSuggestionForUser",
                data: "{search_:'" + $.trim(searchText) + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //var jsonData = JSON.parse(result);
                    //response(jsonData);
                    response(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        focus: function (event, ui) {

            $("#Origin").val(document.getElementById('Origin').value);
            $("#OriginCode").val(ui.item.AirportCode);
            $("#OriginCityCode").val(ui.item.CityCode);
            $("#OriginCityName").val(ui.item.CityName);
            lastOrigin = ui.item.autosuggest;
            lastOriginCode = ui.item.AirportCode;
            lastOriginCityCode = ui.item.CityCode;
            lastOriginCityName = ui.item.CityName;
            return false;
        },
        blur: function (event, ui) {

            $("#Origin").val(ui.item.autosuggest);
            $("#OriginCode").val(ui.item.AirportCode);
            $("#OriginCityCode").val(ui.item.CityCode);
            $("#OriginCityName").val(ui.item.CityName);
            lastOrigin = ui.item.autosuggest;
            lastOriginCode = ui.item.AirportCode;
            lastOriginCityCode = ui.item.CityCode;
            lastOriginCityName = ui.item.CityName;
            $('#Destination').focus();
            return false;
        },
        select: function (event, ui) {
            $("#Origin").val(ui.item.autosuggest);
            $("#OriginCode").val(ui.item.AirportCode);
            $("#OriginCityCode").val(ui.item.CityCode);
            $("#OriginCityName").val(ui.item.CityName);
            lastOrigin = ui.item.autosuggest;
            lastOriginCode = ui.item.AirportCode;
            lastOriginCityCode = ui.item.CityCode;
            lastOriginCityName = ui.item.CityName;
            $('#Destination').focus();
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.autosuggest)
                .appendTo(ul);
        };
		
		 $('#Origins').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = document.getElementById('Origins').value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                url: "/Flight/GetAutoSuggestionForUser",
                data: "{search_:'" + $.trim(searchText) + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //var jsonData = JSON.parse(result);
                    //response(jsonData);
                    response(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        focus: function (event, ui) {

            $("#Origins").val(document.getElementById('Origins').value);
            $("#OriginCode").val(ui.item.AirportCode);
            $("#OriginCityCode").val(ui.item.CityCode);
            $("#OriginCityName").val(ui.item.CityName);
            lastOrigin = ui.item.autosuggest;
            lastOriginCode = ui.item.AirportCode;
            lastOriginCityCode = ui.item.CityCode;
            lastOriginCityName = ui.item.CityName;
            return false;
        },
        blur: function (event, ui) {

            $("#Origins").val(ui.item.autosuggest);
            $("#OriginCode").val(ui.item.AirportCode);
            $("#OriginCityCode").val(ui.item.CityCode);
            $("#OriginCityName").val(ui.item.CityName);
            lastOrigin = ui.item.autosuggest;
            lastOriginCode = ui.item.AirportCode;
            lastOriginCityCode = ui.item.CityCode;
            lastOriginCityName = ui.item.CityName;
            $('#Destinations').focus();
            return false;
        },
        select: function (event, ui) {
            $("#Origins").val(ui.item.autosuggest);
            $("#OriginCode").val(ui.item.AirportCode);
            $("#OriginCityCode").val(ui.item.CityCode);
            $("#OriginCityName").val(ui.item.CityName);
            lastOrigin = ui.item.autosuggest;
            lastOriginCode = ui.item.AirportCode;
            lastOriginCityCode = ui.item.CityCode;
            lastOriginCityName = ui.item.CityName;
            $('#Destinations').focus();
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.autosuggest)
                .appendTo(ul);
        };

    $('#Destination').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = document.getElementById('Destination').value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                async: false,
                url: "/Flight/GetAutoSuggestionForUser",
                data: "{search_:'" + $.trim(searchText) + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //var jsonData = JSON.parse(result);
                    //response(jsonData);
                    response(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        focus: function (event, ui) {
            $("#Destination").val(document.getElementById('Destination').value);
            $("#DestinationCode").val(ui.item.AirportCode);
            $("#DestinationCityCode").val(ui.item.CityCode);
            $("#DestinationCityName").val(ui.item.CityName);
            lastDestination = ui.item.autosuggest;
            lastDestinationCode = ui.item.AirportCode;
            lastDestinationCityCode = ui.item.CityCode;
            lastDestinationCityName = ui.item.CityName;
            // $('.txtDepartual').focus();
            return false;
        },
        blur: function (event, ui) {
            $("#Destination").val(ui.item.autosuggest);
            $("#DestinationCode").val(ui.item.AirportCode);
            $("#DestinationCityCode").val(ui.item.CityCode);
            $("#DestinationCityName").val(ui.item.CityName);
            lastDestination = ui.item.autosuggest;
            lastDestinationCode = ui.item.AirportCode;
            lastDestinationCityCode = ui.item.CityCode;
            lastDestinationCityName = ui.item.CityName;
            //$('.txtDepartual').focus();
            return false;
        },
        select: function (event, ui) {
            $("#Destination").val(ui.item.autosuggest);
            $("#DestinationCode").val(ui.item.AirportCode);
            $("#DestinationCityCode").val(ui.item.CityCode);
            $("#DestinationCityName").val(ui.item.CityName);

            lastDestination = ui.item.autosuggest;
            lastDestinationCode = ui.item.AirportCode;
            lastDestinationCityCode = ui.item.CityCode;
            lastDestinationCityName = ui.item.CityName;
            $('.txtDepartual').focus();
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.autosuggest)
                .appendTo(ul);
        };
		
		 $('#Destinations').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = document.getElementById('Destinations').value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                async: false,
                url: "/Flight/GetAutoSuggestionForUser",
                data: "{search_:'" + $.trim(searchText) + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //var jsonData = JSON.parse(result);
                    //response(jsonData);
                    response(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        focus: function (event, ui) {
            $("#Destinations").val(document.getElementById('Destinations').value);
            $("#DestinationCode").val(ui.item.AirportCode);
            $("#DestinationCityCode").val(ui.item.CityCode);
            $("#DestinationCityName").val(ui.item.CityName);
            lastDestination = ui.item.autosuggest;
            lastDestinationCode = ui.item.AirportCode;
            lastDestinationCityCode = ui.item.CityCode;
            lastDestinationCityName = ui.item.CityName;
            // $('.txtDepartual').focus();
            return false;
        },
        blur: function (event, ui) {
            $("#Destinations").val(ui.item.autosuggest);
            $("#DestinationCode").val(ui.item.AirportCode);
            $("#DestinationCityCode").val(ui.item.CityCode);
            $("#DestinationCityName").val(ui.item.CityName);
            lastDestination = ui.item.autosuggest;
            lastDestinationCode = ui.item.AirportCode;
            lastDestinationCityCode = ui.item.CityCode;
            lastDestinationCityName = ui.item.CityName;
            //$('.txtDepartual').focus();
            return false;
        },
        select: function (event, ui) {
            $("#Destinations").val(ui.item.autosuggest);
            $("#DestinationCode").val(ui.item.AirportCode);
            $("#DestinationCityCode").val(ui.item.CityCode);
            $("#DestinationCityName").val(ui.item.CityName);

            lastDestination = ui.item.autosuggest;
            lastDestinationCode = ui.item.AirportCode;
            lastDestinationCityCode = ui.item.CityCode;
            lastDestinationCityName = ui.item.CityName;
            $('.txtDepartual').focus();
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.autosuggest)
                .appendTo(ul);
        };
    $('#Origin_1').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = document.getElementById('Origin_1').value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                url: "/Flight/GetAutoSuggestionForUser",
                data: "{search_:'" + $.trim(searchText) + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //var jsonData = JSON.parse(result);
                    //response(jsonData);
                    response(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        focus: function (event, ui) {

            $("#Origin_1").val(document.getElementById('Origin_1').value);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            return false;
        },
        blur: function (event, ui) {

            $("#Origin_1").val(ui.item.autosuggest);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            $('#Destination_1').focus();
            return false;
        },
        select: function (event, ui) {
            $("#Origin_1").val(ui.item.autosuggest);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            $('#Destination_1').focus();
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.autosuggest)
                .appendTo(ul);
        };
    $('#Destination_1').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = document.getElementById('Destination_1').value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                url: "/Flight/GetAutoSuggestionForUser",
                data: "{search_:'" + $.trim(searchText) + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //var jsonData = JSON.parse(result);
                    //response(jsonData);
                    response(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        focus: function (event, ui) {

            $("#Destination_1").val(document.getElementById('Destination_1').value);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            return false;
        },
        blur: function (event, ui) {

            $("#Destination_1").val(ui.item.autosuggest);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            $('#Destination_1').focus();
            return false;
        },
        select: function (event, ui) {
            $("#Destination_1").val(ui.item.autosuggest);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            $('#txtDepartingDate_1').focus();
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.autosuggest)
                .appendTo(ul);
        };
		 $('#Origins_1').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = document.getElementById('Origins_1').value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                url: "/Flight/GetAutoSuggestionForUser",
                data: "{search_:'" + $.trim(searchText) + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //var jsonData = JSON.parse(result);
                    //response(jsonData);
                    response(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        focus: function (event, ui) {

            $("#Origins_1").val(document.getElementById('Origins_1').value);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            return false;
        },
        blur: function (event, ui) {

            $("#Origins_1").val(ui.item.autosuggest);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            $('#Destinations_1').focus();
            return false;
        },
        select: function (event, ui) {
            $("#Origins_1").val(ui.item.autosuggest);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            $('#Destinations_1').focus();
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.autosuggest)
                .appendTo(ul);
        };
    $('#Destinations_1').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = document.getElementById('Destinations_1').value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                url: "/Flight/GetAutoSuggestionForUser",
                data: "{search_:'" + $.trim(searchText) + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //var jsonData = JSON.parse(result);
                    //response(jsonData);
                    response(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        focus: function (event, ui) {

            $("#Destinations_1").val(document.getElementById('Destinations_1').value);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            return false;
        },
        blur: function (event, ui) {

            $("#Destinations_1").val(ui.item.autosuggest);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            $('#Destinations_1').focus();
            return false;
        },
        select: function (event, ui) {
            $("#Destinations_1").val(ui.item.autosuggest);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            $('#txtDepartingDates_1').focus();
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.autosuggest)
                .appendTo(ul);
        };
		
    $('#BindPreferedairlines').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = document.getElementById('BindPreferedairlines').value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                async: false,
                url: "/Flight/GetFlightPrafranceForUser",
                data: "{search_:'" + searchText + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {

                    var jsonData = JSON.parse(result);
                    response(jsonData);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        //focus: function (event, ui) {
        //    $("#BindPreferedairlines").val(ui.item.AirlineName);
        //    $("#PreferedairlinesCode").val(ui.item.AirlineCode);

        //    lastPreferredAirline = ui.item.AirlineName;
        //    lastPreferredAirlineCode = ui.item.AirlineCode;
        //    return false;
        //},
        blur: function (event, ui) {
            $("#BindPreferedairlines").val(ui.item.AirlineName);
            $("#PreferedairlinesCode").val(ui.item.AirlineCode);
            lastPreferredAirline = ui.item.AirlineName;
            lastPreferredAirlineCode = ui.item.AirlineCode;
            return false;
        },
        select: function (event, ui) {
            $("#BindPreferedairlines").val(ui.item.AirlineName);
            $("#PreferedairlinesCode").val(ui.item.AirlineCode);
            lastPreferredAirline = ui.item.AirlineName;
            lastPreferredAirlineCode = ui.item.AirlineCode;
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.AirlineName)
                .appendTo(ul);
        };

    var lastOrigin = '';
    var lastOriginCode = '';
    var lastOriginCityCode = '';
    var lastOriginCityName = '';
    var lastDestination = '';
    var lastDestinationCode = '';
    var lastDestinationCityCode = '';
    var lastDestinationCityName = '';
    var lastPreferredAirline = '';
    var lastPreferredAirlineCode = '';
    $("#Origin").change(function () {
        if (lastOrigin == $("#Origin").val()) {
            $("#OriginCode").val(lastOriginCode);
            $("#OriginCityCode").val(lastOriginCityCode);
            $("#OriginCityName").val(lastOriginCityName);

        } else {
            $("#OriginCode").val("");
            $("#OriginCityCode").val("");
            $("#OriginCityName").val("");
        }
        // $('#Destination').focus();
    });
    $("#Destination").change(function () {
        if (lastDestination == $("#Destination").val()) {
            $("#DestinationCode").val(lastDestinationCode);
            $("#DestinationCityCode").val(lastDestinationCityCode);
            $("#DestinationCityName").val(lastDestinationCityName);
        } else {
            $("#DestinationCode").val("");
            $("#DestinationCityCode").val("");
            $("#DestinationCityName").val("");
        }
    });
    $("#BindPreferedairlines").change(function () {
        if (lastPreferredAirline == $("#BindPreferedairlines").val()) {
            $("#PreferedairlinesCode").val(lastPreferredAirlineCode);
        } else {
            $("#PreferedairlinesCode").val("");
        }
    });
    $(document).on('touchstart click', function (e) {
        if (!$(e.target).is('.NumberofTraveler *') && !$(e.target).is('.adult *'))
            $('.adult').hide();
    });

    $('.NumberofTraveler').on('click', function () {
        $(this).toggleClass('Traveller_but');
        $('.adult').toggle();
        return false;
    });

});
$(document).ready(function () {
    $('#btnSearchsubmit').click(function () {
        //  debugger;
        var isValid = true;
        if (!IsMultiCity) {
            if ($("#Origin").val() == "" || $("#Origin").val() == "Airport List Not Found") {
                jAlert('Flying From City Could\'t Left Blank', 'Validation Message');
                $("#Origin").val('');
                return false;
            }
            if ($("#Destination").val() == "" || $("#Destination").val() == "Airport List Not Found") {
                jAlert('Flying To City Could\'t Left Blank', 'Validation Message');
                $("#Destination").val('');
                return false;
            }

            if ($("#Origin").val().length < 3) {
                jAlert('Invalid Flying From City Code.', 'Validation Message');
                // $('#Origin').focus();
                return false;
            }
            if ($("#Destination").val().length < 3) {
                jAlert('Invalid Flying To City Code.', 'Validation Message');
                // $('#Destination').focus();
                return false;
            }

            if (($('#Destination').val() != '')) {
                var origincode = ($('#Origin').val()).split("-");
                var Destinationcode = ($('#Destination').val()).split("-");
                var origin = origincode[0];
                var destination = Destinationcode[0];
                if (origin.trim() == destination.trim()) {
                    jAlert('Source and destination could\'t be same.', 'Validation Message');
                    $('#Destination').focus();
                    return false;
                }
            }
            //else {

            //    $("#destinat").css("display", "None");
            //}

            if (intRegex.test($('#Origin').val())) {
                jAlert('Do not fill numeric value in Flying From City.', 'Validation Message');
                // $('#Origin').focus();
                return false;
            }
            if (intRegex.test($('#Destination').val())) {
                jAlert('Do not fill numeric value in Flying To City.', 'Validation Message');
                //$('#Destination').focus();
                return false;
            }
            var adtcount = parseInt($("#adulttravelers").val());
            var chdcount = parseInt($("#minortravelers").val());
            var infcount = parseInt($("#infanttravelers").val());
            var totaltraveler = parseInt($("#adulttravelers").val()) + parseInt($("#minortravelers").val()) + parseInt($("#infanttravelers").val());
            if (totaltraveler > 9) {
                // $("#nmbrTrv").html("Maximum 9 passengers are allowed");
                jAlert('Maximum 9 passengers are allowed', 'Validation Message');
                isValid = false;
                return false;
            }
            else if (adtcount < infcount) {
                $("#nmbrTrv").html("No of Infant should be less then or equal to Adults");
                jAlert('Number of Infant should be less then or equal to Adults', 'Validation Message');
                isValid = false;
                return false;
            }
            debugger;
            if ($("#Origin").val() != "" && $("#Destination").val() != "") {
                var data = { OriginText: $("#Origin").val(), destinText: $("#Destination").val() };
                $.ajax({
                    url: '/Flight/ValidateOriginAndDestination', type: 'POST', data: JSON.stringify(data), contentType: 'application/json', async: false,
                    success: function (result) {
                        if (result.Success == false) {
                            debugger;
                            jAlert(result.msg, 'Validation Message');
                            isValid = false;
                            return false;
                            //$("#spnOriginDestination").css("display", "block");
                            //$("#spnOriginDestination").html(result.msg);
                            //isValid = false;
                        }
                    }
                });
            }

            if (isValid)
                return true;
            else
                return false;
        }
        if (IsMultiCity) {
            if (intRegex.test($('#Origin_1').val())) {
                jAlert('Do not fill numeric value in Flying From 2.', 'Validation Message');
                $('#Origin_1').focus();
                return false;
            }
            if (intRegex.test($('#Destination_1').val())) {
                jAlert('Do not fill numeric value in Flying To 2.', 'Validation Message');
                $('#Destination_1').focus();
                return false;
            }

            if ($('#Origin').val() == "" || $('#Origin').val() == "Airport List Not Found") {
                jAlert('The Flying From 1 field is required.', 'Validation Message');

                return false;
            }
            if ($('#Destination').val() == "" || $('#Destination').val() == "Airport List Not Found") {
                jAlert('The Flying To 1 field is required.', 'Validation Message');
                return false;
            }
            if ($('#txtDepartual').val() == "") {
                jAlert('The Departing Date 1 field is required.', 'Validation Message');
                return false;
            }
            if ($('#Origin_1').val() == "" || $('#Origin_1').val() == "Airport List Not Found") {
                jAlert('The Flying From 2 field is required.', 'Validation Message');
                return false;
            }
            if ($('#Destination_1').val() == "" || $('#Destination_1').val() == "Airport List Not Found") {
                jAlert('The Flying To 2 field is required.', 'Validation Message');
                return false;
            }
            if ($('#txtDepartingDate_1').val() == "") {
                jAlert('The Departing Date 2 field is required.', 'Validation Message');
                return false;
            }

            if ($('#Origin').val() != "" && $('#Destination').val() != "") {
                var data = { OriginText: $("#Origin").val(), destinText: $("#Destination").val() };
                $.ajax({
                    url: '/Flight/ValidateOriginAndDestination', type: 'POST', data: JSON.stringify(data), contentType: 'application/json', async: false,
                    success: function (result) {

                        if (result.Success == false) {
                            jAlert(result.msg + " For Flight 1", 'Validation Message');
                            isValid = false;
                        }
                    },
                    error: function () {

                    }
                });
            }
            if ($('#Origin_1').val() != "" && $('#Destination_1').val() != "") {
                var data = { OriginText: $("#Origin_1").val(), destinText: $("#Origin_1").val() };
                $.ajax({
                    url: '/Flight/ValidateOriginAndDestination', type: 'POST', data: JSON.stringify(data), contentType: 'application/json', async: false,
                    success: function (result) {

                        if (result.Success == false) {
                            jAlert(result.msg + " For Flight 1", 'Validation Message');
                            isValid = false;
                        }
                    },
                    error: function () {

                    }
                });
            }
            var iCount = 0;
            var multiFrom = 2;
            var AddMultiCity_From = $('#Origin').val() + '|~|' + $('#Origin_1').val();
            var AddMultiCity_To = $('#Destination').val() + '|~|' + $('#Destination_1').val();
            var AddMultiCity_DepartDate = $('#txtDepartual').val() + '|~|' + $('#txtDepartingDate_1').val();

            for (iCount = 0; iCount < totalMultiCity; iCount++) {
                if (intRegex.test($('#Origin_' + (parseInt(multiFrom) + iCount) + '').val())) {
                    jAlert('Do not fill numeric value in Flying From ' + (parseInt(multiFrom) + iCount + 1) + '.', 'Validation Message');
                    $('#Origin_' + (parseInt(multiFrom) + iCount) + '').focus();
                    return false;
                }
                if (intRegex.test($('#Destination_' + (parseInt(multiFrom) + iCount) + '').val())) {
                    jAlert('Do not fill numeric value in Flying To ' + (parseInt(multiFrom) + iCount + 1) + '.', 'Validation Message');
                    $('#Destination_' + (parseInt(multiFrom) + iCount) + '').focus();
                    return false;
                }

                if ($('#Origin_' + (parseInt(multiFrom) + iCount) + '').val() == "" && $('#Origin').val() != "" && $('#Origin_1').val() != "") {
                    jAlert('The Flying From field ' + (parseInt(multiFrom) + iCount + 1) + ' is required.', 'Validation Message');
                    return false;
                }
                if ($('#Destination_' + (parseInt(multiFrom) + iCount) + '').val() == "" && $('#Destination').val() != "" && $('#Destination_1').val() != "") {
                    jAlert('The Flying To field ' + (parseInt(multiFrom) + iCount + 1) + ' is required.', 'Validation Message');
                    return false;
                }
                if ($('#txtDepartingDate_' + (parseInt(multiFrom) + iCount) + '').val() == "" && $('#txtDepartingDate').val() != "" && $('#txtDepartingDate_1').val() != "") {
                    jAlert('The Departing Date ' + (parseInt(multiFrom) + iCount + 1) + ' is required.', 'Validation Message');
                    return false;
                }
                if ($('#Origin_' + (parseInt(multiFrom) + iCount) + '').val() != "" && $('#Destination_' + (parseInt(multiFrom) + iCount) + '').val() != "") {
                    $.ajax({
                        url: '/Flight/ValidateOriginAndDestination', type: 'POST', data: JSON.stringify(data), contentType: 'application/json', async: false,
                        success: function (result) {

                            if (result.Success == false) {
                                jAlert(result.msg + " For Flight " + multiFrom, 'Validation Message');
                                isValid = false;
                            }
                        },
                        error: function () {

                        }
                    });
                }
                AddMultiCity_From = AddMultiCity_From + '|~|' + $('#Origin_' + (parseInt(multiFrom) + iCount) + '').val();
                AddMultiCity_To = AddMultiCity_To + '|~|' + $('#Destination_' + (parseInt(multiFrom) + iCount) + '').val();
                AddMultiCity_DepartDate = AddMultiCity_DepartDate + '|~|' + $('#txtDepartingDate_' + (parseInt(multiFrom) + iCount) + '').val();
            }

            $("#hdn_MultiCityFrom").val(AddMultiCity_From);
            $("#hdn_MultiCityTo").val(AddMultiCity_To);
            $("#hdn_MultiCityDepartDate").val(AddMultiCity_DepartDate);
        }

        if (isValid)
            return true;
        else
            return false;
    })
});
function updateTravelerValue() {
    var totaltraveler = parseInt($("#adulttravelers").val()) + parseInt($("#minortravelers").val()) + parseInt($("#infanttravelers").val());
    if (totaltraveler > 1) {
        $('#AdultCount').val(parseInt($("#adulttravelers").val()));
        $('#ChildCount').val(parseInt($("#minortravelers").val()));
        $('#InfantCount').val(parseInt($("#infanttravelers").val()));
        $('.NumberofTraveler').val(totaltraveler + ' ' + 'Travelers');
    } else {
        $('#AdultCount').val(parseInt($("#adulttravelers").val()));
        $('#ChildCount').val(parseInt($("#minortravelers").val()));
        $('#InfantCount').val(parseInt($("#infanttravelers").val()));
        $('.NumberofTraveler').val('1 Traveler');
    }

};
function SendNewsLetterEmail() {

    var emailID = $("#txtsubemail").val();
    var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (emailID == "") {
        $('#subcribe-msg').html('Please provide <b>Email Address for subscription.</b>');
        return false;
    }

    if (!regExp.test(emailID)) {
        $('#subcribe-msg').html('Please provide valid <b>Email Address.</b>');
        return false;
    }

    $('#subscribeBtn').text('Registering...');

    jQuery.getJSON("/Flight/NewsLetterSubscription", { emailId: emailID }, function (data) {
        $("#txtsubemail").attr("readonly", "readonly");
        $("#txtsubemail").val('');
        if (data.Success == true) {
            $('#subscribeBtn').text('Subscribe');
            $('#subcribe-msg').html('<b>Congratulations!!!</b> You are subscribed for our secret deals.');
            return false;
        }
    });
}
function AddNewDivforMultiCity(add_cntdv) {
    //debugger;
    if (parseInt(cntAddDiv) < 5) {
        $("#addmulticity").before('<div class="clr"></div><div class="multicity_new" id="multicity_' + cntAddDiv + '"> ' +
            '<h5 id="lbl_flight' + (parseInt(cntAddDiv) + 1) + '"><span class="fa fa-plane"></span> Flight ' + (parseInt(cntAddDiv) + 1) + '</h5>' +
            '<div class="clr"></div>' +
            '<div class="form-group col-sm-6">' +
              '<label>Your Departure</label>' +
            '<input placeholder="Flying From" onclick="this.focus(); this.setSelectionRange(0, 9999);" ' +
            'name="Origin_' + cntAddDiv + '" id="Origin_' + cntAddDiv + '" class="form-control autosuggest" tabindex="' + tabindexx + '" />' +
            '<span class="field-validation-valid text-danger" data-valmsg-replace="true" data-valmsg-for="Origin_' + cntAddDiv + '"></span>' +
            '</div>' +
            '<div class="form-group col-sm-6">' +
              '<label>Your Departure</label>' +
            '<input placeholder="Flying To" onclick="this.focus(); this.setSelectionRange(0, 9999);"' +
            'name="Destination_' + cntAddDiv + '" id="Destination_' + cntAddDiv + '" class="form-control autosuggest" tabindex="' + (tabindexx + 1) + '" />' +
            '<span class="field-validation-valid text-danger" data-valmsg-replace="true" data-valmsg-for="Destination_' + cntAddDiv + '"></span>' +
            '</div>' +
            '<div id="dvDepartDate_' + cntAddDiv + '" class="form-group col-sm-6">' +
            '<input  placeholder="Pick a date" onclick="this.focus(); this.setSelectionRange(0, 9999);" name="TravelDateDepart_' + cntAddDiv + '" id="txtDepartingDate_' + cntAddDiv + '" class="txtDepartual form-control" readonly="readonly" tabindex="' + (tabindexx + 2) + '" />' +
            '<span data-valmsg-replace="true" data-valmsg-for="TravelDateDepart_' + cntAddDiv + '" class="field-validation-valid text-danger"></span>          ' +
            '</div>' +
            '<div class="clr"></div><div class="row add-remove-btn" id="dv_add_remove_' + cntAddDiv + '">' +
            '<div class="col-xs-6"><a href="javascript:void(0)" id="add_' + cntAddDiv + '" onclick="AddNewDivforMultiCity(' + cntAddDiv + ')"><i class="fa fa-plus-square-o" aria-hidden="true"></i>  Add Flight</a></div>' +
            '<div class="col-xs-6"><a href="javascript:void(0)" id="remove_' + cntAddDiv + '" onclick="RemoveDivforMultiCity(' + cntAddDiv + ')"><i class="fa fa-minus-square-o" aria-hidden="true"></i> Remove Flight</a></div>' +
            '</div>' +
            '<div class="clr"></div>' +
            '</div>');

        if ($(window).width() < 767) {
            $("#Origin_" + cntAddDiv).attr("placeholder", "Flying From");
            $("#Destination_" + cntAddDiv).attr("placeholder", "Flying To");
        }

        $('#dv_add_remove_' + (parseInt(cntAddDiv) - 1) + '').hide();
        if (parseInt(cntAddDiv) == 4) {
            $('#add_' + cntAddDiv + '').hide();
        }


        IsMultiCity = true;
        totalMultiCity++;
        BindAutoFill(cntAddDiv);
        cntAddDiv++;
        tabindexx++;
    }
}
function RemoveDivforMultiCity(remove_cntdv) {
    $('#multicity_' + remove_cntdv + '').remove();
    $('#dv_add_remove_' + (parseInt(remove_cntdv) - 1) + '').show();
    cntAddDiv--;
    totalMultiCity--;
};
function BindAutoFill(countFill) {
    //debugger;
    $('#Origin_' + countFill + '').focus(0);
    $('#Origin_' + countFill + '').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = request.term; //this.value;// document.getElementById('#Origin_' + countFill).value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                url: "/Flight/GetAutoSuggestionForUser",
                data: "{search_:'" + $.trim(searchText) + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    response(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        //focus: function (event, ui) {
        //    $('#Origin_' + countFill + '').val(ui.item.autosuggest);
        //    //$("#OriginCode").val(ui.item.AirportCode);
        //    //$("#OriginCityCode").val(ui.item.CityCode);
        //    //$("#OriginCityName").val(ui.item.CityName);
        //    //lastOrigin = ui.item.autosuggest;
        //    //lastOriginCode = ui.item.AirportCode;
        //    //lastOriginCityCode = ui.item.CityCode;
        //    //lastOriginCityName = ui.item.CityName;
        //    return false;
        //},
        blur: function (event, ui) {

            $('#Origin_' + countFill + '').val(ui.item.autosuggest);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            $('#Destination_' + countFill + '').focus();
            return false;
        },
        select: function (event, ui) {
            $('#Origin_' + countFill + '').val(ui.item.autosuggest);
            //$("#OriginCode").val(ui.item.AirportCode);
            //$("#OriginCityCode").val(ui.item.CityCode);
            //$("#OriginCityName").val(ui.item.CityName);
            //lastOrigin = ui.item.autosuggest;
            //lastOriginCode = ui.item.AirportCode;
            //lastOriginCityCode = ui.item.CityCode;
            //lastOriginCityName = ui.item.CityName;
            $('#Destination_' + countFill + '').focus();
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.autosuggest)
                .appendTo(ul);
        };

    $('#Destination_' + countFill + '').autocomplete({
        autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            var searchText = request.term;//document.getElementById('#Destination_' + countFill + '').value;
            $.ajax({
                type: "POST",
                contentType: "application/json;",
                async: false,
                url: "/Flight/GetAutoSuggestionForUser",
                data: "{search_:'" + $.trim(searchText) + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    response(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        },
        //focus: function (event, ui) {
        //    $('#Destination_' + countFill + '').val(ui.item.autosuggest);
        //    //$("#DestinationCode").val(ui.item.AirportCode);
        //    //$("#DestinationCityCode").val(ui.item.CityCode);
        //    //$("#DestinationCityName").val(ui.item.CityName);
        //    //lastDestination = ui.item.autosuggest;
        //    //lastDestinationCode = ui.item.AirportCode;
        //    //lastDestinationCityCode = ui.item.CityCode;
        //    //lastDestinationCityName = ui.item.CityName;
        //    // $('#Destination_' + countFill + '').focus();
        //    return false;
        //},
        blur: function (event, ui) {
            $('#Destination_' + countFill + '').val(ui.item.autosuggest);
            //$("#DestinationCode").val(ui.item.AirportCode);
            //$("#DestinationCityCode").val(ui.item.CityCode);
            //$("#DestinationCityName").val(ui.item.CityName);
            //lastDestination = ui.item.autosuggest;
            //lastDestinationCode = ui.item.AirportCode;
            //lastDestinationCityCode = ui.item.CityCode;
            //lastDestinationCityName = ui.item.CityName;
            // $('#Destination_' + countFill + '').focus();
            return false;
        },
        select: function (event, ui) {
            $('#Destination_' + countFill + '').val(ui.item.autosuggest);
            // $("#DestinationCode").val(ui.item.AirportCode);
            // $("#DestinationCityCode").val(ui.item.CityCode);
            // $("#DestinationCityName").val(ui.item.CityName);
            $('#txtDepartingDate_' + countFill + '').focus();
            // lastDestination = ui.item.autosuggest;
            // lastDestinationCode = ui.item.AirportCode;
            // lastDestinationCityCode = ui.item.CityCode;
            // lastDestinationCityName = ui.item.CityName;
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, response) {
            return $("<li>")
                .append(response.autosuggest)
                .appendTo(ul);
        };

    var totMonthToShow = 1;
    //if ($(window).width() > 767) {
    //    totMonthToShow = 2;
    //}
    //else {
    //    totMonthToShow = 1;
    //}
    $('#txtDepartingDate_' + countFill + '').datepicker({

        numberOfMonths: totMonthToShow,
        dateFormat: 'mm/dd/yy',
        minDate: 0,
        maxDate: "+12m",
        beforeShow: function (input, inst) {

            var date_before = $('#txtDepartingDate_' + (parseInt(countFill) - 1) + '').datepicker('getDate');
            date_before.setDate(date_before.getDate() + 1);
            $('#txtDepartingDate_' + countFill + '').datepicker("option", "minDate", $('#txtDepartingDate_' + (parseInt(countFill) - 1) + '').val());
            $('#txtDepartingDate_' + countFill + '').datepicker().datepicker("setDate", date_before);

            //setTimeout(function () {
            //    $('.ui-datepicker').css('z-index', 99999999999999);
            //}, 0);
            //var cal = inst.dpDiv;
            //var top = $(this).offset().top + $(this).outerHeight();
            //var left = $(this).offset().left;
            //setTimeout(function () {
            //    cal.css({
            //        'top': top,
            //        'left': left
            //    });
            //}, 10);
            $("html, body").animate({ scrollTop: $('#txtDepartingDate_' + countFill + '').offset().top - 10 }, 1000);
        },
        onSelect: function (selectedDate) {

            var date_select = $('#txtDepartingDate_' + parseInt(countFill) + '').datepicker('getDate');
            date_select.setDate(date_select.getDate() + 1);
            $('#txtDepartingDate_' + (parseInt(countFill) + 1) + '').datepicker("option", "minDate", $('#txtDepartingDate_' + parseInt(countFill) + '').datepicker('getDate'));
            $('#txtDepartingDate_' + (parseInt(countFill) + 1) + '').datepicker().datepicker("setDate", date_select);
        }
    });


    $('#txtDepartingDate_' + countFill + '').datepicker('widget').wrap('<div class="datepicker-custom"/>');
    $('#txtDepartingDate_' + countFill + '').datepicker("option", "monthNames", ["Depart (Jan)", "Depart (Feb)", "Depart (Mar)", "Depart (Apr)", "Depart (May)", "Depart (Jun)", "Depart (Jul)", "Depart (Aug)", "Depart (Sep)", "Depart (Oct)", "Depart (Nov)", "Depart (Dec)"]);


    //$('#dvDepartDate_' + countFill + '').click(Throttle(function () {
    //    $('#txtDepartingDate_' + countFill + '').focus();
    //}));

}