<?php
    
    if ( !empty($_POST['e']) && !empty($_POST['p']) ) {
        login( $_POST['e'], $_POST['p'] );
    }
    else {
        print "No Post Data";
    } 
    
    //-------------------------------------------------------------------------
    
    function login($email,$password) {
        $url = "https://www.google.com/accounts/ClientLogin";
    
        $postData = http_build_query(array(
            "accountType"   => "HOSTED_OR_GOOGLE",
            "Email"         => $email,
            "Passwd"        => $password,
            "service"       => "cp",
            "source"        => "Contacts-2-Garmin"
        ));
        
        $options = array(
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => $postData,
            CURLOPT_RETURNTRANSFER  => true
        );
            
        $ch = curl_init($url);
        curl_setopt_array($ch,$options);
        $content = curl_exec($ch); 
        $header  = curl_getinfo($ch);
        curl_close($ch);
    
        // If authentication succeeds, then the server returns an HTTP 200 OK status code
        if ( $header['http_code'] == 200 ) {
            $output = @split('Auth=',$content);
            $auth = $output[1];
            
            getContacts($email,$auth);
        }
        // If authentication fails, then the server returns an HTTP 403 Forbidden status code
        else {
			print $content;
            /*switch ( $content ) {
                
                // The login request used a username or password that is not recognized.
                case "Error=BadAuthentication":
                break;
            
                // The account email address has not been verified. The user will
                // need to access their Google account directly to resolve the issue
                // before logging in using a non-Google application.
                case "Error=NotVerified":
                break;
                
                // The user has not agreed to terms. The user will need to access
                // their Google account directly to resolve the issue before logging
                // in using a non-Google application.
                case "Error=TermsNotAgreed":
                break;
                
                // A CAPTCHA is required. (A response with this error code will also
                // contain an image URL and a CAPTCHA token.)
                case "Error=CaptchaRequired":
                break;
            
                // The error is unknown or unspecified; the request contained
                // invalid input or was malformed.
                case "Error=Unknown":
                break;
                
                // The user account has been deleted.
                case "Error=AccountDeleted":
                break;
            
                // The user account has been disabled.
                case "Error=AccountDisabled":
                break;
            
                // The user's access to the specified service has been disabled.
                // (The user account may still be valid.)
                case "Error=ServiceDisabled":
                break;
            
                // The service is not available; try again later.
                case "Error=ServiceUnavailable":
                break;
            
                // Unkown response
                default:
                break;
            }*/
        }
    }
    
    //-----------------------------------------------------------
    
    function getContacts($email,$authKey) {
        $url = "https://www.google.com/m8/feeds/contacts/$email/full?max-results=1000";
    
        $options = array(
            CURLOPT_HTTPGET         => true,
            CURLOPT_RETURNTRANSFER  => true,
            CURLOPT_HTTPHEADER      => array(
                                        "Authorization: GoogleLogin auth=".$authKey,
                                        "GData-Version: 3.0"
                                        )
        );
            
        $ch = curl_init($url);
        curl_setopt_array($ch,$options);
        $content = curl_exec($ch); 
        $header  = curl_getinfo($ch);
        curl_close($ch);
        
        if ( $header['http_code'] == 200 ) {            
            // Print the contacts
            print($content);    
        }
        else {
            print "No Contacts";
        }
    }
?>