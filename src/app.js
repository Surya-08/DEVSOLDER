const express = require("express");

const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());
//creating an api to connect to db and dynamic data

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/userRequest.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//First connect to cluster then DB then listen on the server
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
