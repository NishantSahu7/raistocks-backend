import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_RSGvunsLRliNuj",
  key_secret: "xWxjp2ZTG37foMV07usEELCA",
});

(async () => {
  try {
    const order = await razorpay.orders.create({
      amount: 100,  // minimal amount, 1 INR → 100 paise
      currency: "INR",
    });
    console.log("Order created:", order);
  } catch (err) {
    console.error("Razorpay Error:", err);
  }
})();
