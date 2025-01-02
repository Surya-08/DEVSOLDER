const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send({ firstname: "John", lastname: "Doe" }),
    (req, res) => {
      res.send("Hello response2");
    };
});
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
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
