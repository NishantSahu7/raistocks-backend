import Kyc from "../models/kycModel.js";
import cloudinary from "../config/cloudinary.js";

export const createKyc = async (req, res) => {
  try {
    const {
      full_name,
      email,
      aadhaar_phone,
      whatsapp_phone,
      gender,
      dob,
      aadhaar_number,
      pan_number,
      occupation,
      others_please_specify,
      annual_income,
      marital_status,
      father_spouse_name,
      address,
      city_district,
      state,
      pincode,
      investment_objective,
      investment_horizon,
      risk_tolerance,
      past_investment_experience,
      investment_experience,
      risk_aversion,
      full_terms_and_conditions,
      aadhaar_pan_consent,
    } = req.body;

    // ✅ File upload placeholders
    let aadhaar_front_url = "";
    let aadhaar_back_url = "";
    let pan_image_url = "";
    let your_photo_url = "";
    let your_signature_url = "";

    // ✅ Upload each file if exists
    if (req.files?.aadhaar_front) {
        console.log("Uploading aadhaar_front:", req.files.aadhaar_front.name);
      const result = await cloudinary.uploader.upload(
        req.files.aadhaar_front.tempFilePath,
        { folder: "kyc_docs" }
      );
      console.log("Cloudinary upload result:", result);
      aadhaar_front_url = result.secure_url;
    }

    if (req.files?.aadhaar_back) {
      const result = await cloudinary.uploader.upload(
        req.files.aadhaar_back.tempFilePath,
        { folder: "kyc_docs" }
      );
      aadhaar_back_url = result.secure_url;
    }

    if (req.files?.pan_image) {
      const result = await cloudinary.uploader.upload(
        req.files.pan_image.tempFilePath,
        { folder: "kyc_docs" }
      );
      pan_image_url = result.secure_url;
    }

    if (req.files?.your_photo) {
      const result = await cloudinary.uploader.upload(
        req.files.your_photo.tempFilePath,
        { folder: "kyc_docs" }
      );
      your_photo_url = result.secure_url;
    }

    if (req.files?.your_signature) {
      const result = await cloudinary.uploader.upload(
        req.files.your_signature.tempFilePath,
        { folder: "kyc_docs" }
      );
      your_signature_url = result.secure_url;
    }

    // ✅ Save to MongoDB
    const newKyc = await Kyc.create({
      full_name,
      email,
      aadhaar_phone,
      whatsapp_phone,
      gender,
      dob,
      aadhaar_number,
      pan_number,
      occupation,
      others_please_specify,
      annual_income,
      marital_status,
      father_spouse_name,
      address,
      city_district,
      state,
      pincode,
      investment_objective,
      investment_horizon,
      risk_tolerance,
      past_investment_experience: Array.isArray(past_investment_experience)
        ? past_investment_experience
        : [past_investment_experience],
      investment_experience,
      risk_aversion,
      aadhaar_front_url,
      aadhaar_back_url,
      pan_image_url,
      your_photo_url,
      your_signature_url,
      full_terms_and_conditions,
      aadhaar_pan_consent,
    });

    res.status(201).json({
      success: true,
      message: "KYC submitted successfully",
      data: newKyc,
    });
  } catch (error) {
    console.error("❌ Error creating KYC:", error);
    res.status(500).json({
      success: false,
      message: "Server error while submitting KYC",
      error: error.message,
    });
  }
};

// =============================
// ✅ GET ALL KYCs
// =============================
export const getAllKycs = async (req, res) => {
  try {
    const kycs = await Kyc.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      success: true,
      count: kycs.length,
      data: kycs,
    });
  } catch (error) {
    console.error("❌ Error fetching KYCs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching KYCs",
      error: error.message,
    });
  }
};

// =============================
// ✅ UPDATE KYC (by ID)
// =============================
export const updateKyc = async (req, res) => {
  try {
    const { id } = req.params;

    const existingKyc = await Kyc.findById(id);
    if (!existingKyc) {
      return res.status(404).json({ success: false, message: "KYC not found" });
    }

    const updateData = { ...req.body };

    // ✅ If user re-uploads any file, update Cloudinary and DB URLs
    const fileFields = [
      "aadhaar_front",
      "aadhaar_back",
      "pan_image",
      "your_photo",
      "your_signature",
    ];

    for (const field of fileFields) {
      if (req.files?.[field]) {
        const result = await cloudinary.uploader.upload(
          req.files[field].tempFilePath,
          { folder: "kyc_docs" }
        );
        updateData[`${field}_url`] = result.secure_url;
      }
    }

    const updatedKyc = await Kyc.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "KYC updated successfully",
      data: updatedKyc,
    });
  } catch (error) {
    console.error("❌ Error updating KYC:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating KYC",
      error: error.message,
    });
  }
};
