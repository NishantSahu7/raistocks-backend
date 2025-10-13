import express from "express";
import {
  createCRM,
  loginCRM,
  getAllCRM,
  getCRMById,
  updateCRM,
  deleteCRM,
} from "../controllers/crmusersController.js";

const router = express.Router();

router.post("/register", createCRM);
router.post("/login", loginCRM);
router.route("/")
  .get(getAllCRM);
router.route("/:id")
  .get(getCRMById)
  .put(updateCRM)
  .delete(deleteCRM);

export default router;
