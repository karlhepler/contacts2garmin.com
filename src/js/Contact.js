var contactList = Array();
function fillContactList(callback) {
    // Get the selected contacts
    var numContacts = jQuery("#contact-list").find(":checked").length;
    var contacts = null;
    var i = 0;
    jQuery("#contact-list").find(":checked").each(function() {
        var name = jQuery(this).attr("title");
        var address = jQuery(this).val();
        
        // CHANGE THIS LIMIT
        if ( i < 2500 ) {
            contactList[i] = new Contact( name, address );
        }
        
        i++;
    });
    
    // Call the callback function
    callback();
}

var Location = Class.create();
Location.prototype = {

    initialize: function(geoArray) {
        var address_components = geoArray[0].address_components;
    
        this.address    = geoArray[0].formatted_address;
        
        this.street     = "Unknown";
        this.city       = "Unknown";
        this.state      = "Unknown";
        this.zip        = "Unknown";
        this.lat        = geoArray[0].geometry.location.lat(this.lat);
        this.lng        = geoArray[0].geometry.location.lng(this.lng);
        
        for ( var i = 0; i < geoArray[0].address_components.length; i++ ) {
            switch ( geoArray[0].address_components[i].types[0] ) {
                case "postal_code":
                    this.zip = geoArray[0].address_components[i].long_name;
                    break;
                case "street_number":
                    this.street = geoArray[0].address_components[i].long_name;
                    for ( var n = 0; n < geoArray[0].address_components.length; n++ ) {
                        if ( geoArray[0].address_components[n].types[0] == "route" ) {
                            this.street += ' ' + geoArray[0].address_components[n].long_name;
                            break;
                        }
                    }                
                    break;
                case "administrative_area_level_1":
                    this.state = geoArray[0].address_components[i].short_name;
                    break;
                case "locality":
                    this.city = geoArray[0].address_components[i].long_name;
            }
        }
    }

};


var Contact = Class.create();
Contact.prototype = {

    initialize: function(name,address) {
        this.name = name;
        this.address = address;
        this.loc = null;
    },
    
    setLoc: function(geoArray) {
        this.loc = new Location(geoArray);
    }

};