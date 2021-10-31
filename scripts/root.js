/**
 * This file contains functions for supporting the root homepage
 */
// Perform all necessary functions at load-time
function onLoad()
{
    let mainFadeDelay = 3030;

    

    $(window).ready(function() {
        // Fade in content
        $("main").hide();
        
        $("main").fadeIn(mainFadeDelay); 
    });
}