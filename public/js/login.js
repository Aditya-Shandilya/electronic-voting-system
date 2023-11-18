function submitLoginForm() {
  // Submit form data
  const form = document.getElementById('login-form');
  const data = JSON.stringify({
    username: form.elements['username'].value,
    password: form.elements['password'].value
  });
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Incorrect username or password');
    }
  })
  .then(responseData => {
  console.log(responseData);
  if (responseData.redirect) {
    window.location.href = responseData.redirect;
  } else {
    const errorElement = document.getElementById("error-message");
    errorElement.innerText = responseData.error;
    errorElement.style.display = "block";
  }
})
  .catch(error => {
    // Display error message
    const errorElement = document.getElementById("error-message");
    errorElement.innerText = error.message;
    errorElement.style.display = "block";
  });
}