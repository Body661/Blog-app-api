import express from "express";
import { getUsers, updateUser } from "../controllers/admin.mjs";

const router = express.Router();


router.get('/', getUsers)
router.put('/', updateUser)

export default router;