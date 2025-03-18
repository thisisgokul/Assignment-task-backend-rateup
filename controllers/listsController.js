import { listModel } from "../models/models.js";
import supabase from "../config/database.config.js";
import customError from "../utils/errorHandler.js";

//#1 Create a New List in a Board
export const createList = async (req, res, next) => {
  try {
      const { boardId } = req.params;
      const { title } = req.body;

      if (!boardId || !title) {
          return next(customError(400, "Board ID and title are required"));
      }

      // Fetch the highest position from existing lists
      const { data: existingLists, error: fetchError } = await supabase
          .from("lists")
          .select("position")
          .eq("board_id", boardId)
          .order("position", { ascending: false }) 
          .limit(1);

      if (fetchError) {
          return next(customError(400, fetchError.message));
      }

      // Determine the next position
      const nextPosition = existingLists.length > 0 ? existingLists[0].position + 1 : 1;

      // Insert new list with calculated position
      const { data, error } = await supabase
          .from("lists")
          .insert([{ board_id: boardId, title, position: nextPosition }])
          .select();

      if (error) {
          return next(customError(400, error.message));
      }

      res.status(201).json({ success: true, message: "List created successfully!", data });

  } catch (error) {
      next(customError(500, "Something went wrong while creating the list"));
  }
};


//#2 Fetch All Lists for a Board
export const getAllLists = async (req, res, next) => {
    try {
        const { boardId } = req.params; 

        if (!boardId) {
            return next(customError(400, "Board ID is required"));
        }

         // Fetch all list with the same boad_id from the database
        const { data, error } = await supabase
            .from(listModel)
            .select("*")
            .eq("board_id", boardId).order("position", { ascending: false });
          

        if (error) {
            return next(customError(404, "list not found"));
        }

        res.status(200).json({
            success: true,
            message: "lists fetched successfully!",
            data
        });

    } catch (error) {
        next(customError(500, "Something went wrong"));
    }
};

//#3  Update List Title
export const updateListTitle = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
  
     
      if (!title.trim()) {
        return next(customError(400, "Title cannot be empty"));
      }
  
       // Update the list title in the database
      const { data, error } = await supabase
        .from(listModel) 
        .update({ title })
        .eq("id", id) 
        .select(); 
  
      if (error) {
        return next(customError(400, error.message));
      }
  
      res.status(200).json({
        success: true,
        message: "List title updated successfully!",
        list: data[0],
      });
    } catch (error) {
      next(customError(500, "Something went wrong"));
    }
  };