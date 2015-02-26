var viewer = null;
var garmin = null;
var loginHandler = null;
var geocoder = null;

jQuery(document).ready(function($) {
    $("#tabs").tabs();
    $('#loading').hide();
    $(".login-button").button();
    
    $('#rb-requirements div').text(navigator.platform + " & " + navigator.appName);
    
    viewer = new MainInterface();
    garmin = new GarminConnection();
    loginHandler = new LoginHandler();
    
    garmin.checkPlugin();
    
    viewer.alertBox.click(function() {
        viewer.hideAlert();
    });
    viewer.infoBox.click(function() {
        viewer.hideInfo();
    });
    
    viewer.button.click(function() {
        
        // Show the next page
        viewer.nextPage(function() {
            switch ( viewer.currentPage() ) {
                
                // System Requirements
                case 1:
                    break;
                
                // Select Contacts
                case 2:                    
                    break;
                
                // Verify Contacts
                case 3:
                    viewer.showLoading();
                    // Make the contact list
                    fillContactList(function() {
                        // Start Geocoder
                        geocoder = new Geocoder();
                        geocoder.geocodeContacts(contactList,function(gpx) {
                            geocoder.gpx = gpx;
                            viewer.hideLoading();
                            viewer.enableButton();
                        });
                    });
                    break;
                
                // Export to Garmin
                case 4:
                    garmin.detectGarmin();
                    break;
                
                default:
                    break;
            }
        });
        
    });
    
    
    
    
    
    var email = $( "#email" ),
        password = $( "#password" ),
        allFields = $( [] ).add( email ).add( password ),
        tips = $( ".validateTips" );

    function updateTips( t ) {
        tips
            .text( t )
            .addClass( "ui-state-highlight" );
        setTimeout(function() {
            tips.removeClass( "ui-state-highlight", 1500 );
        }, 500 );
    }

    function checkLength( o, n, min, max ) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass( "ui-state-error" );
            updateTips( "Length of " + n + " must be between " +
                min + " and " + max + "." );
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp( o, regexp, n ) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass( "ui-state-error" );
            updateTips( n );
            return false;
        } else {
            return true;
        }
    }
    
    $("#gmailbtn").button().click(function() {
        
        var bValid = true;
        allFields.removeClass( "ui-state-error" );

        bValid = bValid && checkLength( email, "email", 1, 100 );
        bValid = bValid && checkLength( password, "password", 1, 50 );

        // From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
        bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "ex. example@gmail.com" );

        if ( bValid ) {
            
            viewer.showLoading();
            
            loginHandler.gmail.login(email.val(),password.val(),function() {
                viewer.hideLoading();
                viewer.enableButton();
            });
        }
        
        return false;
    });
    
});