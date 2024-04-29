const { Chat } = require("../models");

const createChat = async (req, res) => {
  try {
    const newChat = new Chat({
      name: `${req.session.account.username}'s Room`,
    });
    const savedChat = await newChat.save();
    return res.status(200).json(savedChat);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "An error occured making a chat" });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().lean().exec();
    return res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error retrieving chats" });
  }
};

module.exports = {
  createChat,
  getChats,
};
