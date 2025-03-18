import express from "express";
import {  createBoard,getAllBoards ,getSpecificBoard} from "../controllers/boardController.js";

const router = express.Router();

router.get("/boards", getAllBoards);
router.get("/boards/:id", getSpecificBoard);
router.post("/boards", createBoard);

export default router;
