const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
});

const ChatModel = mongoose.model("Chat", ChatSchema);
module.exports = ChatModel;
