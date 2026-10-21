import express from "express";
import {
  createOrder,
  getOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createOrder).get(getOrders);
router.get("/all", getAllOrders);
router
  .route("/:id")
  .get(getOrderById)
  .put(updateOrderStatus)
  .delete(deleteOrder);

export default router;
