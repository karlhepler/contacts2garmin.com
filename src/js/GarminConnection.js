var GarminConnection = Class.create();
GarminConnection.prototype = {
    
    // Constructor
    initialize: function() {
        // Initialize private variables
        this._keyCode = "faae894e3f41f16d0625cdda398e6ad9";
        this._keyUrl = "http://www.contacts2garmin.com/";
        this._garminController = null;
        this._device = null;
    },
    
    
    
    
    // This checks for the garmin plugin
    checkPlugin: function() {
        try {
            // Initialize plugin
            this._garminController = new Garmin.DeviceControl();
            this._garminController.unlock( [this._keyUrl,this._keyCode] );
            this._garminController.register(this);
            
            // Display success
            //viewer.showInfo("Plug-In is Installed!");
            jQuery('#rb-plugin div').text("Plug-In is Installed");
            
            // Enable next section button
            viewer.enableButton();
        }
        catch(e) {
            // Step through the errors
            switch(e.name) {
                
                case "OutOfDatePluginException":
                    jQuery('#rb-plugin div').text("Click to download plug-in");    
                break;
            
                case "PluginNotInstalledException":
                    jQuery('#rb-plugin div').text("Click to download plug-in");
                break;
            
                case "BrowserNotSupportedException":
                    jQuery('#rb-plugin div').text("Browser/OS not supported");
                break;
            
                default:
                    jQuery('#rb-plugin div').text("Something is wrong!");
                break;
                
            }
        }
    },
    
    
    
    
    // Detects the Garmin
    detectGarmin: function() {        
        // Find the devices
        this._garminController.findDevices();
    },
    
    
    
    
    // This is what happens when we start finding the device
    onStartFindDevices: function(json) {
        viewer.showLoading();
        jQuery('#page-4').html('<div style="text-align:center;font-size:36px;"><h1 style="margin-bottom:50px;">Looking for Garmin...</h1></div>');
    },
    
    
    
    
    // This is what happens when it is finished looking for the Garmin
    onFinishFindDevices: function(json) {
        // If there is more than one device found...
        if ( json.controller.numDevices > 0 ) {
            // Just get the first device found
            var devices = json.controller.getDevices();
            this.device = devices[0];
            
            // Display the device's name
            viewer.hideLoading();
            jQuery('#page-4').html('<div style="text-align:center;font-size:36px;"><h1 style="margin-bottom:50px;">'+this.device.getDisplayName()+'</h1><div id="export-button" class="button">Export Contacts</div></div>');
            jQuery("#export-button").button().click(function(){garmin.writeGpxToGarmin(geocoder.gpx);});
        }
        // If no devices are found...
        else {            
            viewer.hideLoading();
            jQuery('#page-4').html('<div style="text-align:center;font-size:36px;"><h1 style="margin-bottom:50px;">Garmin NOT Found - Plug it in</h1><div id="export-button" class="button">Look Again</div> ~ OR ~ <div id="download-button" class="button">Download GPX</div></div');
            jQuery("#export-button").button().click(function(){garmin.detectGarmin();});
            jQuery("#download-button").button().click(function(e){
                jQuery.generateFile({
                    filename    : 'Contacts2Garmin.gpx',
                    content     : geocoder.gpx,
                    script      : 'src/php/download.php'
                });
            });
        }
    },
    
    
    
    
    // Start writing some data to the device
    writeGpxToGarmin: function(gpx) {
        viewer.showLoading();
        this._garminController.writeToDevice(gpx, "contacts2garmin.gpx");
    },
    
    //The device already has a file with this name on it.  Do we want to override?  1 is yes, 2 is no 
    onWaitingWriteToDevice: function(json) {
        if(confirm(json.message.getText())) {
            alert("overwriting file");
            json.controller.respondToMessageBox(true);
        } else {
            alert("no overwrite");
            json.controller.respondToMessageBox(false);
        }
    },

    onFinishWriteToDevice: function(json) {
        viewer.hideLoading();
        window.location = 'thanks.html';
    },
    
    onException: function(json) {
        // @todo: This triggers when a SD card is installed... the whole thing messes up
        viewer.showAlert(json.msg);
    }

};