import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import revenueRouter from "./routes/overviewRoute.js";
import ratingRouter from "./routes/ratingRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import inventoryRouter from "./routes/inventoryRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json({}));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/overview", revenueRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/category", categoryRouter);
app.use("/api/inventory", inventoryRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
