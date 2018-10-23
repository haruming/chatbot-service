const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @class models/message
 * @since 1.0.0
 * @description message config for chatbot
 */
const schema = Schema(
  {
    username: String,
    question: String,
    type: String,
    answer: String,
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("message", schema);