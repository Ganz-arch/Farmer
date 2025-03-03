const initializePayment = require("../../utils/monnify");

const initiatePayment = async (req, res) => {
  try {
    const user = req.user
    const { amount, customerEmail, customerName, description } = req.body;
    if (typeof amount!=='number'){
        return res.status(400).json({message:'Amount must be a number'})
    }
    if (typeof customerEmail!==user.email){
        return res.status(404).json({message:'Customer email does not exist'})
    }
    if (typeof customerName!==user.fullName){
        return res.status(400).json({message:'Customer Name is incorrect'})
    }
    if (typeof description!=='string'){
        return res.status(400).json({message:'Description must be a string'})
    }
    const paymentData = await initializePayment(
      amount,
      customerEmail,
      customerName,
      description
    );
    return res.status(200).json({
      message: "Payment initialized successfully.",
      paymentLink: paymentData.checkoutUrl, // Monnify payment link
      paymentReference: paymentData.paymentReference,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to initialize payment." });
  }
};

module.exports = initiatePayment