var MainInterface = new Class.create();
MainInterface.prototype = {

    initialize: function() {
        this._pageNum = 1;
        this._numPages = 4;
        this._progressBarInterval = 0;
        
        this.button = jQuery('#button');
        
        // Initialize Pages
        jQuery('.page').hide();
        jQuery('#page-1').show();
        
        // Initialize loading screen
        jQuery('body').append('<div id="loading" style="cursor:default;"><span><img src="src/css/images/ajax-loader.gif" /><br />Please Wait...</span></div>');
        jQuery('#loading').hide();
        this.loadingBox = jQuery('#loading');
        
        // Initialize alert screen
        jQuery('#viewer').append('<div id="alert" class="ui-widget" style="cursor:default;width:100%;margin:118px 0px;z-index:101;position:absolute;"><div style="position:relative;width:400px;margin:auto;"><div class="ui-state-error ui-corner-all" style="padding:20px;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><strong>Alert:</strong> <span class="message"></span></p></div></div></div>');
        jQuery('#alert').hide();
        this.alertBox = jQuery('#alert');
        
        // Initialize info screen        
        jQuery('#viewer').append('<div id="info" class="ui-widget" style="cursor:default;width:100%;margin:118px 0px;z-index:101;position:absolute;"><div style="position:relative;width:400px;margin:auto;"><div class="ui-state-highlight ui-corner-all" style="padding:20px;"><p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span><strong>Information:</strong> <span class="message"></span></p></div></div></div>');
        jQuery('#info').hide();
        this.infoBox = jQuery('#info');
        
        // Initialize progress bar
        jQuery('#viewer').append('<div id="progress-bar"><div><div></div></div></div>');
        jQuery('#progress-bar').progressbar();
        jQuery('#progress-bar').hide();
    },
    
    nextPage: function(callback) {
        if ( this._pageNum < this._numPages && this.buttonIsEnabled() == true ) {
            
            this.hideAlert();
            this.hideInfo();
            
            this.hideProgressBar();
                        
            if ( this._pageNum > 1 ) {
                jQuery('#progress-'+this._pageNum).animate({ color:'#BBBBBB', backgroundColor:'lightblue' },'slow');    
            }
            else {
                jQuery('#progress-'+this._pageNum).animate({ color:'#BBBBBB' },'slow');                
            }
            
            jQuery('#page-'+this._pageNum).hide('slide',{},'slow');
            jQuery('#page-'+(++this._pageNum) ).show('slide',{direction:'right'},'slow',callback);
            
            jQuery('#progress-'+this._pageNum).animate({ color:'yellow', backgroundColor:'yellow' },'slow');           
            
            this.disableButton();
        }
    },
    
    disableButton: function() {
        if ( this.buttonIsEnabled() == true ) {
            jQuery('#button').removeClass('enabled');
            jQuery('#button').hide('drop',{direction:'down'},'fast');
        }
    },
    
    enableButton: function() {
        if ( this.buttonIsEnabled() == false ) {
            jQuery('#button').addClass('enabled');
            jQuery('#button').show('drop',{direction:'up'},'fast');
            jQuery('#progress-'+(this._pageNum+1)).animate({ backgroundColor:'lightgreen', color:'lightgreen' },'slow', function() {
                jQuery(this).effect('pulsate', {times:3}, 500);
                jQuery('#button').effect('pulsate', {times:3}, 500);
            });
        }
    },
    
    buttonIsEnabled: function() {
        return jQuery('#button').hasClass('enabled');
    },
    
    showLoading: function() {
        jQuery('#loading').show("fade",{},"fast");
    },
    
    hideLoading: function() {
        jQuery('#loading').hide("fade",{},"fast");
    },
    
    showAlert: function(message) {
        jQuery('#alert .message').html(message);
        jQuery('#alert').show("fade",{},"fast");
    },
    
    hideAlert: function() {
        jQuery("#alert").hide("fade",{},"fast");
    },
    
    showInfo: function(message) {
        jQuery('#info .message').html(message);
        jQuery('#info').show("fade",{},"fast");
    },
    
    hideInfo: function() {
        jQuery("#info").hide("fade",{},"fast");
    },
    
    currentPage: function() {
        return this._pageNum;
    },
    
    showProgressBar: function(interval) {
        this._progressBarInterval = interval;
        jQuery('#progress-bar').progressbar( 'value', 0 );
        jQuery('#progress-bar').show();
    },
    
    stepProgressBar: function(status) {
        jQuery('#progress-bar').progressbar('value', jQuery('#progress-bar').progressbar('option','value') + this._progressBarInterval );
        jQuery('#progress-bar div div').text(status);
    },
    
    hideProgressBar: function() {
        jQuery('#progress-bar').hide('#progress-bar');
    },
    
    showButton: function() {
        
    },
    
    hideButton: function() {
        
    }

};