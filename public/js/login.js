let myUser = document.getElementById('username');
let myPass = document.getElementById('password');
let myForm = document.getElementById('login-form');
let err = document.getElementById('error');
myForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let password = myPass.value;
    let username = myUser.value;
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

    document.login.submit();
  });