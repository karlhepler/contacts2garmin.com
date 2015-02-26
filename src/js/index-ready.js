jQuery(document).ready(function($) {
    
    $('#start-button').button().click(function() {        
        $("#footer").toggleClass('footer-opened footer-closed','slow');
        $('#header h1').toggleClass('text-inset text-outset','slow');
        $("#footer p").hide();
    });
    
    $('#content-frame').load(function() {
        $('#loading').hide();
    });
    
});