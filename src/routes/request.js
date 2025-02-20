const express = require("express");

const requestRouter = express.Router();
const UserModel = require("../models/user");
const userAuth = require("../middlewares/auth.js");

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const users = req.user;
    res.send(users);
  } catch (err) {
    res.status(400).send("Error fetching users" + err.message);
  }
});
//GET all the users from the db
requestRouter.get("/feed", async (req, res) => {
  try {
    const allUsers = await UserModel.find({});
    res.send(allUsers);
  } catch (err) {
    res.status(400).send("Error fetching all users" + err.message);
  }
});

module.exports = requestRouter;
