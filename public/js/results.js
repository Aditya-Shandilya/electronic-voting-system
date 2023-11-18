fetch('/api/candidates')
        .then(response => response.json())
        .then(candidates => {
          const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
          candidates.sort((a, b) => b.votes - a.votes); // Sort candidates array in descending order based on votes
          candidates.forEach(candidate => {
            const percentage = totalVotes === 0 ? 0 : Math.round(candidate.votes * 100 / totalVotes);
            const candidateElement = document.createElement('div');
            candidateElement.className = 'candidate';
            candidateElement.innerHTML = `
              <div class="name">${candidate.name}</div>
              <div class="party">${candidate.party}</div>
              <div class="percentage">${percentage}%</div>
            `;
            if (candidate.position === 'president') {
              document.querySelector('#president-results').appendChild(candidateElement);
            } else if (candidate.position === 'vice-president') {
              document.querySelector('#vice-president-results').appendChild(candidateElement);
            }
          });
          const presidentVotes = candidates.find(candidate => candidate.position === 'president').votes;
          const vicePresidentVotes = candidates.find(candidate => candidate.position === 'vice-president').votes;
          const presidentPercentage = totalVotes === 0 ? 0 : Math.round(presidentVotes * 100 / totalVotes);
          const vicePresidentPercentage = totalVotes === 0 ? 0 : Math.round(vicePresidentVotes * 100 / totalVotes);
          if (presidentPercentage > vicePresidentPercentage) {
            document.querySelector('#president-results .candidate:nth-child(1)').classList.add('winner');
          } else if (presidentPercentage < vicePresidentPercentage) {
            document.querySelector('#vice-president-results .candidate:nth-child(1)').classList.add('winner');
          }
        })
        .catch(error => console.error(error));