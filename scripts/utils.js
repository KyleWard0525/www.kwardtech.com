var start_t; // Start time
var sec_enabled = false; // Secret enabled
const threshold_t = 10.0; // Threshold time for check (10s)

/*  Call on page load   */
function onLoad()
{
    //  Get start time
    start_t = new Date();

    //  Start checking for secret
    checktime();
}

/*  Check elapsed time since page load  */
function checktime()
{
    //  Get current and elapsed time in seconds
    var end_t = new Date();
    var elapsed = Math.round((end_t - start_t) / 1000.0);

    //  Check elapsed time and that it hasn't run yet
    if (elapsed >= threshold_t && !sec_enabled)
    {
        //  Get main body of page
        var mainPage = document.getElementById("main-container");
    
        //  Create secret text input
        var input = document.createElement("input");
        input.setAttribute("type", "password");
        input.setAttribute("id", "sec-pw");

        //  Create secret submit button
        var btn = document.createElement("button");
        btn.textContent = "Try key";
        btn.setAttribute("id", "sec-btn");
        btn.setAttribute("onclick", "checkSecretKey()");

        //  Add elements to page
        for(i = 0; i < 10; i++)
        {
            mainPage.appendChild(document.createElement("br"));
        }

        mainPage.appendChild(input);
        mainPage.appendChild(btn);

        //  Set secret enabled to try
        sec_enabled = true;

        //  Add event listener to input
        onEnter(input, btn.id);
    }

    //Check if secret is enabled
    if(!sec_enabled)
    {
        //  Wait for 1000ms then try again
        setTimeout(checktime, 1000);
    }
    
}

/*  Check if the secret key entered is correct  */
function checkSecretKey()
{
    //  Get key guess from input box
    var key_guess = document.getElementById("sec-pw").value;

    //  Remove secret input and button
    document.getElementById("sec-pw").remove();
    document.getElementById("sec-btn").remove();

    if(key_guess == "testpw")
    {
        window.location.href = "nice.html";
    }
    else {
        alert("Authentication failed!");
    }
}