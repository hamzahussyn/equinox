// document.getElementById('submit').addEventListener('click', function () {
//   let password = document.getElementById('password');
//   let confirmPassword = document.getElementById('confirmPassword');

//   if (password.value.length < 8) {
//     return document.getElementById('passwordError').innerText = "Password must be minimum of 8 characters."
//   }

//   if (password.value !== confirmPassword.value) {
//     return document.getElementById('confirmPasswordError').innerText = "Confirm Password does not match."
//   }

//   form.submit();
// })

function validate() {
  let password = document.getElementById('password');
  let confirmPassword = document.getElementById('confirmPassword');

  if (password.value.length < 8) {
    document.getElementById('passwordError').innerText = "";
    document.getElementById('passwordError').innerText = "Password must be minimum of 8 characters."
    return false;
  } else {
    document.getElementById('passwordError').innerText = "";
  }

  if (password.value !== confirmPassword.value) {
    document.getElementById('confirmPasswordError').innerText = ""
    document.getElementById('confirmPasswordError').innerText = "Confirm Password does not match."
    return false;
  } else if (password.value === confirmPassword.value) {
    document.getElementById('confirmPasswordError').innerText = ""
  }

  return true;
}