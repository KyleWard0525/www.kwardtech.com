/**
 * Utilities for supporting the game
 */

var users = {};

// Show progress bar
export function progressBar(max, delay, callback)
{
    // Get current progress value
    let val = $(".progbar").progressbar("value");

    // Increment progress
    $(".progbar").progressbar("value", val+1);

    // Check if loading is done
    if(val < max)
    {
        // Recursively run the progress bar until its done
        setTimeout(progressBar, delay, max, delay, callback);
    }
    else {
        // Run callback function when loading is done
        callback();
    }
    
}

// Generate a random integer in a given range
export function randint(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Open file selector dialog
export function selectFile(callbackFunc)
{
    // Create input variable and set type to file
    var input = document.createElement("input");
    input.type = 'file';

    // Handle file selection
    input.onchange = evt => {

        // Get selected file
        var file = evt.target.files[0];

        // Handle file with callback function
        callbackFunc(file);
    }

    input.click();
}

// Get correct number for secret code
export function secretNumber()
{
    let encrypted = '000101000011';
    let encTokens = encrypted.split("");
    let num = '';
    let idx = 11;

    for(let i = 0; i < 3; i++)
    {
        let nSum = 0;

        for(let j = 0; j < 4; j++)
        {
            nSum += Math.pow(2,j) * parseInt(encTokens[idx]);  
            idx--;
        }
        num += nSum.toString();
    }

    num = parseInt(num.split("").reverse().join(""));
    return num;
}

// Read user data from json file
export function readUserFile()
{
    // User file path
    let filepath = "components/data/users.json";

    // Use ajax to read file
    $.ajax({
        type: "GET",
        url: filepath,
        dataType: "json",

        // Loaded successfully
        success: function(data)
        {
            // Save data to local storage
            localStorage.setItem("users", JSON.stringify(data['users']));
        },

        // Error loading file
        error: function(error) 
        {
            console.log("\nERROR in utils.readUserFile(): " + error + "\n");
        }
    });
}

// Generate new user id
export function newUserID()
{
    return Date.now();
}

export function userExists(id)
{
    let users = JSON.parse(localStorage.getItem("users"));

    // Loop through users
    for(let i = 0; i < Object.keys(users).length; i++)
    {
        // Select user
        let user = users[i];

        // Check if IDs match
        if(user['id'] == id)
        {
            return 1;
        }
    }

    return 0;
}

export function saveNewUser(user)
{
    //  Ensure user doesn't exist
    if(!userExists(user['id']))
    {
        // Get current users
        let users = JSON.parse(localStorage.getItem("users"));

        // Append new user
        users[Object.keys(users).length] = user;
        localStorage.setItem("users", JSON.stringify(users));
    }
    else {
        console.log("\nERROR in utils.saveNewUser(): User already exists");
    }
}