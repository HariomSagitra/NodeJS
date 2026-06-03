require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddleware")
const app = express();

connectDB();

app.use(express.json());

app.use("/api/users", userRoutes);

//error middlware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
