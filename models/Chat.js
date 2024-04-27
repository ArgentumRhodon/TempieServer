const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const ChatModel = mongoose.model("Chat", ChatSchema);
module.exports = ChatModel;
