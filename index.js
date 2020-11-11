const express = require("express");
const app = express();
const CONFIG = require("./config/index");
const model = require("./models/index");
const { Pool } = require("pg");
const pool = new Pool(CONFIG.DB);
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

/**
 * @description middleware, req.pool will be available in each route
 */
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use("/", model);

app.use((req, res) => {
  res.send({ status: 404, message: "Not found" });
});

/**
 * @description Express error handler
 */
app.use((err, req, res, next) => {
  let status = req.statusCode > 200 ? req.statusCode : 500;
  res.send({
    status,
    message: err.message,
    err: CONFIG.ENV == "development" ? err.stack : {},
  });
});

app.listen(CONFIG.APP.PORT || 3000, "0.0.0.0", () => {
  console.log(`Server started on port ${CONFIG.APP.PORT || 3000}`);
});
