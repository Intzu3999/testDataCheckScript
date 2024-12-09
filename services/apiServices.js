const axios = require("axios");
require('dotenv').config();

const BASE_URL = process.env.MOLI_BASE_URL;
const ACCOUNT_BASE_URL = process.env.ACCOUNT_BASE_URL;
const AUTH_TOKEN_URL = process.env.AUTH_TOKEN_URL;
const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;

let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
let ACCESS_TOKEN_EXPIRY_TIME = process.env.ACCESS_TOKEN_EXPIRY_TIME;
  
  const getAccessToken = async () => {
    const currentTime = new Date().getTime();
    if (ACCESS_TOKEN && currentTime < ACCESS_TOKEN_EXPIRY_TIME) {
      return ACCESS_TOKEN; 
    }
  
    try {
      const response = await axios.post(AUTH_TOKEN_URL, null, {
        params: {
          grant_type: "client_credentials",
          client_id: AUTH_CLIENT_ID,
          client_secret: AUTH_CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "*/*",
        },
      });
      ACCESS_TOKEN = response.data.access_token;
      ACCESS_TOKEN_EXPIRY_TIME = currentTime + response.data.expires_in * 1000;
      process.env.ACCESS_TOKEN = ACCESS_TOKEN;
      process.env.ACCESS_TOKEN_EXPIRY_TIME = ACCESS_TOKEN_EXPIRY_TIME;
      return ACCESS_TOKEN;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw new Error("Failed to get access token");
    }
  };

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

  // getCustomer API Call
  try {
    const getCustomerParams = new URLSearchParams({ msisdn });
    const getCustomerURL = `${BASE_URL}/moli-customer/v3/customer?${getCustomerParams.toString()}`;    
    const getCustomerResponse = await axios.get(getCustomerURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(`✅ getCustomer: ${getCustomerResponse.status}`);
    results.getCustomerResponse = `✅ ${getCustomerResponse.status}`
  } catch (error) {
    const statusCode = error.response?.status || "Unknown Status";
    const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
    console.error(`❌ getCustomerResponse: Status - ${statusCode}, Error - ${errorMessage}`);
    results.getCustomerResponse = `❌ ${statusCode}`;
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
    console.log(`✅ getSubscriber: ${subscriberResponse.status}`);
    results.getSubscriber = `✅ ${subscriberResponse.status}`
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