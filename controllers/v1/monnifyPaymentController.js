// const initializePayment = require("../../utils/monnify");

// const initiatePayment = async (req, res) => {
//   try {
//     const user = req.user
//     const { amount, customerEmail, customerName, description } = req.body;
//     if (typeof amount!=='number'){
//         return res.status(400).json({message:'Amount must be a number'})
//     }
//     if (typeof customerEmail!==user.email){
//         return res.status(404).json({message:'Customer email does not exist'})
//     }
//     if (typeof customerName!==user.fullName){
//         return res.status(400).json({message:'Customer Name is incorrect'})
//     }
//     if (typeof description!=='string'){
//         return res.status(400).json({message:'Description must be a string'})
//     }
//     const paymentData = await initializePayment(
//       amount,
//       customerEmail,
//       customerName,
//       description
//     );
//     return res.status(200).json({
//       message: "Payment initialized successfully.",
//       paymentLink: paymentData.checkoutUrl, // Monnify payment link
//       paymentReference: paymentData.paymentReference,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ message: "Failed to initialize payment." });
//   }
// };

// module.exports = initiatePayment

const config = require("../../config/config");
const axios = require("axios");

const baseURL = config.monnify.baseURL;

let authToken = null;

// Authenticate and get token
async function authenticate() {
  const response = await axios.post(
    `${baseURL}/auth/login`,
    {},
    {
      auth: {
        username: config.monnify.apiKey,
        password: config.monnify.secretKey,
      },
    }
  );
  authToken = response.data.responseBody.accessToken;
}

// Create payment session
const createPayment = async (req, res) => {
  try {
    if (!authToken) await authenticate();

    const user = req.user;
    const { amount, customerName, customerEmail } = req.body;
    const ref = `txn_${Date.now()}`;

    const payload = {
      amount,
      customerName,
      customerEmail,
      paymentReference: ref,
      paymentDescription: "Test Payment",
      currencyCode: "NGN",
      contractCode: config.monnify.contractCode,
      redirectUrl: "http://localhost:3000/payment-status",
      paymentMethods: ['CARD', 'ACCOUNT_TRANSFER']
    };

    const response = await axios.post(
      `${baseURL}/merchant/transactions/init-transaction`,
      payload,
      {
        headers: {
          // Authorization: `Bearer ${authToken}`,
          Authorization: `Basic ${Buffer.from(
            `${config.monnify.apiKey}:${config.monnify.secretKey}`
          ).toString('base64')}`,
        },
        },
      
    );

    // Save to DB
    await Payment.create({
      userId:user.id,
      paymentReference,
      amount,
      customerName,
      customerEmail,
    })

    const monnifyResponse = response.data.responseBody
    res.json({monnifyResponse, checkoutUrl: monnifyRes.data.responseBody.checkoutUrl});
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    if (!authToken) await authenticate();

    const response = await axios.get(
      `${baseURL}/merchant/transactions/query?paymentReference=${req.params.paymentReference}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    res.json(response.data.responseBody);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Verification failed" });
  }
};

module.exports ={createPayment, verifyPayment}