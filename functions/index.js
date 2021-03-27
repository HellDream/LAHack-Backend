const functions = require('firebase-functions');
const cors = require('cors');
const app = require('express')();

const { uploadAudio, getAllRecords } = require('./recordController');

const { audioConverterTrigger } = require('./triggers');
process.env.GOOGLE_APPLICATION_CREDENTIALS = './lahacks.json';
console.log(process.env);
app.use(cors());

app.post('/records', uploadAudio);
app.get('/records', getAllRecords);
exports.api = functions.region('us-central1').https.onRequest(app);
exports.generateText = audioConverterTrigger;
