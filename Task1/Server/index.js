import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./Config/database.js";
import authRoutes from "./routes/authRoute.js";
import taskRoutes from "./routes/taskRoute.js";

//Config .env File
dotenv.config({ path: "./config.env" });

//Connect databse
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

//rest API
app.get("/", (req, res) => {
  res.send("<h1> Welcome User </h1>");
});

//PORT
const PORT = process.env.PORT;

//run listen

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
