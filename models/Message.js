const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatID: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    senderID: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
