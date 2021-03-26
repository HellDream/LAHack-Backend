const { speechTextConverter } = require('./speechToText');
const { db } = require('./utils/admin');
const functions = require('firebase-functions');

const audioConverterTrigger = functions.firestore
  .document('records/{documentId}')
  .onCreate(async (snap, context) => {
    const doc = snap.data();
    const audioPath = doc.audioPath;
    const documentId = snap.id;
    console.log(`Generating speech text for document: ${documentId}`);
    if (!audioPath) {
      console.log('audio path not found');
      return;
    }
    speechTextConverter(audioPath, 'FLAC', 48000)
      .then((translation) => {
        let text = '';
        if (!translation || translation === '') {
          text = 'I need help!!';
        } else {
          const cleanTranslation = translation.replace('-', ' ');
          text = cleanTranslation;
        }
        db.collection('records')
          .doc(documentId)
          .update({ text })
          .then((result) => {
            console.log(result);
            console.log('Update text');
          })
          .catch((err) => {
            console.log(`Error occured when updating ${documentId}`);
            console.log(err);
          });
      })
      .catch((err) => {
        console.log('Convert to text failed');
        console.log(err);
      });
  });

exports.audioConverterTrigger = audioConverterTrigger;
