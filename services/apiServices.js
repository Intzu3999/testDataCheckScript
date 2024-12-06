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

const fetchStatus = async (msisdn, telco) => {
  const results = { msisdn , telco};

  try {
    const token = await getAccessToken();
    
    // Construct the full URL for getSubscriber
    const subscriberParams = new URLSearchParams({ msisdn, telco });
    const subscriberURL = `${BASE_URL}/moli-subscriber/v1/subscriber?${subscriberParams.toString()}`;
    console.log("getSubscriber Full URL: ", subscriberURL);
    
    const subscriberResponse = await axios.get(subscriberURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
      },
    });

    console.log("✅ Subscriber Response: ", subscriberResponse.data);
    results.getSubscriber = subscriberResponse.status === 200 ? "✅ SUCCESS" : "❌ FAILED";
    } catch (error) {
      console.error("❌ getSubscriber Error: ", error.response?.data || error.message);
      results.getSubscriber = "❌ FAILED";
    }


    try {     
      // Construct the full URL for getFamilyGroup
      const familyGroupURL = `${ACCOUNT_BASE_URL}/v1/family-group/${msisdn}`;
      console.log("getFamilyGroup Full URL: ", familyGroupURL);

      const familyGroupResponse = await axios.get(familyGroupURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Connection": "keep-alive",
        },
      });

      console.log("✅ Family Group Response: ", familyGroupResponse.data);
      results.getFamilyGroup = familyGroupResponse.status === 200 ? "✅ SUCCESS" : "❌ FAILED";
    } catch (error) {
      console.error("❌ getFamilyGroup Error: ", error.response?.data || error.message);
      results.getFamilyGroup = "❌ FAILED";
    }

    return results;
};

module.exports = { fetchStatus };