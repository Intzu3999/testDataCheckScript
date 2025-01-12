const { getAccessToken } = require('./auth');
const axios = require("axios");
require('dotenv').config();

const BASE_URL = process.env.MOLI_BASE_URL;

const subscriberStatus = async (msisdn, telco, id) => {
  const results = { msisdn , telco, id };

  let token;
  try {
    token = await getAccessToken(); 
  } catch (error) {
    console.error("❌ Failed to fetch token:", error.message);
    return results; 
  }

  // GET subscriber
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

  return results;
};

module.exports = { subscriberStatus }; 