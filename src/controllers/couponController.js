import Coupon from "../models/couponModel.js";

// Create coupon
 export const createCoupon = async (req, res) => {
  try {
    const { code, discount, validTill } = req.body;

    if (!code || !discount || !validTill) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Coupon.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discount,
      validTill,
    });

    res.status(201).json({ message: "Coupon created", coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all coupons
 export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete coupon
 export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    await Coupon.findByIdAndDelete(id);
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
