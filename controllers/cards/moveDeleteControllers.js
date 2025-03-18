import supabase from "../../config/database.config.js";
import { cardModel } from "../../models/models.js";
import customError from "../../utils/errorHandler.js";

// #1 Move cards to another list
export const moveCard = async (req, res, next) => {
    try {
        const { id } = req.params; // Get card ID from URL
        const { list_id } = req.body; // Get new list ID from request body

      

        if (!id || !list_id) {
            return next(customError(400, "Card ID and new list ID are required"));
        }

        // Update the list_id of the card
        const { data, error } = await supabase
            .from(cardModel) 
            .update({ list_id}) 
            .eq("id", id)
            .select();

        if (error) {
            return next(customError(400, error.message));
        }

        res.status(200).json({ success: true, message: "Card moved successfully!", data });
    } catch (error) {
        next(customError(500, "Something went wrong while moving the card"));
    }
};

// #2 Delete card from a list
export const deleteCard = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(customError(400, "Card ID is required"));
        }

        // Delete the card from the "cards" table
        const { error } = await supabase.from(cardModel).delete().eq("id", id);

        if (error) {
            return next(customError(400, error.message));
        }

        res.status(200).json({ success: true, message: "Card deleted successfully!" });
    } catch (error) {
        next(customError(500, "Something went wrong while deleting the card"));
    }
};