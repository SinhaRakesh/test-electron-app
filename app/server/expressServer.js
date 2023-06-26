const express = require("express");
const userApiRoute = require("./api.js");

const api = express();

// Use the API router from api.js
api.use("/api", userApiRoute);

api.use("/", function (req, res, next) {
  res.send({ res: "express api " });
});

// Other server configurations and routes
// ...

const port = 3000;
api.listen(port, () => {
  console.log(
    "\x1b[32m",
    `Express server is running on port ${port}`,
    "\x1b[0m"
  );
});
