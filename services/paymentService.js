const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Payment Order
const createOrder = async (amount) => {
  try {
    const options = {
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    return order;
  } catch (error) {
    console.error("Payment Error:", error.message);
    throw error;
  }
};

module.exports = { createOrder };