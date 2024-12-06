const axios = require("axios");
require('dotenv').config();

const BASE_URL = process.env.MOLI_BASE_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_EXPIRY_TIME = process.env.ACCESS_TOKEN_EXPIRY_TIME;
const AUTH_TOKEN_URL = process.env.AUTH_TOKEN_URL;
const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
console.log("MOLI_BASE_URL: ", process.env.MOLI_BASE_URL); //Checking

const HEADERS_DEFAULT = {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`, 
    "Content-Type": "application/json",
    "Accept": "*/*",
    "User-Agent": "",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
  };





  
const fetchStatus = async (msisdn, telco) => {
const results = { msisdn , telco};

try {
    const subscriberResponse = await axios.get(`${BASE_URL}/v1/subscriber`, {
      params: { msisdn, telco},
      headers: HEADERS_DEFAULT,
    });
    results.getSubscriber = subscriberResponse.status === 200 ? "SUCCESS" : "FAILED";
    if (results.getSubscriber === "SUCCESS") {
      console.log(`✅ SUCCESS: getSubscriber ${msisdn} ${telco}`);
    } else {
      console.log(`❌ FAILED: getSubscriber ${msisdn} ${telco}`);
    }
  } catch (error) {
    console.log(`❌ FAILED : getSubscriber ${msisdn} ${telco}`);
    results.getSubscriber = "FAILED";
  }

  try {
    const familyGroupResponse = await axios.get(`${BASE_URL}/v1/getFamilyGroup`, {
      params: { msisdn },
      headers: HEADERS_DEFAULT,
    });
    results.getFamilyGroup = familyGroupResponse.status === 200 ? "SUCCESS" : "FAILED";
    if (results.getFamilyGroup === "SUCCESS") {
      console.log(`✅ SUCCESS: getFamilyGroup ${msisdn} ${telco}`);
    } else {
      console.log(`❌ FAILED: getFamilyGroup ${msisdn} ${telco}`);
    }
  } catch (error) {
    console.log(`❌ FAILED : getFamilyGroup ${msisdn} ${telco}`);
    results.getFamilyGroup = "FAILED";
  }

  return results;
};

module.exports = { fetchStatus };