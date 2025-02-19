const express = require("express");

const connectDB = require("./config/database");
const UserModel = require("./models/user");

const { validateSignUp } = require("./utils/validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/utils");

const app = express();

app.use(express.json());
app.use(cookieParser());
//creating an api to connect to db and dynamic data
app.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);

    //validate the password
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }
    const isPassword = await user.validatePassword(password);

    if (isPassword) {
      // create jwt token
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("User logged in successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error logging in user " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile data" + err.message);
  }
});

app.get("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const users = req.user;
    res.send(users);
  } catch (err) {
    res.status(400).send("Error fetching users" + err.message);
  }
});
//GET all the users from the db
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await UserModel.find({});
    res.send(allUsers);
  } catch (err) {
    res.status(400).send("Error fetching all users" + err.message);
  }
});
//delete a user from the db
app.delete("/user", async (req, res) => {
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

//Update data of the user
app.patch("/user/:userId", async (req, res) => {
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

    res.send(user + "User updated successfully");
  } catch {
    (err) => {
      res.status(400).send("Error updating user" + err.message);
    };
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
