/**
 * Functions for supporting the main site
 * 
 * kward
 */


// Global variables
const images = {};

// Preload resources
function preload()
{
    // Preload images
    images['kw-logo'] = new Image("images/katari-wolf(original).png");
    images['transhuman'] = new Image("images/research/posthuman.jpg");
}

// Load a page
function loadPage(name)
{
    // In case I accidentally add type
    if(name.includes(".html"))
    {
        name = name.replace(".html", "");
    }
    // Research page
    if(name == "research")
    {
        // Set section background images
        $("#img-transhuman").attr({
             
            src: "images/research/posthuman.jpg",
            
             
        });
    }
}