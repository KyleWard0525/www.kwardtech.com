/**
 * Utilities for supporting the game
 */


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
    alert("Secret Number: " + num);
}
