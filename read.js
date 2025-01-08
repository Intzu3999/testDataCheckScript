const { fetchAccountStatus } = require('./services/account.js');
const { fetchCustomerStatus } = require('./services/customer.js');
const { fetchSimStatus } = require('./services/sim.js');
const { fetchSubscriberStatus } = require('./services/subscriber.js');

const fs = require('fs').promises;
const fsStream = require('fs');
const csv = require("csv-parser");

const msisdnfilename = process.argv[2] || 'eSIMNewLine';
// const msisdnfilename = "eSIMNewLine"; //hardcoded method. Uncomment to use.
const INPUT_FILE = `./testData/${msisdnfilename}.csv`;
const OUTPUT_FILE = `./result/results_${msisdnfilename}.json`;

const readMsisdnListCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fsStream.createReadStream(filePath)
      .pipe(csv()) // Process rows in CSV
      .on('data', (data) => {
        results.push(data); 
      })
      .on('end', () => {
        resolve(results);  
      })
      .on('error', (err) => {
        console.error("Error reading the file:", err); 
        reject(err); 
      });
  });
}; 

const run = async () => {
  try {
    const msisdnList = await readMsisdnListCsv(INPUT_FILE);
    const results = [];
    
    for (const entry of msisdnList) { 
      const msisdn = entry.msisdn;
      const telco = entry.telco;
      const id = entry.id;
      console.log("");
      console.log(`Processing: ${telco} ${msisdn}`);  
      const result = await fetchSimStatus(msisdn, telco, id); 
      results.push(result);
    }

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`Validation completed. Results saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error during execution:", error.message);
  }
};

run();
