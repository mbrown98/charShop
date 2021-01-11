import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server listening on Port ${PORT} in ${process.env.NODE_ENV} mode`
  )
);
