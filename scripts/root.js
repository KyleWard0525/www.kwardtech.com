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
        
        $("main").delay(50).fadeIn(mainFadeDelay); 
    });
}

// Launch new challenge. The Game
function launchTheGame()
{
    // Print message to user
    let conf = window.confirm("You are navigating to my web app: 'The Game'.\n\n This is a fun little puzzle site I made for my web development class.\n" +
    "The project called for us to create a web app for a 'client' so my idea was to test a potential employee's crtical thinking skills in a stressful environment\n\nI hope you enjoy :)\n");

    // Check if user is ok with navigating to The Game
    if(conf)
    {
        // Launch The Game
        window.location.href = "../TheGame/index.html";
    }
}