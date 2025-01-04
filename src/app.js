const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const app = express();

//creating an api to connect to db
app.post("/signup", async (req, res) => {
  //creating a new instance of an User model
  const user = new UserModel({
    firstName: "Siva",
    lastName: "Kumar",
    age: 26,
    email: "siva@kumar.com",
    password: "siva@112",
    phoneNumber: 6876979,
    gender: "male",
  });
  try {
    await user.save();
    res.send("added data successfully");
  } catch (err) {
    res.status(400).send("Error saving user" + err.message);
  }
});

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
