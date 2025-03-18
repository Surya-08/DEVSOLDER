const express = require("express");
const { validateSignUp } = require("../utils/validations");

const authRouter = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);

    //validate the password
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(password);
    //creating a new instance of an User model
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
    });
    await user.save();
    res.send("User added successfuly");
  } catch (err) {
    res.status(400).send("Error saving user " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      return res.status(401).send("Please login!!");
    }
    const isPassword = await user.validatePassword(password);

    if (isPassword) {
      // create jwt token
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error logging in user " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logged out successfully");
});

module.exports = authRouter;
