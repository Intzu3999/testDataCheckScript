const { getAccessToken } = require('./auth');
const axios = require("axios");
require('dotenv').config();

const BASE_URL = process.env.MOLI_BASE_URL;
const ACCOUNT_BASE_URL = process.env.ACCOUNT_BASE_URL;

const fetchAccountStatus = async (msisdn, id) => {
  const results = { msisdn, id };

  let token;
  try {
    token = await getAccessToken(); 
  } catch (error) {
    console.error("❌ Failed to fetch token:", error.message);
    return results; 
  }

  // GET accountStructure
  try {     
    const accountStructureURL = `${ACCOUNT_BASE_URL}/moli-account/v1/family-group/${msisdn}`;
    const accountStructureResponse = await axios.get(accountStructureURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // console.log('🛠️ accountStructure Payload:', accountStructureResponse?.data);
    console.log(`✅ accountStructure: ${accountStructureResponse.status}`);
    results.accountStructure = `✅ ${accountStructureResponse.status}`;

  } catch (error) {
    const statusCode = error.response?.status || "Unknown Status";
    const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
    console.error(`❌ accountStructure: Status - ${statusCode}, Error - ${errorMessage}`);
    results.accountStructure = `❌ ${statusCode}`;
  }

  
  // GET accountStructure -WithID
  try {     
    const level = "customer";
    const idType = "NRIC";
    const idNumber = id;
    const accountStructureParams = new URLSearchParams({ level, idType, msisdn, idNumber });
    const accountStructureURL = `${BASE_URL}/moli-account/v2/accounts/structure?${accountStructureParams.toString()}`;

    const accountStructureResponse = await axios.get(accountStructureURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // console.log('🛠️ accountStructure Payload:', accountStructureResponse?.data);
    console.log(`✅ accountStructureID: ${accountStructureResponse.status}`);
    results.accountStructure = `✅ ${accountStructureResponse.status}`;

  } catch (error) {
    const statusCode = error.response?.status || "Unknown Status";
    const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
    console.error(`❌ accountStructureID: Status - ${statusCode}, Error - ${errorMessage}`);
    results.accountStructure = `❌ ${statusCode}`;
  }

  // GET FamilyGroup
  try {     
    const familyGroupURL = `${ACCOUNT_BASE_URL}/v1/family-group/${msisdn}`;
    
    const familyGroupResponse = await axios.get(familyGroupURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    // console.log('🛠️ FamilyGroup Payload:', familyGroupResponse?.data);
    console.log(`✅ getFamilyGroup: ${familyGroupResponse.status}`);
    results.getFamilyGroup = `✅ ${familyGroupResponse.status}`;
  } catch (error) {
    const statusCode = error.response?.status || "Unknown Status";
    const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
    console.error(`❌ getFamilyGroup: Status - ${statusCode}, Error - ${errorMessage}`);
    results.getFamilyGroup = `❌ ${statusCode}`;
  }  

  return results;
};

module.exports = { fetchAccountStatus };