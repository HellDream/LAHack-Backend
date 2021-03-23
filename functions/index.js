const functions = require('firebase-functions');
const cors = require('cors');
const app = require('express')();

const { uploadAudio } = require('./recordController');
app.use(cors());

app.post('/uploadAudio', uploadAudio);
app.get('/helloWorld', (req, res) => {
  return res.json({ data: 'hello world' });
});

exports.api = functions.region('us-central1').https.onRequest(app);
