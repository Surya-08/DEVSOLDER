const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/utils");

const app = express();
// app.use("/test", (req, res) => {
//   res.send("Hello World");
// });

// app.use("/hello", (req, res) => {
//   res.send("Hello Hello");
// });
// app.use("/", (req, res) => {
//   res.send("Empty");
// });
// app.use("hello/2", (req, res) => {
//   res.send("Hello without /");
// });
// app.use("/xyz", (req, res) => {
//   res.send("xyz");
// });
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
// app.get("/user", (req, res) => {
//   console.log(req.query);
//   res.send({  }),
//     (req, res) => {
//       res.send("Hello response2");
//     };
// });
app.get("/getData", (req, res) => {
  throw new Error("Errors");

  res.status(500).send("Something went wrong");
});
app.listen("4001", () => {
  console.log("connected to server 4001");
});
