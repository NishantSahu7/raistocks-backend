// routes/clientRoutes.js
import express from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  updateKycStatus
} from "../controllers/clientController.js";

const router = express.Router();

router.route("/")
  .get(getClients)
  .post(createClient);

router.route("/:clientId")
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);
  
  router.put("/:clientId/kyc", updateKycStatus);

export default router;
