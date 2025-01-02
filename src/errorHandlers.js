const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/utils");

const app = express();

// app.use("/user", userAuth);

// app.get(
//   "/user/userError",
//   userAuth,
//   //   (req, res, next) => {
//   //     console.log("Request Handler 1");
//   //     next();
//   //     // res.send("Response 1");
//   //   },
//   (req, res) => {
//     console.log("Request Handler 2");

//     res.send("Response 2");
//   }
// );
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong in err");
  }
});
app.get("/getData", (req, res) => {
  throw new Error("Errors");

  res.status(500).send("Something went wrong");
});
app.listen("4001", () => {
  console.log("connected to server 4001");
});
