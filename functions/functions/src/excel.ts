import * as XLSX from 'xlsx';
import * as mkdir from 'mkdirp';

import { formatFirebaseArray } from './util';

const parseData = database => {
  return new Promise(async resolve => {
    const [areaRes, contactsRes] = await Promise.all([
      database.ref('/areas').once('value'),
      database.ref('/contacts').once('value')
    ]);

    const areas = formatFirebaseArray(areaRes.val()).map(
      ({ key, leader, ...rest }: any) => ({
        key,
        leader,
        ...rest
      })
    );

    const contacts = formatFirebaseArray(contactsRes.val()).map((a: any) => {
      const { key, number, name, areaRef, ...rest } = a;

      const area: any = areas.find(b => b.key === areaRef);

      return {
        number,
        name,
        'area leader': area ? area.leader : '',
        ...rest
      };
    });

    resolve({ contacts, areas });
  });
};

const createWorkbook = ({ contacts, areas }) => {
  return new Promise(resolve => {
    /* create a new blank workbook */
    const workbook = XLSX.utils.book_new();

    /* make worksheets */
    const contactsSheet = XLSX.utils.json_to_sheet(contacts);
    const areasSheet = XLSX.utils.json_to_sheet(areas);

    /* Add the worksheet to the workbook */
    XLSX.utils.book_append_sheet(workbook, areasSheet, 'Areas');
    XLSX.utils.book_append_sheet(workbook, contactsSheet, 'Contacts');

    mkdir('/tmp/excel', () => {
      XLSX.writeFile(workbook, '/tmp/excel/out.xlsx');
      resolve('/tmp/excel/out.xlsx');
    });
  });
};

export default (_, response, database) => {
  parseData(database)
    .then(createWorkbook)
    .then((a: string) => {
      response.sendFile(a);
    })
    .catch(e => {
      throw new Error(e);
    });
};
