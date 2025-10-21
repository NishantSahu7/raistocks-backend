// routes/clientRoutes.js
import express from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.route("/")
  .get(getClients)
  .post(createClient);

router.route("/:id")
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

export default router;
