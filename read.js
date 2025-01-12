const { accountStatus } = require('./services/account.js');
const { customerStatus } = require('./services/customer.js');
const { simStatus } = require('./services/sim.js');
const { subscriberStatus } = require('./services/subscriber.js');
const { allStatus } = require('./services/allServices.js');

const fs = require('fs').promises;
const fsStream = require('fs');
const csv = require("csv-parser");

const services = {
  accountStatus,
  customerStatus,
  simStatus,
  subscriberStatus,
  allStatus,
};

const csvFileName = process.argv[2] || 'temp'; //.csv file name from ./testData folder that contains list of msisdn to check
const runAPI = process.argv[3] || 'fetchSubscriberStatus'; //API services to check: allStatus, accountStatus, customerStatus, simStatus, subscriberStatus, etc

const INPUT_FILE = `./testData/${csvFileName}.csv`;
const OUTPUT_FILE = `./result/results_${csvFileName}.json`;

const readCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fsStream.createReadStream(filePath)
      .pipe(csv()) // Process rows in CSV
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => {
        console.error("Error reading the file:", err); 
        reject(err); 
      });
  });
}; 

const processCsv = () => {
};

const tabulateCsv = () => {
};

const emailCsv = () => {
};

const execute = async () => {
  try {
    const msisdnList = await readCsv(INPUT_FILE);
    const results = [];
    
    for (const entry of msisdnList) { 
      const { msisdn, telco, id } = entry;
      console.log("");
      console.log(`Processing: ${telco} ${msisdn}`);  
      const result = await services[runAPI](msisdn, telco, id); 
      results.push(result);
    }

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`Validation completed. Results saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error during execution:", error.message);
  }
};
execute();