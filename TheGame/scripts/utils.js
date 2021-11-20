/**
 * Utilities for supporting the game
 */

// Generate a random integer in a given range
function randint(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}