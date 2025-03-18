
import express from "express";
import { createList, getAllLists, updateListTitle } from "../controllers/listsController.js";

const router = express.Router();


router.post("/boards/:boardId/lists",createList );
router.get("/boards/:boardId/lists",getAllLists );
router.put("/lists/:id",updateListTitle );

export default router;
