function submitSignupForm() {
  // Submit form data
  const form = document.getElementById('signup-form');
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/signup');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // Redirect to login page after 2 seconds
        setTimeout(function() {
          window.location.href = "login.html";
        }, 2000);
      } else {
        const response = JSON.parse(xhr.responseText);
        alert(response.error);
      }
    }
  };
  const data = JSON.stringify({
    firstName: form.elements['FirstName'].value,
    lastName: form.elements['LastName'].value,
    username: form.elements['username'].value,
    email: form.elements['email'].value,
    password: form.elements['password'].value,
    uniqueId: form.elements['uniqueId'].value
  });
  xhr.send(data);
}
