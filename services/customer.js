const { getAccessToken } = require('./auth');
const axios = require("axios");
require('dotenv').config();

const BASE_URL = process.env.MOLI_BASE_URL;

const customerStatus = async (msisdn) => {
  const results = { msisdn };

  let token;
  try {
    token = await getAccessToken(); 
  } catch (error) {
    console.error("❌ Failed to fetch token:", error.message);
    return results; 
  }

  // GET Customer v3
  try {
    const getCustomerParams = new URLSearchParams({ msisdn });
    const getCustomerURL = `${BASE_URL}/moli-customer/v3/customer?${getCustomerParams.toString()}`;    
    
    const getCustomerResponse = await axios.get(getCustomerURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // console.log('🛠️ getCustomer Payload:', getCustomerResponse?.data);
    const customerId = getCustomerResponse?.data?.[0]?.personalInfo?.[0]?.identification?.[0]?.idNo || 'N/A';
    console.log(`✅ getCustomer: ${getCustomerResponse.status} customerId:${customerId}`);

    results.getCustomer = {
      httpStatus: `✅ ${getCustomerResponse.status}`,
      customerId: (customerId || "Null"),
    };

  } catch (error) {
    const statusCode = error.response?.status || "Unknown Status";
    const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
    console.error(`❌ getCustomer: Status - ${statusCode}, Error - ${errorMessage}`);
    results.getCustomer = `❌ ${statusCode}`;
  }

  return results;
};

module.exports = { customerStatus };