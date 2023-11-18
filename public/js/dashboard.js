document.addEventListener('DOMContentLoaded', () => {
	loadCandidates();
	
	const addCandidateForm = document.getElementById('addCandidateForm');
	addCandidateForm.addEventListener('submit', (e) => {
	  e.preventDefault();
	  const name = document.getElementById('name').value;
	  const position = document.getElementById('position').value;
	  const party = document.getElementById('party').value;
	
	  const newCandidate = { name, position, party };
	
	  fetch('/api/candidates', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(newCandidate)
	  })
	  .then(response => {
		if (response.ok) {
		  console.log(response);
		  alert('Candidate added to Database');
		  loadCandidates();
		} else {
		  throw new Error('Network response was not ok');
		}
	  })
	  .catch(error => {
		console.error('There was a problem with the fetch operation:', error);
	  });
	});
  
	const exportButton = document.getElementById('exportButton');
	exportButton.addEventListener('click', (e) => {
	  e.preventDefault();
	  exportResults();
	});
  });
  
  function loadCandidates() {
	fetch('/api/candidates')
	  .then(response => {
		if (response.ok) {
		  return response.json();
		} else {
		  throw new Error('Network response was not ok');
		}
	  })
	  .then(candidates => {
		const presidentList = `
		  <table>
			<thead>
			  <tr>
				<th>Name</th>
				<th>Party</th>
				<th>Votes</th>
			  </tr>
			</thead>
			<tbody>
			  ${candidates.filter(candidate => candidate.position === "president").map(candidate => `
				<tr>
				  <td>${candidate.name}</td>
				  <td>${candidate.party}</td>
				  <td>${candidate.votes}</td>
				</tr>
			  `).join('')}
			</tbody>
		  </table>
		`;
		document.getElementById('presidentCandidates').innerHTML = presidentList;
  
		const vicePresidentList = `
		  <table>
			<thead>
			  <tr>
				<th>Name</th>
				<th>Party</th>
				<th>Votes</th>
			  </tr>
			</thead>
			<tbody>
			  ${candidates.filter(candidate => candidate.position === "vice-president").map(candidate => `
				<tr>
				  <td>${candidate.name}</td>
				  <td>${candidate.party}</td>
				  <td>${candidate.votes}</td>
				</tr>
			  `).join('')}
			</tbody>
		  </table>
		`;
		document.getElementById('vicePresidentCandidates').innerHTML = vicePresidentList;
	  })
	  .catch(error => {
		console.error('There was a problem with the fetch operation:', error);
	  });
  }
  
  
  function exportResults() {
	fetch('/api/candidates')
	  .then(response => {
		if (response.ok) {
		  return response.json();
		} else {
		  throw new Error('Network response was not ok');
		}
	  })
	  .then(candidates => {
		let csvContent = "data:text/csv;charset=utf-8,";
		if (candidates.some(candidate => candidate.position === "president")) {
		  csvContent += "President\nName,Party,Votes\n";
		  csvContent += candidates.filter(candidate => candidate.position === "president")
			.map(candidate => `${candidate.name},${candidate.party},${candidate.votes}`)
			.join("\n");
		}
		if (candidates.some(candidate => candidate.position === "vice-president")) {
		  csvContent += "\nVice President\nName,Party,Votes\n";
		  csvContent += candidates.filter(candidate => candidate.position === "vice-president")
			.map(candidate => `${candidate.name},${candidate.party},${candidate.votes}`)
			.join("\n");
		}
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "election_results.csv");
		document.body.appendChild(link);
		link.click();
	  })
	  .catch(error => {
		console.error('There was a problem with the fetch operation:', error);
	  });
  }
  