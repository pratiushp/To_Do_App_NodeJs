// Config/Express.js
import express from "express";
import routes from "../routes/index.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//Routes
app.use("/api", routes);

//rest API
app.get("/", (req, res) => {
  res.send("<h1> Welcome User </h1>");
});

export default app;
