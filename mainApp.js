const { readMsisdnListCsv } = require('./utils/readMsisdnList');
const { fetchStatus } = require('./services/apiServices');
const fs = require('fs').promises;

// (async () => {
//   const result = await fetchStatus('60100025891', 'CELCOM');
//   console.log(result);
// })();

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