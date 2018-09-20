import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
const cors = require('cors')({ origin: true });

import excel from './excel';
import deleteArea from './deleteArea';

admin.initializeApp();

const database = admin.database();

exports.excel = functions.https.onRequest((req, res) => {
  excel(req, res, database);
});

exports.deleteArea = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    deleteArea(req, res, database);
  });
});
