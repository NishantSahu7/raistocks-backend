import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  throw new Error("Razorpay key_id or key_secret is not defined in .env file");
}

const instance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export default instance;
