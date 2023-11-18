function fetchCandidates() {
    const presidentSelect = document.getElementById('president');
    const vicePresidentSelect = document.getElementById('vice-president');
    fetch('/api/candidates')
      .then(response => response.json())
      .then(data => {
        data.forEach(candidate => {
          const option = document.createElement('option');
          option.value = candidate.id;
          option.textContent = candidate.name; 
          if (candidate.position === 'president') {
            presidentSelect.appendChild(option);
          } else if (candidate.position === 'vice-president') {
            vicePresidentSelect.appendChild(option);
          }
        });
      })
      .catch(error => console.error(error));
  }
  function submitVote() {
const form = document.getElementById('voting-form');
console.log('Submitting vote for President ID', form.elements['president'].value, 'and Vice President ID', form.elements['vice-president'].value);
fetch('/api/vote', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    presidentId: form.elements['president'].value,
    vicePresidentId: form.elements['vice-president'].value
  })
})
.then(response => {
  if (response.ok) {
    alert("Vote submitted");
    setTimeout(function() {
      window.location.href = "index.html";
    }, 2000);
  } else {
    throw new Error('Vote submission failed');
  }
})
.catch(error => console.error(error));
}