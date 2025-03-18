import supabase from "../config/database.config.js";
import { boardModel } from "../models/models.js";
import customError from "../utils/errorHandler.js";

export const createBoard = async (req, res, next) => {
    try {
        const { title } = req.body;
     

        if (!title) {
            return next(customError(400, "Title is required"));
        }
         // Insert new board into the "boards" table
        const { data, error } = await supabase.from(boardModel).insert([{ title }]);

         // Handle Supabase errors with custom error handler
        if (error) {
            return next(customError(400, error.message));
        }

          // Send success response
        res.status(201).json({ success: true, message: "Board created successfully!" });


    } catch (error) {
        next(customError(500, "Something went wrong"));
    }
};

export const getAllBoards = async (req, res, next) => {
    try {
         // Get all data from "boards" table
        const { data, error } = await supabase.from(boardModel).select("*");

        if (error) {
            return next(customError(400, error.message));
        } // Handle Supabase errors with custom error handler

        res.status(200).json({ 
            success: true, 
            message: "Boards fetched successfully!", 
            data 
        });  // Send success response


    } catch (error) {
        console.error("Error fetching boards:", error);
        next(customError(500, "Something went wrong"));
    }
};

export const getSpecificBoard = async (req, res, next) => {
    try {
        const { id } = req.params;   // Extract ID from request parameters

        if (!id) {
            return next(customError(400, "Board ID is required"));
        }

         // Fetch the specific boards from the database
        const { data, error } = await supabase
            .from(boardModel)
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            return next(customError(404, "Board not found"));
        }

        res.status(200).json({
            success: true,
            message: "Board fetched successfully!",
            data
        });

    } catch (error) {
         // Handle unexpected server errors with custom error handler
        next(customError(500, "Something went wrong"));
    }
};

