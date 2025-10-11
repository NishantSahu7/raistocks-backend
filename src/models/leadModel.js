import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, "Contact information is required"],
      trim: true,
    },
    email:{
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    source: {
      type: String,
      required: [true, "Source is required"],
    },
    status: {
      type: String,
      default: "New Lead",
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);



const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
