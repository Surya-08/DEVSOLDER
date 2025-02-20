const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth = async (req, res, next) => {
  //use of this Auth is to Read the token from req cookies-> validate the token -> find the user

  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedToken = await jwt.verify(token, "Dev@Solder%796");
    const { _id } = decodedToken;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
};
module.exports = {
  userAuth,
};
