var Geocoder = Class.create();
Geocoder.prototype = {

    initialize: function() {
        this.map = this._initMap();
        this.geocoder = new google.maps.Geocoder();
        // @todo - need to make datetime dynamic
        // @todo - figure out what creator MUST be
        this.gpx = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v2" creator="n�vi 1350" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v2 http://www.garmin.com/xmlschemas/TrackPointExtensionv2.xsd"><metadata><link href="http://www.contacts2garmin.com"><text>Contacts2Garmin</text></link><time>2006-12-23T02:02:36Z</time></metadata>';
    },
    
    _initMap: function() {
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var myOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        return new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    },
    
    geocodeContacts: function(contacts, callback) {
        var geo = this.geocoder;
        var map = this.map;
        var marker = Array();
        var gpx = this.gpx;
        var i = 0;
        var x = 0;
        var numContacts = contacts.length;
        var totalContacts = numContacts;
        var progressInterval = 100 / numContacts;
        var badContacts = new Array();
        //var progress = 0;
        
        viewer.showProgressBar(progressInterval);
        
        // Call the function
        geo.geocode( {'address': contacts[i].address}, getNextLoc);
        
        // Do stuff
        function getNextLoc(geoArray,status) {            
            if ( status == google.maps.GeocoderStatus.OK ) {
                contacts[i].setLoc(geoArray);
                
                // Update progress bar
                viewer.stepProgressBar( contacts[i].name );
                
                // Display on map
                map.setCenter(geoArray[0].geometry.location);
                marker[i] = new google.maps.Marker({
                    map:        map,
                    position:   geoArray[0].geometry.location
                });
                
                i++;
                
                if ( i < numContacts ) {
                    // Use setTimeout so that I don't blow up Google's server
                    setTimeout(function(){ geo.geocode( {'address': contacts[i].address}, getNextLoc); },1000);
                }
                else {
    
                    for ( var n = 0; n < numContacts; n++ ) {                        
                        gpx += '<wpt lat="'+contacts[n].loc.lat+'" lon="'+contacts[n].loc.lng+'"><ele>-0.11</ele><name>'+contacts[n].name+'</name><desc>'+contacts[n].loc.address+'</desc><sym>Waypoint</sym><extensions><gpxx:WaypointExtension><gpxx:Categories><gpxx:Category>Address</gpxx:Category></gpxx:Categories><gpxx:Address><gpxx:StreetAddress>'+contacts[n].loc.street+'</gpxx:StreetAddress><gpxx:City>'+contacts[n].loc.city+'</gpxx:City><gpxx:State>'+contacts[n].loc.state+'</gpxx:State><gpxx:PostalCode>'+contacts[n].loc.zip+'</gpxx:PostalCode></gpxx:Address></gpxx:WaypointExtension></extensions></wpt>';
                    }
                    
                    gpx += '</gpx>';
                    
                    viewer.showInfo(numContacts + " out of " + totalContacts + " contacts verified!");
                    
                    if ( numContacts != totalContacts ) {
                        var badContactsString = "";
                        for ( var y = 0; y < badContacts.length; y++ ) {
                            badContactsString += ("\n" + badContacts[y].name);
                        }
                        alert("Unable to verify these contacts:\n" + badContactsString);
                    }
                    
                    callback(gpx);
                }
            }
            else {
                // Remember the bad contact
                badContacts[x++] = contacts[i];
                // Cut the bad contact out
                contacts.splice(i,1);
                // Lessen the total amount of contacts
                numContacts--;
                // Go back and try again now that the bad one is gone
                i--;                
                                
                // Use setTimeout so that I don't blow up Google's server
                setTimeout(function(){ geo.geocode( {'address': contacts[i].address}, getNextLoc); },1000);
            }
        }
    }

};