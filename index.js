import express from "express";
const app = express();
import cors from "cors";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

// middleware setup
app.use(express.json({ limit: '10mb' }));  // #Limit for JSON bodies

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

// Routes 
app.use('/api',boardRoutes);
app.use('/api',listRoutes);
app.use('/api',cardRoutes);
  
  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
