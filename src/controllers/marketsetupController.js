import MarketSetup from "../models/marketsetupModel.js";

// Create Market Setup
export const createMarketSetup = async (req, res) => {
  try {
    const {
      on,
      price,
      supportLevels,
      resistanceLevels,
      supportResistanceComment,
      phase,
      phaseComment,
      trend,
      trendComment,
      chartPattern,
      chartPatternComment,
      candlePattern,
      candlePatternComment,
      breakoutEvents,
    } = req.body;

    // Parse arrays if they are strings
    const parsedSupportLevels = Array.isArray(supportLevels)
      ? supportLevels
      : JSON.parse(supportLevels || "[]");
    const parsedResistanceLevels = Array.isArray(resistanceLevels)
      ? resistanceLevels
      : JSON.parse(resistanceLevels || "[]");
    const parsedBreakoutEvents = Array.isArray(breakoutEvents)
      ? breakoutEvents
      : JSON.parse(breakoutEvents || "[]");

    // Validate array lengths
    if (parsedSupportLevels.length !== 3) {
      return res
        .status(400)
        .json({
          error: "Support levels must be an array of exactly 3 numbers",
        });
    }
    if (parsedResistanceLevels.length !== 3) {
      return res
        .status(400)
        .json({
          error: "Resistance levels must be an array of exactly 3 numbers",
        });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const marketSetup = new MarketSetup({
      on,
      price: Number(price),
      supportLevels: parsedSupportLevels,
      resistanceLevels: parsedResistanceLevels,
      supportResistanceComment,
      phase,
      phaseComment,
      trend,
      trendComment,
      chartPattern,
      chartPatternComment,
      candlePattern,
      candlePatternComment,
      breakoutEvents: parsedBreakoutEvents,
      imageUrl,
    });

    const savedSetup = await marketSetup.save();
    res.status(201).json(savedSetup);
  } catch (err) {
    console.error("Error creating market setup:", err);
    res.status(400).json({ error: err.message });
  }
};

// Get All Market Setups
export const getMarketSetups = async (req, res) => {
  try {
    const setups = await MarketSetup.find().sort({ createdAt: -1 });
    res.status(200).json(setups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Market Setup by ID
export const getMarketSetupById = async (req, res) => {
  try {
    const setup = await MarketSetup.findById(req.params.id);
    if (!setup) return res.status(404).json({ error: "Not found" });
    res.status(200).json(setup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Market Setup
export const deleteMarketSetup = async (req, res) => {
  try {
    const deleted = await MarketSetup.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
