const { getAccessToken } = require('./auth');
const axios = require("axios");
require('dotenv').config();

const BASE_URL = process.env.MOLI_BASE_URL;
const ACCOUNT_BASE_URL = process.env.ACCOUNT_BASE_URL;

const fetchApiStatus = async (msisdn, telco, id) => {
  const results = { msisdn , telco, id};

  let token;
  try {
    token = await getAccessToken(); 
  } catch (error) {
    console.error("❌ Failed to fetch token:", error.message);
    results.getCustomerResponse = "❌ Token Error";
    results.getSubscriber = "❌ Token Error";
    results.getFamilyGroup = "❌ Token Error";
    return results; 
  }

// getValidateSIM API Call
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

  const simStatus = ValidateSIMResponse.data.status; // Extract the 'status' field
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

  // getCustomer API Call
  try {
    const getCustomerParams = new URLSearchParams({ msisdn });
    const getCustomerURL = `${BASE_URL}/moli-customer/v3/customer?${getCustomerParams.toString()}`;    
    
    const getCustomer = await axios.get(getCustomerURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ getCustomer: ${getCustomer.status}`);
    results.getCustomer = `✅ ${getCustomer.status}`
  } catch (error) {
    const statusCode = error.response?.status || "Unknown Status";
    const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
    console.error(`❌ getCustomer: Status - ${statusCode}, Error - ${errorMessage}`);
    results.getCustomer = `❌ ${statusCode}`;
  }

  // getSubscriber API Call
  try {
    const subscriberParams = new URLSearchParams({ msisdn, telco });
    const subscriberURL = `${BASE_URL}/moli-subscriber/v1/subscriber?${subscriberParams.toString()}`;    
    
    const subscriberResponse = await axios.get(subscriberURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const customerType = subscriberResponse.data.characteristic.customerInfo[0]?.type?.text; 
    const subscriberType = subscriberResponse.data.characteristic.subscriberInfo.subscriberType[0]?.text; 
    const telecomType = subscriberResponse.data.characteristic.subscriberInfo.telecomType[0]?.text; 

    console.log(`✅ getSubscriber: ${subscriberResponse.status}, customerType: ${customerType}, subscriberType: ${subscriberType}, telecomType: ${telecomType}`);

    results.getSubscriber = {
      httpStatus: `✅ ${subscriberResponse.status}`,
      customerType: customerType || "Null", 
      subscriberType: subscriberType || "Null", 
      telecomType: telecomType || "Null", 
    };

    // console.log(`✅ getSubscriber: ${subscriberResponse.status}`);
    // results.getSubscriber = `✅ ${subscriberResponse.status}`
  } catch (error) {
    const statusCode = error.response?.status || "Unknown Status";
    const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
    console.error(`❌ getSubscriber: Status - ${statusCode}, Error - ${errorMessage}`);
    results.getSubscriber = `❌ ${statusCode}`;
  }
  
  // getFamilyGroup API Call
  try {     
    const familyGroupURL = `${ACCOUNT_BASE_URL}/v1/family-group/${msisdn}`;
    
    const familyGroupResponse = await axios.get(familyGroupURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
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

module.exports = { fetchApiStatus };