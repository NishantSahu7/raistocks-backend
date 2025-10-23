// middlewares/tradeSetupSync.js
import TradeSetup from "../models/tradesetupModel.js";

/**
 * Attach auto-sync hooks for any market model.
 * @param {mongoose.Schema} schema - The Mongoose schema
 * @param {String} modelType - The name of the model (e.g. "MarketInsight")
 * @param {Function} getFields - A function that returns { title, comment } for the TradeSetup entry
 */
export function attachTradeSetupHooks(schema, modelType, getFields) {
  // 🟢 Auto-create or update TradeSetup after save
  schema.post("save", async function (doc) {
    try {
      const { title, comment } = getFields(doc);
      await TradeSetup.findOneAndUpdate(
        { modelRef: doc._id, modelType },
        { title, comment, modelType, modelRef: doc._id },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error(`TradeSetup sync failed for ${modelType}:`, err.message);
    }
  });

  // 🔴 Auto-delete TradeSetup when the original document is deleted
  schema.post("findOneAndDelete", async function (doc) {
    if (!doc) return;
    try {
      await TradeSetup.findOneAndDelete({ modelRef: doc._id, modelType });
    } catch (err) {
      console.error(`TradeSetup delete sync failed for ${modelType}:`, err.message);
    }
  });
}
