import Client from "../models/clientModel.js";

export const generateClientId = async () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const monthNames = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  const mm = monthNames[now.getMonth()];
  const dd = String(now.getDate()).padStart(2, "0");

  const count = await Client.countDocuments();
  const serial = String(count + 1).padStart(4, "0");

  const clientId = `RAI${yy}${mm}${dd}${serial}`;
  console.log("🪪 Generated Client ID:", clientId);
  return clientId;
};
