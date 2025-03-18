import supabase from "../../config/database.config.js";
import { cardModel } from "../../models/models.js";
import customError from "../../utils/errorHandler.js";

//#1 create card 
export const createCard = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const { title, description } = req.body;

        if (!listId || !title) {
            return next(customError(400, "List ID and title are required"));
        }

        // Fetch the highest position from the existing cards in the list
        const { data: existingCards, error: fetchError } = await supabase
            .from("cards")
            .select("position")
            .eq("list_id", listId)
            .order("position", { ascending: false }) // Get the highest position
            .limit(1);

        if (fetchError) {
            return next(customError(400, fetchError.message));
        }

        // Determine the next position
        const nextPosition = existingCards.length > 0 ? existingCards[0].position + 1 : 1;

        // Insert new card with calculated position
        const { data, error } = await supabase
            .from("cards")
            .insert([{ list_id: listId, title, description, position: nextPosition }])
            .select();

        if (error) {
            return next(customError(400, error.message));
        }

        res.status(201).json({ success: true, message: "Card created successfully!", data });

    } catch (error) {
        next(customError(500, "Something went wrong while creating the card"));
    }
};

//#2 Fetch all cards from the list
export const getAllCards = async (req, res, next) => {
    try {
        const { listId } = req.params;   // Extract listId from request parameters

        if (!listId) {
            return next(customError(400, "list ID is required"));
        }

         // Fetch all card with the same list_id from the database
        const { data, error } = await supabase
            .from(cardModel)
            .select("*")
            .eq("list_id", listId).order("position", { ascending: false });
          

        if (error) {
            return next(customError(404, "board not found"));
        }

        res.status(200).json({
            success: true,
            message: "boards fetched successfully!",
            data
        });

    } catch (error) {
         // Handle unexpected server errors with custom error handler
        next(customError(500, "Something went wrong"));
    }
};

//#3 update card
export const updateCard = async (req, res, next) => {
    try {
        const { id } = req.params; // Extract card ID from URL
     
        const { title, description } = req.body;

        if (!id || (!title && !description)) {
            return next(customError(400, "Invalid request. Title or description required."));
        }

        // Update the existing card in the "cards" table
        const { data, error } = await supabase
            .from(cardModel)
            .update({ title, description})
            .eq("id", id)
            .select();

        if (error) {
            return next(customError(400, error.message));
        }

        res.status(200).json({ success: true, message: "Card updated successfully!", data });

    } catch (error) {
        next(customError(500, "Something went wrong while updating the card"));
    }
};

