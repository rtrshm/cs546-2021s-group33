function typeChecker(input, string)//input is input, string is type. For example, (1, 'number')
{
    if(typeof input !== string)
    {
        throw "Error: Input is not a " + string;
    }
}

function checkErrorArray(array, string)//array is array input, string is type. For example, ([1,2,3], 'number')
{
    if (array === undefined)
    {
        throw "Error: The array is undefined or does not exist";
    }
    if(!Array.isArray(array))
    {
        throw "Error: The input is not an array";
    }
    if(array.length == 0)
    {
        throw "Error: The array is empty";
    }
    for(let i = 0; i < array.length; i++)
    {
        if(typeof array[i] !== string) 
        {
            throw "Error: Index " + i + " of the array is not a " + string;
        }
    }

}

function existenceChecker(input)
{
    if(input === undefined || !input)
    {
        throw "Error: input does not exist";
    }
}

function stringChecker(string, name)
{
    if(!string)
    {
        throw "Error: " + name + " does not exist";
    }
    if(typeof string !== 'string')
    {
        throw "Error: " + name + " is not a string";
    }
    string = string.trim();
    if(string === "" || string.length === 0)
    {
        throw "Error: " + name + " cannot be \"\" or contain only whitespace";
    }
}

function ValidateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    if(!re.test(email))
    {
        throw "Error: Not a Valid Email";
    }
}//stolen from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript

function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};
//code stolen from https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript

function ratingChecker(num)
{
    if(!num)
    {
        throw "Error: No rating supplied";
    }
    if(!Number.isInteger(num))
    {
        throw "Error: rating must be an integer";
    }
    if(num < 1 || num > 5)
    {
        throw "Error: rating must be between 1-5";
    }
}
module.exports = {
    typeChecker,
    checkErrorArray,
    existenceChecker,
    stringChecker,
    ValidateEmail,
    isValidDate,
    ratingChecker
}