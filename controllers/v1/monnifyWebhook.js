const webhook = (req, res) => {
  try {
    const data = req.body;

    // Verify webhook signature
    const monnifySignature = req.headers["monnify-signature"];
    const calculatedSignature = crypto
      .createHmac("sha512", secretKey)
      .update(JSON.stringify(data))
      .digest("hex");

    if (calculatedSignature !== monnifySignature) {
      return res.status(400).json({ message: "Invalid signature." });
    }

    // Process payment status
    const { paymentReference, paymentStatus } = data;
    if (paymentStatus === "PAID") {
      console.log(`Payment successful for reference: ${paymentReference}`);
      return res.status(200).json({
        message: `Payment successful for reference: ${paymentReference}`,
      });
      // Update your database to mark the payment as successful
    } else {
      console.log(`Payment failed for reference: ${paymentReference}`);
      res
        .status(400)
        .json({ message: `Payment failed for reference: ${paymentReference}` });
    }

    return res.status(200).json({ message: "Webhook processed successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports=webhook
