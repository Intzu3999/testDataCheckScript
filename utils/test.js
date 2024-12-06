const { readMsisdnListTxt , readMsisdnListCsv } = require('./readMsisdnList');

msisdnfilename = "pnl_msisdn.csv";
const INPUT_FILE = `../testData/${msisdnfilename}`;
const OUTPUT_FILE = "../testData/results.json";

// (async () => {
//     try {
//       const msisdnList = await readMsisdnListTxt(INPUT_FILE);
//       console.log("MSISDN list:", msisdnList);
  
//       // Print each MSISDN in the list
//       msisdnList.forEach((msisdn, index) => {
//         console.log(`Test MSISDN ${index + 1}: ${msisdn}`);
//       });
//     } catch (error) {
//       console.error("Error reading the file:", error.message);
//     }
//   })();

(async () => {
    try {
      const msisdnList = await readMsisdnListCsv(INPUT_FILE); // Ensure readMsisdnListCsv returns a promise
      msisdnList.forEach((entry) => {
        console.log(`${entry.msisdn}, ${entry.telco}`); // Assuming each entry has a "msisdn" property
      });
    } catch (error) {
      console.error("Error reading the file:", error.message);
    }
  })();