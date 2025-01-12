const { accountStatus } = require('./services/account.js');
const { customerStatus } = require('./services/customer.js');
const { simStatus } = require('./services/sim.js');
const { subscriberStatus } = require('./services/subscriber.js');
const { allStatus } = require('./services/allServices.js');

const fs = require('fs').promises;
const fsStream = require('fs');
const csv = require("csv-parser");

const testDataFileName = process.argv[2] || 'temp'; //.csv file name from ./testData folder that contains list of msisdn to check
const runService = process.argv[3] || 'subscriberStatus'; //API services to check: allStatus, accountStatus, customerStatus, simStatus, subscriberStatus, etc

//url of testDataFilePath, declared in argv [2]
const INPUT_FILE = `./testData/${testDataFileName}.csv`;
const OUTPUT_FILE = `./result/results_${testDataFileName}.json`;

//runService, declared in argv [3]
const serviceList = {
  accountStatus,
  customerStatus,
  simStatus,
  subscriberStatus,
  allStatus,
};

/**
 * Reads a CSV file and parses its content into an array of objects.
 * @param {string} testDataFilePath - The path to the CSV file.
 * @returns {Promise<Array<Object>>} Parsed CSV data.
 */
const readCsv = (testDataFilePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fsStream.createReadStream(testDataFilePath)
      .pipe(csv()) // Process rows in CSV
      .on('data', (testData) => results.push(testData))
      .on('end', () => resolve(results))
      .on('error', (err) => {
        console.error("Error reading the file:", err); 
        reject(err); 
      });
  });
}; 

/**
 * Processes the parsed CSV data by calling the appropriate service for each entry.
 * @param {Array<Object>} testData - Parsed CSV data.
 * @param {string} runService - Takes the service function to call, from user input on terminal/argument, defaults to subscriberStatus.
 * @returns {Promise<Array<Object>>} Results of processing the data.
 */
const processCsv = async (testData, runService) => {
  const results = []; 
  for (const eachRows of testData) { 
    const { msisdn, telco, id } = eachRows;
    console.log("");
    console.log(`Processing: ${telco} ${msisdn}`); 
    try {
      const result = await serviceList[runService](msisdn, telco, id); 
      results.push(result);
    } catch (err) {
      console.error(`Error processing ${msisdn}: ${err.message}`);
      results.push({ msisdn, error: err.message });      
    }
  }
  return results;
};

/**
 * Tabulates JSON result into excel format.
 * This is a placeholder for the future implementation of data summarization.
 * @param {Array<Object>} testData - Processed test data.
 */
const tabulateCsv = (testData) => {
};

/**
 * Emails the results to mail listers.
 * This is a placeholder for the future implementation of email functionality.
 * @param {string} testDataFilePath - Path to the result file.
 */
const emailCsv = (testDataFilePath) => {
};

const execute = async () => {
  try {
    console.log(`Reading: ${INPUT_FILE}`);
    const testData = await readCsv(INPUT_FILE);

    console.log(`Processing with: ${runService}`);
    const results = await processCsv(testData, runService);

    console.log(`Saving results to: ${OUTPUT_FILE}`);
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));

    console.log("Tabulating results...");
    tabulateCsv(results);

    console.log("Emailing results...");
    emailCsv(OUTPUT_FILE);

    console.log("Execution completed successfully."); 
  } catch (error) {
    console.error("Error during execution:", error.message);
  }
};
execute();