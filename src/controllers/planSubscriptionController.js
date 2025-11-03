import planSubscription from "../models/planSubscription.js";

// ✅ Create a new subscription (single)
export const createPlanSubscription = async (req, res) => {
  try {
    const newPlan = new planSubscription(req.body);
    await newPlan.save();
    res.status(201).json({
      success: true,
      message: "Subscription plan created successfully",
      data: newPlan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all subscription plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await planSubscription.find();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlanSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await planSubscription.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    await plan.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscription plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update a subscription plan
export const updatePlanSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if plan exists
    const existingPlan = await planSubscription.findById(id);
    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    // Update with new data
    const updatedPlan = await planSubscription.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // ensures we get updated document back
    );

    res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
