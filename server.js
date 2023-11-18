require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, enum: ['president', 'vice-president'] },
  party: { type: String },
  votes: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'voter'], default: 'voter' },
  candidate: candidateSchema,
  uniqueId: { type: String, required: true, unique: true }
});


const User = mongoose.model('User', userSchema);
const Candidate = mongoose.model('Candidate', candidateSchema);

app.use(express.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username, password: password })
    .then(user => {
      if (user) {
        if (user.role === 'admin') {
          res.json({ redirect: '/dashboard.html' });
        } else {
          res.json({ redirect: '/voting.html' });
        }
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.post('/api/candidates', (req, res) => {
  const { name, position, party } = req.body;
  const candidate = new Candidate({ name, position, party });
  candidate.save()
    .then(() => res.json({ message: 'Candidate added to Database' }))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/api/candidates', (req, res) => {
  Candidate.find({})
    .then(candidates => {
      const candidateList = candidates.map(candidate => {
        return {
          id: candidate._id,
          name: candidate.name,
          position: candidate.position,
          party: candidate.party,
          votes: candidate.votes
        };
      });
      res.json(candidateList);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/api/candidates/:id', (req, res) => {
  const id = req.params.id;
  Candidate.findById(id)
    .then(candidate => {
      res.json({ votes: candidate.votes });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.post('/api/signup', (req, res) => {
  const { firstName, lastName, username, email, password, uniqueId } = req.body;
  
  // Check if the unique identifier already exists in the database
  User.findOne({ uniqueId })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this unique identifier already exists' });
      }
      
      // Create a new user with the provided information
      const user = new User({ firstName, lastName, username, email, password, uniqueId });
      user
        .save()
        .then(() => {
          res.status(200).json({ message: 'Signup successful' });
        })
        .catch(error => {
          res.status(500).json({ error: 'Internal Server Error' });
        });
    })
    .catch(error => {
      const message = error.responseJSON.error;
      alert(message);
    });    
});

app.post('/api/vote', (req, res) => {
  const { presidentId, vicePresidentId } = req.body;
  const updatePromises = [];
  if (presidentId) {
    updatePromises.push(Candidate.findByIdAndUpdate(presidentId, { $inc: { votes: 1 } }));
  }
  if (vicePresidentId) {
    updatePromises.push(Candidate.findByIdAndUpdate(vicePresidentId, { $inc: { votes: 1 } }));
  }
  Promise.all(updatePromises)
    .then(() => res.json({ message: 'Vote submitted successfully' }))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.use(express.static('public'));

const port = process.env.PORT || 3000;
mongoose.connection.once('open', function(){
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}).on('error', function(error){
  console.log("Connection error:", error);
});