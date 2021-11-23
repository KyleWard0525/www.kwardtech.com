const game = {
    started: false,
    usrLives: 3,
    msg: '',
};

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


// Old Challenge
function beginChallenge()
{
    if(!game.started)
    {
        let hiddenMsg = document.createElement("p");
        hiddenMsg.textContent = "000101000011";
        game.msg = hiddenMsg.textContent;
        
        let p = document.getElementById("na");
        p.appendChild(hiddenMsg);
        p.setAttribute("hidden", "true");

        game.started = true;
        
        alert("The challenge has begun.\n\nAn encrypted code has been hidden somewhere on this page.\n\nFind it, decrypt the message, click the button again, and enter the code into the prompt to continue.");
    }
    else {
        if(game.usrLives > 0)
        {
            let userCode = prompt("Found the code have you?\n\nI hope you're sure.", "Enter code here");
            var n = 180;

            if((parseInt(game.msg, 2) - parseInt(n.toString(2), 2)) + n === (parseInt(userCode) + n))
            {
                alert("\nCONGRATULATIONS! YOU SOLVED THE PUZZLE\n\nClick 'Ok' to load reward");
                window.open("images/pomsky.jpg");
                $("#btn-begin").remove();
            }
            else {
                game.usrLives -= 1;

                if (game.usrLives <= 0)
                {
                    selfDestruct();
                }
                else if(game.usrLives == 1)
                {
                    alert("WRONG!\n\nYOU HAVE " + game.usrLives + " ATTEMPT(S) REMAINING!\n\n\nHint: The encrypted message may not be in the correct format.");
                }
                else {
                    alert("WRONG!\n\nYOU HAVE " + game.usrLives + " ATTEMPT(S) REMAINING!\n\n\nUse them wisely.");
                }
            }
        }
        
    }
    
}


function selfDestruct()
{
    const elems = document.querySelectorAll("*");

    for(let i = 0; i < elems.length; i++)
    {
        elems[i].remove();
    }
}