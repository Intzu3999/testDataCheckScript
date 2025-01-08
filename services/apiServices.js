const { getAccessToken } = require('./auth');
const axios = require("axios");
require('dotenv').config();

const BASE_URL = process.env.MOLI_BASE_URL;
const ACCOUNT_BASE_URL = process.env.ACCOUNT_BASE_URL;

const fetchApiStatus = async (msisdn, telco, id) => {
  const results = { msisdn , telco, id };

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

    // console.log('🛠️ getCustomer Payload:', getCustomerResponse?.data);
    const customerId = getCustomerResponse?.data?.[0]?.personalInfo?.[0]?.identification?.[0]?.idNo || 'N/A';
    console.log(`✅ getCustomer: ${getCustomerResponse.status} ID:${customerId}`);

    results.getCustomer = {
      httpStatus: `✅ ${getCustomerResponse.status}`,
      ID: (customerId || "Null"),
    };

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

    // console.log('🛠️ getSubscriber Payload:', subscriberResponse?.data);
    const subscriberTelco = subscriberResponse.data.telco;
    const payType = subscriberResponse.data.type;  
    const isPrincipal = subscriberResponse.data.isPrincipal; 
    const status = subscriberResponse.data.status; 
    const subscriptionName = subscriberResponse?.data?.subscriptions?.primary?.[0]?.name || 'N/A';
    const customerType = subscriberResponse.data.characteristic.customerInfo[0]?.type?.text; 
    const subscriberType = subscriberResponse.data.characteristic.subscriberInfo.subscriberType[0]?.text; 
    const telecomType = subscriberResponse.data.characteristic.subscriberInfo.telecomType[0]?.text; 

    console.log(`✅ getSubscriber: ${subscriberResponse.status} ${subscriberTelco} ${payType} isPrincipal:${isPrincipal} ${status}`); //, customerType:${customerType}, subsriberType:${subscriberType}, teleType:${telecomType}

    results.getSubscriber = {
      httpStatus: `✅ ${subscriberResponse.status}`,
      telco: subscriberTelco || "Null",
      payType: payType || "Null",  
      isPrincipal: isPrincipal || "Null", 
      status: status || "Null", 
      subscriptionName: subscriptionName || "Null",
      customerType: customerType || "Null", 
      subscriberType: subscriberType || "Null", 
      telecomType: telecomType || "Null", 
    };

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

  // getValidateSIM API Call
  // try {
  //   const iccid = "896019210635472956";
  //   const storeId = "S0001940641";
  //   const ValidateSIMParams = new URLSearchParams({ msisdn, telco, iccid, storeId });
  //   const ValidateSIMURL = `${BASE_URL}/moli-sim/v2/sim/validation?${ValidateSIMParams.toString()}`;
      
  //   const ValidateSIMResponse = await axios.get(ValidateSIMURL, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   const simStatus = ValidateSIMResponse.data.status; // Extract the 'status' field
  //   console.log(`✅ ValidateSIM: ${ValidateSIMResponse.status}, simStatus: ${simStatus}`);

  //   results.ValidateSIM = {
  //     httpStatus: `✅ ${ValidateSIMResponse.status}`,
  //     simStatus: simStatus, 
  //   };
  // } catch (error) {
  //   const statusCode = error.response?.status || "Unknown Status";
  //   const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
  //   console.error(`❌ ValidateSIM: Status - ${statusCode}, Error - ${errorMessage}`);

  //   results.ValidateSIM = {
  //     httpStatus: `❌ ${statusCode}`,
  //     simStatus: "Unknown",
  //   };
  // }

  return results;
};

module.exports = { fetchApiStatus };