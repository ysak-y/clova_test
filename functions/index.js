'use strict'
const functions = require('firebase-functions');
const clova = require('@line/clova-cek-sdk-nodejs');
const express = require("express");
const router = express.Router();

const clovaSkillHandler = clova.Client
.configureSkill()
.onLaunchRequest(responseHelper => {
  responseHelper.setSimpleSpeech({
    lang: 'ja',
    type: 'PlainText',
    value: 'おはよう',
  });
})
.onIntentRequest(responseHelper => {
  const intent = responseHelper.getIntentName();
  const sessionId = responseHelper.getSessionId();
  console.log(`intent name is ${intent}`);

  switch (intent) {
    case 'HelloIntent':
      // Build speechObject directly for response
      responseHelper.setSimpleSpeech({
        lang: 'ja',
        type: 'PlainText',
        value: 'こんにちは',
      });
      break;
    case 'Clova.NoIntent':
      // Or build speechObject with SpeechBuilder for response
      responseHelper.setSimpleSpeech(
        clova.SpeechBuilder.createSpeechText('いえいえ')
      );
      break;
  }
})
.onSessionEndedRequest(responseHelper => {
  const sessionId = responseHelper.getSessionId();

  // Do something on session end
})
.handle();

const check = (req, res, next) => {
  console.log(`request header is ${JSON.stringify(req.headers)}`);
  console.log(`sig is ${req.headers.signaturecek}`)
  console.log(`body is ${JSON.stringify(req.body)}`);
  console.log(`hostname is ${req.hostname}`);
  console.log(`originalUrl is ${req.originalUrl}`);
  console.log(`path is ${req.path}`);
  console.log(`baseUrl is ${req.baseUrl}`);
  next();
}

const app = new express();
app.use(check);
app.post('/', clovaSkillHandler);

const test = functions.https.onRequest(app);

module.exports = { test };
