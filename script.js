const axios = require("axios");
const fs = require("fs").promises;
const { readMsisdnListTxt, readMsisdnListCsv } = require('./readMsisdnList');
const csv = require('csv-parser');
require('dotenv').config();

// What is needed
// getSubscriber: SUCCESS
// getFamilyGroup: FAILED

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

// Fetch Status
const fetchStatus = async (msisdn) => {
const results = { msisdn };

try {
    // Call getSubscriber API
    const subscriberResponse = await axios.get(`${BASE_URL}/v1/subscriber`, {
      params: { msisdn, telco},
      headers: HEADERS_DEFAULT,
    });
    results.getSubscriber = subscriberResponse.status === 200 ? "SUCCESS" : "FAILED";
  } catch (error) {
    results.getSubscriber = "FAILED";
  }

  try {
    // Call getFamilyGroup API
    const familyGroupResponse = await axios.get(`${BASE_URL}/v1/getFamilyGroup`, {
      params: { msisdn },
      headers: HEADERS_DEFAULT,
    });
    results.getFamilyGroup = familyGroupResponse.status === 200 ? "SUCCESS" : "FAILED";
  } catch (error) {
    results.getFamilyGroup = "FAILED";
  }

  return results;
};
