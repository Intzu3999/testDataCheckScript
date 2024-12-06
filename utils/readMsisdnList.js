const fs = require('fs').promises;
const fsStream = require('fs');
const csv = require('csv-parser');

// console.log("Reading .csv ...");

const readMsisdnListTxt = async (filePath) => {
    const data = await fs.readFile(filePath, "utf-8");
    return data.split("\n").map((line) => line.trim());
  };

// Test if able to open and read the .txt file
// (async () => {
//     const msisdnList = await readMsisdnListTxt("./pnl_msisdn_celcom.txt");
//     console.log("msisdn list: " , msisdnList); 
//   })();  

// console.log("Reading .csv ...");

const readMsisdnListCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fsStream.createReadStream(filePath)
      .pipe(csv()) // Process rows in CSV
      .on('data', (data) => {
        results.push(data); // Add each row as an object
      })
      .on('end', () => {
        // console.log("CSV List:", results);
        resolve(results); // Resolve the promise with the results array
      })
      .on('error', (err) => {
        console.error("Error reading the file:", err); 
        reject(err); // Reject the promise on error
      });
  });
};

// Test if able to open and read the .csv file
// readMsisdnListCsv('../testData/pnl_msisdn.csv');  

module.exports = { readMsisdnListTxt, readMsisdnListCsv };