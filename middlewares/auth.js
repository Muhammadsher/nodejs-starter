const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/index");

module.exports = function (req, res, next) {
  if (req.headers.token) {
    jwt.verify(req.headers.token, SECRET, (err, decoded) => {
      if (err) return res.send({ status: 401, message: "Unauthorized", err });

      req.pool.query(`SELECT 1 + 1 AS num`, (err) => {
        if (err)
          return res.send({
            status: 500,
            message: "Could not connect to database",
          });
        next();
      });
    });
  } else {
    res.send({ status: 401, message: "Unauthorized" });
  }
};
