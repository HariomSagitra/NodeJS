require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes")
const errorHandler = require("./middleware/errorMiddleware")
const app = express();

connectDB();

app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/posts",postRoutes)


//error middlware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
