import mongoose from "mongoose";

const crmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // confirmPassword is intentionally NOT stored in the database.
    // It's only used for controller-side validation during registration.
    status: {
      type: String,
      enum: ["Active", "Suspended"],
      default: "Active",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CRM = mongoose.model("CRM", crmSchema);
export default CRM;
