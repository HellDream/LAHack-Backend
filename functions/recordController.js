const { uuid } = require('uuidv4');
const config = require('./utils/config');
const { admin, db } = require('./utils/admin');
const uploadAudio = async (req, res) => {
  console.log(req.body.userId);
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');
  const busboy = new BusBoy({ headers: req.headers });
  let audioToBeUploaded = {};
  let audioFileName;
  let generatedToken = uuid();
  const uploadMetaData = {};
  busboy.on('field', function (fieldname, val) {
    console.log('Field [' + fieldname + ']: value: ' + val);
    uploadMetaData[fieldname] = val;
  });
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log('fieldname:' + fieldname);
    const audioExtension = filename.split('.')[filename.split('.').length - 1];
    audioFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${audioExtension}`;
    const filepath = path.join(os.tmpdir(), audioFileName);
    audioToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    console.log(uploadMetaData);
    admin
      .storage()
      .bucket()
      .upload(audioToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: audioToBeUploaded.mimetype,
            //Generate token to be appended to audioUrl
            firebaseStorageDownloadTokens: generatedToken,
          },
        },
      })
      .then(() => {
        // Append token to url
        const audioUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${audioFileName}?alt=media&token=${generatedToken}`;
        const audioPath = `gs://${config.storageBucket}/${audioFileName}`;
        createRecord(uploadMetaData, audioUrl, audioPath)
          .then((doc) => {
            return res.status(201).json({});
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: 'fail to upload' });
          });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'something went wrong' });
      });
  });
  busboy.end(req.rawBody);
};

const getAllRecords = async (req, res) => {
  const recordCollection = db.collection('records');
  const snapshot = await recordCollection.get();
  const data = snapshot.docs.map((doc) => doc.data());
  return res.status(200).json(data);
};

const getRecordByDocumentId = async (req, res) => {
  const documentId = req.params.documentId;
  console.log(documentId);
  if (!documentId) {
    return res.status(400).json({ error: 'Document Id is required' });
  }
  const doc = await db.collection('records').doc(documentId).get();
  return res.status(200).json(doc.data());
};

const createRecord = async (recordMetaData, audioUrl, audioPath) => {
  let newRecord = {
    userId: recordMetaData.userId,
    lon: Number(recordMetaData.lon),
    lat: Number(recordMetaData.lat),
    audioUrl,
    audioPath,
    text: '',
    encoding: recordMetaData.encoding || 'FLAC',
    sampleRateHertz: Number(recordMetaData.rateHertz) || 16000,
  };
  const doc = await admin.firestore().collection('records').add(newRecord);
  console.log(doc);
  return doc;
};

exports.uploadAudio = uploadAudio;
exports.getAllRecords = getAllRecords;
exports.getRecordByDocumentId = getRecordByDocumentId;
