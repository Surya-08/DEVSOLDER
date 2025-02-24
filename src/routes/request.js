const express = require("express");

const requestRouter = express.Router();
const UserModel = require("../models/user");
const connectionRequestModel = require("../models/connectionRequests");
const { userAuth } = require("../middlewares/auth.js");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const validUser = await UserModel.findById(toUserId);
      if (!validUser) {
        return res.status(400).json({ message: "User not found!!!" });
      }
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send("Connection request already exists");
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " is " + status,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);
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
