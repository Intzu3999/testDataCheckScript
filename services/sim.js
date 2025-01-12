const { getAccessToken } = require('./auth');
const axios = require("axios");
require('dotenv').config();

const BASE_URL = process.env.MOLI_BASE_URL;

const simStatus = async (msisdn, telco, id) => {
  const results = { msisdn , telco, id };

  let token;
  try {
    token = await getAccessToken(); 
  } catch (error) {
    console.error("❌ Failed to fetch token:", error.message);
    return results; 
  }

  //GET SIM Validation v2
  try {
    const iccid = "896019210635472956";
    const storeId = "S0001940641";
    const ValidateSIMParams = new URLSearchParams({ msisdn, telco, iccid, storeId });
    const ValidateSIMURL = `${BASE_URL}/moli-sim/v2/sim/validation?${ValidateSIMParams.toString()}`;
      
    const ValidateSIMResponse = await axios.get(ValidateSIMURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const simStatus = ValidateSIMResponse.data.status;
    console.log(`✅ ValidateSIM: ${ValidateSIMResponse.status}, simStatus: ${simStatus}`);

    results.ValidateSIM = {
      httpStatus: `✅ ${ValidateSIMResponse.status}`,
      simStatus: simStatus, 
    };
  } catch (error) {
    const statusCode = error.response?.status || "Unknown Status";
    const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
    console.error(`❌ ValidateSIM: Status - ${statusCode}, Error - ${errorMessage}`);

    results.ValidateSIM = {
      httpStatus: `❌ ${statusCode}`,
      simStatus: "Unknown",
    };
  }

  return results;
};

module.exports = { simStatus };