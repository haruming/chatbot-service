const mongoose = require("mongoose");

mongoose.Promise = Promise;

const config = require("../config");

module.exports.init = next => {
  const db = config.db;
  const url = `mongodb://${db.url}:${db.port}/${db.dbName}`;
  console.log("DB started at:" + url);
  module.exports.url = url;

  mongoose.connect(
    url,
    {
      server: {
        socketOptions: {
          keepAlive: 256
        }
      }
    },
    next
  );
}