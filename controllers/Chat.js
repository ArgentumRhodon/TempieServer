const { Chat } = require("../models");

const createChat = async (req, res) => {
  if (!req.body.uID_1 || !req.body.uID_2) {
    return res
      .status(400)
      .json({ error: "Missing at least one uID for chat creation" });
  }

  const chatData = {
    participants: [req.body.uID_1, req.body.uID_2],
    messages: [],
  };

  try {
    const newChat = new Chat(chatData);
    await newChat.save();
    return res.status(200).json(chatData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "An error occured making a chat" });
  }
};

const chats = async (req, res) => {
  try {
    const query = { participants: req.session.account._id };
    const docs = await Chat.find(query).lean().exec();

    return res.status(200).json({ chats: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error retrieving chats" });
  }
};

const addMessage = async (req, res) => {
  if (!req.body.sendID || !req.body.chatID) {
    return res
      .status(400)
      .json({ error: "Error with message sender or receiver ID" });
  }

  if (!req.body.message) {
    return res
      .status(400)
      .json({ error: "Error with message content: undefined or empty" });
  }

  const messageData = {
    sender: req.body.sendID,
    message: req.body.message,
  };

  try {
    const chatDoc = Chat.findById(req.body.chatID);
    chatDoc.messages.push(messageData);
    chatDoc.save();
    return res.status(200).json(chatData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error saving message" });
  }
};

module.exports = {
  createChat,
  chats,
  addMessage,
};
