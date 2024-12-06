const { readMsisdnListTxt, readMsisdnListCsv } = require('./utils/readMsisdnList');
const { fetchStatus } = require('./services/apiService');

const main = async () => {
    const INPUT_FILE = "msisdn_list.txt";
    const OUTPUT_FILE = "results.json";
  
    try {
      const msisdnList = await readMsisdnListCsv(INPUT_FILE);
      const results = [];
  
      for (const msisdn of msisdnList) {
        console.log(`Processing MSISDN: ${msisdn}`);
        const result = await fetchStatus(msisdn);
        results.push(result);
      }
  
      await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));
      console.log(`Validation completed. Results saved to ${OUTPUT_FILE}`);
    } catch (error) {
      console.error("Error during execution:", error.message);
    }
  };
  
  main();