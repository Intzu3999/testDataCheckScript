const { fetchStatus } = require('./services/apiServices');
const fs = require('fs').promises;
const fsStream = require('fs');
const csv = require("csv-parser");

const msisdnfilename = process.argv[2] || 'eSIMNewLine';
// const msisdnfilename = "eSIMNewLine"; //hardcoded method
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
      console.log(`Processing: ${msisdn} ${telco}`);  
      const result = await fetchStatus(msisdn, telco); 
      console.log(result);
      results.push(result);
    }

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`Validation completed. Results saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error during execution:", error.message);
  }
};

run();
