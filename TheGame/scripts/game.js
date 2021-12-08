/**
 * The Game
*/

// Imports
import { progressBar, selectFile, randint, secretNumber} from "./utils.js";
import { getUserMetadata } from "./metadata.js";

const audioPath = "components/audio/";
const audioFiles = {};
const images = {};
const MAX_TIME = 124;
var TRIES = 3;
var welcomePhrases = [];
var gameTime = MAX_TIME;
var closeTime = 6;
var pageCloseInterval;
var preloaded = false;
var metadata = '';

const userFile = {
    'name': '',
    'data': '',
    'type': '',
};

//  Preload page resources
preload();

//  Load module functions into the window object
window.loadPage = loadPage;
window.selectFile = selectFile;
window.checkCode = checkCode;
new p5(); 

//  Resources and functions for tracking and handling game states
const gameCtrl = {

    //  Button states. 1 = on, 0 = off, 2 = disabled (temporarily)
    buttons: {
        '1': -1,
        '2': -1,
        '3': -1,
        '4': -1,
        '5': -1,
    },

    // Initialize game
    init(){

        //  Hide footer and main
        $("footer").hide();
        $("main").hide();

        // Fade in initial start message
        $("#user-msg").text("You may begin.");
        $("main").delay(1000).fadeIn(2000);

        //  Fade in footer
        $("footer").delay(4500).fadeIn(9500);

        this.pattern = {
            'button-connections': [],
            'button-states': []
        };

        //  Create randomized pattern
        while(this.pattern['button-connections'].length < Object.keys(this.buttons).length)
        {
            let num = randint(1, Object.keys(this.buttons).length);

            if(!this.pattern['button-connections'].includes(num))
            {
                // Add connection to current button
                this.pattern['button-connections'].splice(0, 0, num);
                let state = 0;

                // Check if button should be enabled(1) or disabled(0)
                if(Math.random() >= 0.5)
                {
                    // Target state = on
                    state = 1;
                }

                // Add state to button states
                this.pattern['button-states'].push(state);
            }
            
        }

        // Create welcome messages
        welcomePhrases.push("You've been selected by GlobalTech to partake in: The Game"); 
        welcomePhrases.push("If you succeed, a promising future awaits")
        welcomePhrases.push('This is a great privilege'); 
        welcomePhrases.push("DO NOT waste it"); 
        welcomePhrases.push("When you're ready, push the 'Continue' button")
        welcomePhrases.push("Good luck.");
    },
        

    //  Toggle button state
    toggleButton(btnID)
    {
        // Check if button is in initial state
        if(this.buttons[btnID] == -1)
        {
            // Set button to enabled
            this.buttons[btnID] = 1;
        }
        else {
            // Toggle state
            this.buttons[btnID] = !this.buttons[btnID];
        }
        

        // Random chance to toggle connected button
        let toggleChance = Math.random();

        // Get id of connected button
        let connectionID = this.pattern['button-connections'][btnID-1];

        // Check if connected button should be toggled
        if(toggleChance > Math.random())
        {
            // Check if connected button is in initial state
            if(this.buttons[connectionID] == -1)
            {
                // Set button to enabled
                this.buttons[connectionID] = 1;
            }
            else {
                // Toggle connected button
                this.buttons[connectionID] = !this.buttons[connectionID];
            }

            // Secret hint
            $("#main-text").hide();
            let debug_msg = btnID + " ----> " + connectionID;
            $("#main-text").text(debug_msg);
            $("#main-text").fadeIn(30, function() {
                $(this).fadeOut(30);
            });
    }
        // Check button state
        if(this.buttons[btnID] == 1)
        {
            // Set to class to btn-on
            $("#b" + btnID).attr("class", "nav-btn btn-on");
        }
        else {
            // Set to class to btn-off
            $("#b" + btnID).attr("class", "nav-btn btn-off");
        }

        // Check connected button state
        if(this.buttons[connectionID] == 1)
        {
            // Set to class to btn-on
            $("#b" + connectionID).attr("class", "nav-btn btn-on");
        }
        else {
            // Set to class to btn-off
            $("#b" + connectionID).attr("class", "nav-btn btn-off");
        }

        // Check if game is over
        this.checkGameOver();
    },

    //  Start game
    start()
    {
        // Format time
        let m = (gameTime % 3600) / 60;
        let s = gameTime % 60;

        let time = m + ":" + s;

        $("#footer-txt").text(time);
        this.updateInterval = setInterval(this.update, 1000);
    },

    //  Update game state
    update()
    {
        // Subtract 1 from timer
        gameTime--;

        // Check if start message should be updated
        if(gameTime == MAX_TIME - 3)
        {
            // Fade out message
            $("main").fadeOut(800, function()
            {
                // Change text
                $("#user-msg").text("Good luck.");

                // Fade in message
                $("main").fadeIn(1000);

                // Wait and then fade out main
                $("#user-msg").delay(1500).fadeOut(3500, function(){
                    $("#user-msg").text("");
                });
            })
        }

        // Format time
        let m = Math.floor((gameTime %3600) / 60);
        let s = gameTime % 60;
        let time = m + ":" + s;

        $("#footer-txt").text(time);

        if(gameTime <= 0)
        {
            gameCtrl.handleGameOver('loss');
        }
    },

    //  Check if game is over
    checkGameOver()
    {
        let nCorrect = 0; // Number of buttons in correct state
        
        // Loop through buttons
        for(let i = 1; i < Object.keys(this.buttons).length + 1; i++)
        {
            // Get button state
            let btnState = this.buttons[i];
            let pState = this.pattern['button-states'][i-1];

            // Check if button is in the correct state
            if(btnState == pState)
            {
                nCorrect++;
            }
        }

        // Check if all buttons are in the correct state
        if(nCorrect == Object.keys(this.buttons).length)
        {
            // Game over
            gameCtrl.handleGameOver('win');
        }
    },

    // Handle game over event
    handleGameOver(result)
    {
        $("#main-text").hide();

        // Clear game update interval
        clearInterval(this.updateInterval);

        // Pause game music
        audioFiles['game-bg'].pause();

        // Disable all buttons
        for(let i = 1; i <= Object.keys(this.buttons).length; i++)
        {
            // Disable button
            $("#b" + i).prop("disabled", true);

            // Set css
            $("#b" + i).css({
                'opactity': 0.35,
                'cursor': 'default'
            });
        }

        // User won
        if(result === 'win')
        {
            // Set main text
            $("#main-text").text("Congratulations. You've beaten The Game.");
            $("#main-text").fadeIn(1000);

            // Fade out congrats msg for loading msg
            $("#main-text").delay(1000).fadeOut(1500, function() 
            {
                // Set new message
                $("#main-text").text("Please wait while we load the next stage...");

                $("#main-text").delay(350).fadeIn(2000);

                setTimeout(function(){
                    window.location.href = "stage2.html";
                }, 5000);
            });
                
        }
        // User lost
        else if(result === 'loss'){
            $("#main-text").text("Game over. You are no longer a potential candidate for GlobalTech."); 
            
            // Fade out footer
            $("footer").fadeOut(500);

            // Start page close procedure
            $("#main-text").fadeIn(2000, function()
            {
                pageCloseInterval = setInterval(initPageClose, 1000);
            });
            
        }
    }
};

//  Preload page resources
function preload()
{
    // Load audio files
    audioFiles['btnClick'] = new Audio(audioPath + "click.mp3");                    //  Button click
    audioFiles['home-bg'] = new Audio(audioPath + "forest-ambient.mp3");            //  Home page background music
    audioFiles['game-bg'] = new Audio(audioPath + "bg-music.mp3");                  //  Game background music            
    
    // Get metadata
    metadata = getUserMetadata();
    
    // Call backend route to save metadata
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/init_metadata",
        data: JSON.stringify(metadata),

        // Handle successful call
        success: function(res) {
            if(res['result'] == 1)
            {
                // Success
                console.log("Metadata saved!");
            }
        },

        // Handle error
        error: function(error) {
            console.log(error);
        }

    });

    // Set audio volumes
    audioFiles['btnClick'].volume = 0.9;
    audioFiles['home-bg'].volume = 0.85;
    audioFiles['game-bg'].volume = 0.5;
}

//  Functions for p5
function setup(){};
function draw(){};

//  Load page resources
function loadPage(page)
{
    // Ensure document is ready
    $(document).ready(function() {
                
        //  Check which page to load
        //  Main game page
        if(page == "game.html")
        {
            gameCtrl.init();            //  Initialize game controller
            loadHeader();               //  Load page header
            
            // Add audio element to iframe
            $("#bg-audio").append(audioFiles['game-bg']);
            audioFiles['game-bg'].play();

            // DEBUG ONLY //
            $("main").on("dblclick", function(evt) {
                evt.preventDefault();
                audioFiles['game-bg'].pause();
                clearInterval(gameCtrl.updateInterval)
            });

            // Start The Game
            gameCtrl.start();;
        }
        //  Home page
        else if(page == "index.html")
        {
            gameCtrl.init();            //  Initialize game controller

            // Disable and hide continue button until animation(s) are done
            $("#btn-begin").prop("disabled", true);
            $("#btn-begin").hide();

            // Attach event listener to play bg music when page loads
            $("html").on("mouseover", function(evt) {
                evt.preventDefault();

                //  Start background music
                $("#bg-audio").append(audioFiles['home-bg']);   //  Add audio to iframe (for compatability with chrome)
                audioFiles['home-bg'].play();                   //  Play
                audioFiles['home-bg'].loop = true;              //  Loop music
                audioFiles['home-bg'].volume = 0.5;
                
            });

            //  Fade in content
            $("main").hide();
            $("main").fadeIn(5000);

            // Attach event listener to main to play welcome animation
            $("main").on("mouseover", function(evt) {
                evt.preventDefault();
                $(this).delay(300, function() {
                    playWelcomeAnim();
                })
                
            });
        }

        //  About page(s)
        else if(page.includes('-'))
        {
            //  Hide page footer
            $("footer").hide();

            //  Attach event handler to the page
            $("html").on("mouseover", function() {
                // Change button text
                $("#btn-next").text("Next");

                // Fade in next button after delay (for user to read)
                $("footer").delay(3500).fadeIn(2000);
            });
        }

        //  Stage 2
        else if(page == "stage2.html")
        {
           $("#btn-file").on("click", function() {
               selectFile(readSelectedFile);
           });

            // Tooltip for button
            $(".tooltip").lyltip({
                theme: "dark",
                margin: 81
            });

            // Play intro animation
            playStage2Intro(0);
        }

        //  End Game page (user won)
        if(page == "end.html")
        {

        }
    });
}

// Read file selected by user
function readSelectedFile(file)
{
    // Create file reader 
    var reader = new FileReader();
    
    // Setup function to handle file loads
    reader.onload = function(e){
        // Save file data
        userFile['name'] = file.name;
        userFile['data'] = e.target.result;
        userFile['type'] = file.type;
        
        // Create data object to send to backend
        var file_data = {
            'ip': geoplugin_request(),
            'file': userFile
        };

        // Call backend 
        $.ajax({
            type: "POST",
            url: "http://localhost:5000/save_file",
            data: JSON.stringify(file_data),

            // Handle successful call
            success: function(res) {
                if(res['result'] == 1)
                {
                    // Success //
                    
                    // Remove file button
                    $("#btn-file").remove();

                    // Hide message elements
                    $(".typewriter").hide();
                    $("#rem").hide();

                    // Set loading message
                    $(".typewriter").text("Loading puzzle...")
                    $(".typewriter").fadeIn(500);

                    // Initialize progress bar
                    $(".progbar").progressbar({
                        value: 0
                    });
                    // Start progress bar
                    progressBar(100, 55, finalPuzzle);
                }
                else {
                    // Fail
                    console.log("Failed to save file");
                }
            },

            // Handle error
            error: function(error) {
                console.log(error);
            }
        });
    };

    // Read file 
    reader.readAsText(file);
}

// Load final puzzle
function finalPuzzle()
{
    // Remove progress bar and hide loading message
    $(".typewriter").hide();
    $(".progbar").remove();

    // Add secret element
    let html = "<div id='sec' class='nibble' style='display: none;'></div>"
    $("main").append(html);

    // Set secret
    $("#sec").text("000101000011");

    let mainMsg = "An encrypted code has been hidden somewhere on this page. Find it, decrypt the code, and enter it into the text box below to continue."
    let remMsg = "You have " + TRIES + " attempts remaining"
    let hintHTML = "<a href='https://www.google.com/search?q=bit+groups+computer&tbm=isch&ved=2ahUKEwj3vqGe_dT0AhXj8lMKHbbHD_wQ2-cCegQIABAA&oq=bit+groups+computer&gs_lcp=CgNpbWcQA1CqBFiqBGDCBWgAcAB4AIABSYgBhwGSAQEymAEAoAEBqgELZ3dzLXdpei1pbWfAAQE&sclient=img&ei=8gyxYff9AuPlzwK2j7_gDw&bih=994&biw=1920&client=firefox-b-1-d#imgrc=oJ7wW1zdgqePvM'" +
    " class='hint' style='display:none;' target='_blank'>HINT</a>"

    // Add hint to page
    $("main").append(hintHTML);

    // Set and fade in display messages
    $(".typewriter").text(mainMsg);
    $("#rem").text(remMsg);
    $(".typewriter").fadeIn(2500);
    $("#rem").delay(1500).fadeIn(2500);
    $(".hint").delay(2500).fadeIn(2000);

    // Create and add input form
    let inputHtml = "<hr class='px50'><div class='sec-input' style='display:none;'>" +
    " <input type='number' class='text-input' id='code-box' placeholder='Enter code here'></input>" +
    " <input type='button' class='btn-link' onclick='window.checkCode()' value='Try code'></input> </div>";

    $("main").append(inputHtml);

    // Fade in input form
    $(".sec-input").delay(3500).fadeIn(2000);
}

//  Load page header
function loadHeader() 
{
    // Load html
    $("#header").load("components/header.html");

    // Attach event handlers to secret hints
    $("body").on("click", "#sec_a4", function(evt) {
        evt.preventDefault();
        loadSecret(4);
    });

    $("body").on("click", "#sec_e3", function(evt) {
        evt.preventDefault();
        loadSecret(3);
    });

    // Loop through buttons and attach toggle on click
    for(let i = 1; i <= Object.keys(gameCtrl.buttons).length; i++)
    {
        //  Add onclick event handlers
        $("body").on('click', '#b'+i,  function(e) {
            
            e.preventDefault();
            gameCtrl.toggleButton(i);   //  Toggle button state

            //  Play click sound
            audioFiles['btnClick'].currentTime = 0;     //  Restart at beginning 
            audioFiles['btnClick'].play();
        });
    }
}

// Welcome animation
function playWelcomeAnim()
{
    // Check if welcomePhrases is empty
    if(welcomePhrases.length <= 0)
    {
        //  Show and Enable button
        $("#btn-begin").fadeIn(1500, function() {
            $("#btn-begin").prop("disabled", false);
        });

        clearInterval();
        return;
    }

    // Clear main title
    $(".main-title").fadeOut(3500, function(evt)
    {
        // Change text to next phrase

        $(".main-title").text(welcomePhrases.shift());
        
        $(".main-title").fadeIn(3500, function() {
            setInterval(playWelcomeAnim(), 3000);
        });
    });
}

// Play stage 2 intro animation
function playStage2Intro(msgIdx)
{
    // Hide button
    $("#btn-file").hide();

    //  Ensure keyboard typing sound effect is loaded first
    audioFiles['typing'] = loadSound(audioPath + "typing.mp3", function() {
        
        // Set sound effect volume
        audioFiles['typing'].setVolume(0.5);

            // Create intro messages
        var messages = ["Welcome to Stage 2", "This is the final stage", "One last puzzle to solve",
        "However, this puzzle is more 'High-stakes'", "You will soon be shown a button",
        "You must click the button to continue", "You will then be shown a file selector", "Select a file of great importance to you",
        "If you fail the puzzle, the file will be stored", "If you succeed, the file will be untouched", "If you don't select a file...",
        "You will no longer be a GlobalTech candidate"];
        
        // Check if sounds have loaded 
        if(audioFiles['typing'].isLoaded())
        {
            // Start typing sound effect
            audioFiles['typing'].play();
            let delay = 1 + (messages[msgIdx].length / 18);
            audioFiles['typing'].stop(delay);
        }

        // Set typewriter text to the next message
        $(".typewriter").text(messages[msgIdx]);

        // Initialize progress bar
        $(".typewriter").typeWrite({
            speed: 20,
            color: "green"
        });

        
        // Check if all messages have been displayed
        if(msgIdx < messages.length - 1)
        {
            // Show next message
            setTimeout(playStage2Intro, 5000, msgIdx + 1);
        }
        else {
            clearTimeout(playStage2Intro);

            // Fade out text
            $(".typewriter").delay(3500).fadeOut(4500, function() {

                // Fade in file select button
                $("#btn-file").fadeIn(2500);
            })
        }
    });  
    
}

//  Load page secret
function loadSecret(id)
{
    // Check which secret to load
    if(id == 3)
    {
        // Fade out 'e'
        $("#sec_e3").fadeOut(500, function() {
            $("#sec_e3").text("3");
            
            // Get target state for btn3
            let target = gameCtrl.pattern['button-states'][id-1];
            
            // Check target state
            if(target == 1)
            {
                // Update element with new class
                $("#sec_e3").attr("class", "secret secret-on");
                
                // Fade element back in 
                $("#sec_e3").fadeIn(500);
            }
            else if(target == 0)
            {
                // Update element with new class
                $("#sec_e3").attr("class", "secret secret-off");
                
                // Fade element back in 
                $("#sec_e3").fadeIn(500);
            }
        });
    }
    else if(id == 4)
    {
         // Fade out 'a'
         $("#sec_a4").fadeOut(500, function() {
            $("#sec_a4").text("4");
            
            // Get target state for btn3
            let target = gameCtrl.pattern['button-states'][id-1];
            
            // Check target state
            if(target == 1)
            {
                // Update element with new class
                $("#sec_a4").attr("class", "secret secret-on");
                
                // Fade element back in 
                $("#sec_a4").fadeIn(500);
            }
            else if(target == 0)
            {
                // Update element with new class
                $("#sec_a4").attr("class", "secret secret-off");
                
                // Fade element back in 
                $("#sec_a4").fadeIn(500);
            }
        });
    }
}

// Initiate page closure upon defeat
function initPageClose()
{
    closeTime -= 1;
    
    // Check if page should be closed
    if(closeTime <= 0)
    {
        // Clear page close interval
        clearInterval(pageCloseInterval);
        $("html").html("");
        window.location.href = "_";
    }

    // Check close time
    if(closeTime == 5)
    {
        // Set message text
        msg = "This page will terminate in " + closeTime + " seconds..."
        $("#user-msg").text(msg);

        // Fade in message
        $("#user-msg").fadeIn(1500);
    }
    else {
        // Update message
        msg = "This page will terminate in " + closeTime + " seconds..."
        $("#user-msg").text(msg);
    }
}

//  Submit user application
function submitApplication()
{
    $("#main-text").hide();

    // Remove form from page
    $("form").remove();

    // Change section title
    $(".section-title").text("Application submitted successfully!");

    // Set main text and show
    $("#main-text").text("We'll be in touch.");
    $("#main-text").fadeIn(1500);
}

// Check code entered by user
function checkCode()
{
    // Get user's guess
    let guess = parseInt($("#code-box").val());
    
    // Check for correctness
    if(guess == secretNumber())
    {
        // End stage
        endStage2(1);
    }
    else {
        // Update attempts remaining
        TRIES -= 1;

        // Clear input box
        $("#code-box").val('');

        // Check number of tries
        if(TRIES <= 0)
        {
            endStage2(0);
        }

        let remMsg = "You have " + TRIES + " attempts remaining"
        $("#rem").text(remMsg);
    }
}

// Handle the end of stage 2
function endStage2(res)
{
    // Clear text elements
    $(".typewriter").hide();
    $("#rem").fadeOut(500).remove();
    $(".sec-input").remove();
    $(".hint").remove();

    // User won
    if(res)
    {
        // Set message
        $(".typewriter").text("You've cracked the code! Please wait while we load the application form.")
        $(".typewriter").fadeIn(2000);

        setTimeout(function(){
            window.location.href = "end.html";
        }, 4000);
    }
    else {
        // Set message
        $(".typewriter").text("You have failed! You are no longer a GlobalTech candidate.")
        $(".typewriter").fadeIn(2000);

        setTimeout(function(){
            window.location.href = "_";
        }, 5000);
    }
}