const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const UserModel = require("../models/user");
const { validateEditProfile } = require("../utils/validations.js");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile data" + err.message);
  }
});

//Update data of the user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    // res.send(`${loggedInUser.firstName} profile was updated successfully`);
    res.json({
      message: `${loggedInUser.firstName} profile was updated successfully`,
      data: loggedInUser,
    });
  } catch {
    (err) => {
      res.status(400).send("Error updating user" + err.message);
    };
  }
});

profileRouter.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;
    const allowed_updates = ["age", "gender", "skills", "about", "photoUrl"];
    const updatedUser = Object.keys(data).every((item) =>
      allowed_updates.includes(item)
    );
    if (!updatedUser) {
      throw new Error("Invalid updating user");
    }
    const user = await new UserModel.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    await user.save();

    res.send(user + "has updated successfully");
  } catch {
    (err) => {
      res.status(400).send("Error updating user" + err.message);
    };
  }
});

//delete a user from the db
profileRouter.delete("/user", async (req, res) => {
  try {
    const deleteUser = await UserModel.findOneAndDelete({
      //   email: req.body.email,
      _id: req.body.id,
    });
    res.send(deleteUser);
  } catch {
    (err) => {
      res.status(400).send("Error deleting user" + err.message);
    };
  }
});

module.exports = profileRouter;
