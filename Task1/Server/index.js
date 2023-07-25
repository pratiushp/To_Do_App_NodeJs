import dotenv from "dotenv";

import connectDB from "./Config/database.js";

import app from "./Config/Express.js";

//Config .env File
dotenv.config({ path: "./config.env" });

//Connect databse
connectDB();

//PORT
const PORT = process.env.PORT;

//run listen

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
