
let myUser = document.getElementById('username');
let myPass = document.getElementById('password');
let myEmail = document.getElementById('email');
let myConfirmPass = document.getElementById('confirmpassword');
let myForm = document.getElementById('signup-form');
let err = document.getElementById('error');

function ValidateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    if(!re.test(email))
    {
        throw "Error: Not a Valid Email";
    }
}//stolen from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript

myForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let password = myPass.value;
    let username = myUser.value;
    let email = myEmail.value;
    let confirmpassword = myConfirmPass.value;

    if (!email || typeof(email) !== 'string' || email.trim().length == 0) {
        err.innerHTML = "No email provided or email is not valid string.";
        myEmail.focus();
        return 0;
    }
    try {
        ValidateEmail(email);
    } catch(e) {
        err.innerHTML = "Email has invalid format.";
        myEmail.focus();
        return 0;   
    }
    
    if (!username || typeof(username) !== "string" || username.trim().length == 0) {
        err.innerHTML = "No username provided or username is not valid string.";
        myUser.focus();
        return;
    }

    if (!password || typeof(password) !== "string" || password.trim().length == 0) {
        err.innerHTML = "No password provided or password is not valid string.";
        myPass.focus();
        return;
    }

    if (!confirmpassword || typeof(confirmpassword) !== "string" || confirmpassword.trim().length == 0) {
        err.innerHTML = "No confirmpassword provided or confirmpassword is not valid string.";
        myPass.focus();
        return;
    }

    if (password !== confirmpassword) {
        err.innerHTML = "Passwords do not match.";
        return 0;  
    }

    document.login.submit();
  });