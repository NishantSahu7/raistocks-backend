import GlobalMarket from "../models/globalmarketModel.js";

 

// ✅ Create a new global market entry
export const createGlobalMarket = async (req, res) => {
  try {
    const { country, currency, value, globalcomment, comment, date } = req.body;
    const gc = globalcomment || comment || "";

    const newEntry = await GlobalMarket.create({
      country,
      currency,
      value,
      globalcomment: gc,
      date: date || undefined,
    });

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all global market entries
export const getGlobalMarkets = async (req, res) => {
  try {
    const markets = await GlobalMarket.find().sort({ createdAt: -1 });
    res.status(200).json(markets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single global market entry by ID
export const getGlobalMarketById = async (req, res) => {
  try {
    const market = await GlobalMarket.findById(req.params.id);
    if (!market) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json(market);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update a global market entry
export const updateGlobalMarket = async (req, res) => {
  try {
    const updatedMarket = await GlobalMarket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMarket)
      return res.status(404).json({ message: "Entry not found" });
    res.status(200).json(updatedMarket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete a global market entry
export const deleteGlobalMarket = async (req, res) => {
  try {
    const deleted = await GlobalMarket.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
