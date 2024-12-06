const fs = require('fs').promises;
const fsStream = require('fs');
const csv = require('csv-parser');

const readMsisdnListTxt = async (filePath) => {
    const data = await fs.readFile(filePath, "utf-8");
    return data.split("\n").map((line) => line.trim());
  };

const readMsisdnListCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fsStream.createReadStream(filePath)
      .pipe(csv()) 
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

module.exports = { readMsisdnListTxt, readMsisdnListCsv };