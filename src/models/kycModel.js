import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  full_name: String,
  email: String,
  aadhaar_phone: String,
  whatsapp_phone: String,
  gender: String,
  dob: String,
  aadhaar_number: String,
  pan_number: String,
  occupation: String,
  others_please_specify: String,
  annual_income: String,
  marital_status: String,
  father_spouse_name: String,
  address: String,
  city_district: String,
  state: String,
  pincode: String,
  investment_objective: String,
  investment_horizon: String,
  risk_tolerance: String,
  past_investment_experience: [String],
  investment_experience: String,
  risk_aversion: String,

  // Cloudinary file URLs
  aadhaar_front_url: String,
  aadhaar_back_url: String,
  pan_image_url: String,
  your_photo_url: String,
  your_signature_url: String,
  agreement_url: String,

  full_terms_and_conditions: Boolean,
  aadhaar_pan_consent: Boolean,
}, { timestamps: true });

export default mongoose.model("Kyc", kycSchema);
