// @todo - I need to handle gmail login problems visually
var LoginHandler = Class.create();
LoginHandler.prototype = {

    initialize: function() {
        this.gmail = new GmailLogin();
    }

};

var GmailLogin = Class.create();
GmailLogin.prototype = {

    initialize: function() {
        this._email = null;
        this._password =  null;
    },
    
    
    
    /*
        @todo Integrate company names along with contact names
        @todo Multiple addresses per contact
        @todo Multiple POI names via Gmail Contact groups
    */
    login: function(email,password,callback) {
        this._email = email;
        this._password = password;
        
        // Disable the login button
        jQuery("#gmailbtn").button("disable");
        
        // Change the text of the half
        jQuery("#contact-list-area").html('Loading Contacts...');
        
        // Go ahead and login and get the contacts
        jQuery.ajax({
            type:       'POST',
            url:        'src/php/gmail.php',
            data:       { e:this._email, p:this._password },
            async:      true,
            
            success:    function(xml) {
                jQuery("#contact-list-area").html('<div id="contact-count"></div><br /><table id="contact-list"></table>');
                
                var i = 0;
                var n = 1;
                // parse xml data
                jQuery(xml).find('entry').each(function() {
                    // This takes all the newline characters out
                    var name = jQuery(this).find('title').text().replace( new RegExp("\\n","g"), " " );
                    var address = jQuery(this).find('gd\\:postalAddress').text().replace( new RegExp("\\n","g"), " " );
                    
                    if ( address != '' ) {
                        var name2;
                        
                        // If name is blank, then call it "Unknown Name (#) and call name2 UnknownName"
                        if ( name == '' ) {
                            name = "Unknown Name (" + n + ")";
                            name2 = "UnknownName";
                            n++;
                        }
                        else {
                            name2 = name.split(' ').join('');
                        }
                        
                        jQuery("#contact-list").append( '<tr><td><input type="checkbox" id="'+name2+i+'" name="'+name2+i+'" title="'+name+'" value="'+address+'" /></td><td><label title="'+address+'" for="'+name2+i+'">'+name+'</label></td></tr>' );
                        i++;
                    }
                });
                
                jQuery("#contact-count").html("<b><u>" + i + " contacts found!</u></b>");
                
                if ( i > 0 ) {
                    jQuery("#contact-list").find('input').attr("checked",true);
                    callback();
                }
            }
        });
    }

};