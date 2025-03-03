const config = require('../config/config')
const axios = require("axios");

async function getAuthToken() {
    try {
    const authHeader = Buffer.from(`${config.monnify.apiKey}:${config.monnify.secretKey}`).toString("base64");
  
    
      const response = await axios.post(
        `${config.monnify.baseUrl}/auth/login`,
        {},
        {
          headers: {
            Authorization: `Basic ${authHeader}`,
          },
        }
      );
      return response.data.responseBody.accessToken;
    } catch (error) {
      console.error(
        "Error getting auth token:",
        error.response?.data || error.message
      );
      throw new Error("Failed to authenticate with Monnify.");
    }
  }
  
  //Initialize a payment request//
  async function initializePayment(
    amount,
    customerEmail,
    customerName,
    paymentDescription
  ) {
    const authToken = await getAuthToken();
  
    const payload = {
      amount: amount,
      customerName: customerName,
      customerEmail: customerEmail,
      paymentReference: `REF_${Date.now()}`, // Unique reference
      paymentDescription: paymentDescription,
      currencyCode: "NGN",
      contractCode: config.monnify.contractCode,
      redirectUrl: "http://localhost/3338", // Replace with your frontend URL
    };
  
    try {
      const response = await axios.post(
        `${config.monnify.baseUrl}/merchant/transactions/init-transaction`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data.responseBody;
    } catch (error) {
      console.error(
        "Error initializing payment:",
        error.response?.data || error.message
      );
      throw new Error("Failed to initialize payment.");
    }
  }
  
  module.exports =  initializePayment ;
  