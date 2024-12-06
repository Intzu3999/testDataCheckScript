// const { readMsisdnListCsv } = require('./utils/readMsisdnList');
const { fetchStatus } = require('./services/apiServices');
const fs = require('fs').promises;
const fsStream = require('fs');
const csv = require('csv-parser');

const readMsisdnListCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fsStream.createReadStream(filePath)
      .pipe(csv()) // Process rows in CSV
      .on('data', (data) => {
        results.push(data); // Add each row as an object
      })
      .on('end', () => {
        resolve(results); // Resolve the promise with the results array
      })
      .on('error', (err) => {
        console.error("Error reading the file:", err); 
        reject(err); // Reject the promise on error
      });
  });
}; 

msisdnfilename = "pnl_msisdn.csv";
const INPUT_FILE = `./testData/${msisdnfilename}`;
const OUTPUT_FILE = "./testData/results.json";

const run = async () => {
  try {
    const msisdnList = await readMsisdnListCsv(INPUT_FILE);
    const results = [];
    
    for (const msisdn of msisdnList) { 
      console.log(`Processing MSISDN: ${msisdn.msisdn}`);  // Log the msisdn value
      const result = await fetchStatus(msisdn.msisdn, msisdn.telco); // Use specific properties
      results.push(result);
    }

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`Validation completed. Results saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error during execution:", error.message);
  }
};

run();