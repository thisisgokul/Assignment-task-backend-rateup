import express from "express";

import { moveCard ,deleteCard} from "../controllers/cards/moveDeleteControllers.js";
import { createCard, getAllCards, updateCard } from "../controllers/cards/addEditController.js";


const router = express.Router();

router.post("/lists/:listId/cards",createCard);
router.get("/lists/:listId/cards",getAllCards);
router.put("/cards/:id", updateCard);
router.put("/cards/:id/move", moveCard);
router.delete("/cards/:id", deleteCard);


export default router;
