import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { formatFirebaseArray } from './util/utils';
import { DataGroup } from './util';

const validateRequest = (req: functions.Request) => {
  return new Promise((resolve, reject) => {
    const { key } = req.query;

    if (!key) {
      reject({
        code: 422,
        status: 'error',
        message: 'Missing key in query'
      });
    }

    resolve();
  });
};

const getData = (database: admin.database.Database): Promise<DataGroup> => {
  return new Promise(async resolve => {
    const [areaRes, contactsRes] = await Promise.all([
      database.ref('/areas').once('value'),
      database.ref('/contacts').once('value')
    ]);

    const areas = formatFirebaseArray(areaRes.val());
    const contacts = formatFirebaseArray(contactsRes.val());

    resolve({ contacts, areas });
  });
};

const unassignContacts = (
  database: admin.database.Database,
  { contacts, areas }: DataGroup,
  areaRef: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const area = areas.find(a => a.key === areaRef);

    if (!area) {
      reject({
        code: 404,
        status: 'error',
        message: `Area with ref: ${areaRef} not found.`
      });
    }

    const affectedContacts = contacts
      .filter(a => {
        if (!a.areaRef) {
          return false;
        }

        return a.areaRef === areaRef;
      })
      .map(({ areaRef: _, ...rest }) => rest)
      .map(({ key, ...rest }) => database.ref(`/contacts/${key}`).set(rest));

    if (affectedContacts.length === 0) {
      resolve(area.key);
    }

    try {
      await Promise.all(affectedContacts);
      resolve(area.key);
    } catch (error) {
      reject({
        code: 500,
        status: 'error',
        error
      });
    }
  });
};

const deleteArea = (database: admin.database.Database, key: string) => {
  return new Promise(async (resolve, reject) => {
    const ref = database.ref(`/areas/${key}`);

    try {
      await ref.remove();
      resolve({
        code: 200,
        status: 'success',
        message: `Area with key: ${key} Deleted`
      });
    } catch (e) {
      reject({
        code: 500,
        status: 'error',
        error: e
      });
    }
  });
};

export default (
  req: functions.Request,
  res: functions.Response,
  database: admin.database.Database
) => {
  validateRequest(req)
    .then(() => getData(database))
    .then(data => unassignContacts(database, data, req.query.key))
    .then(key => deleteArea(database, key))
    .then(({ code, ...rest }) => {
      res.status(code).send(rest);
    })
    .catch(({ code, ...rest }) => {
      res.status(code).send(rest);
    });
};
