const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequests");
const UserModel = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills";

//get all pending requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionsReceived = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionsReceived,
    });
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allConnections = await connectionRequestModel
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = allConnections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 40 ? 40 : limit;
    const skip = (page - 1) * limit;
    const feedData = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("formUserId toUserId");

    const hideUsersFromFeed = new Set();
    feedData.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId),
        hideUsersFromFeed.add(req.toUserId);
    });
    const users = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({
      message: "Feed Data fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
