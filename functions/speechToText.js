// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

const speechTextConverter = async (audioUri, encoding, rateHertz) => {
  const client = new speech.SpeechClient();
  const sampleRateHertz = rateHertz;
  const languageCode = 'en-US';
  const uri = audioUri;

  // Create Speech API config object for audio file
  const config = {
    encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  const audio = {
    uri: uri,
  };

  const request = {
    config: config,
    audio: audio,
  };
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join('\n');
  console.log('Transcription: ', transcription);
  return transcription;
};

exports.speechTextConverter = speechTextConverter;
