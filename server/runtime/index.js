const async = require("async");
const db = require("./db");

module.exports.init = next => {
  async.parallel([db.init], next);
};