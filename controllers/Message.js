const { Message } = require("../models");

const createMessage = async (req, res) => {
  const { chatID, text } = req.body;

  if (!chatID || !text) {
    return res.status(400).json({ error: "Error with saving message" });
  }

  try {
    const message = new Message({
      chatID,
      senderID: req.session.account._id,
      text,
    });

    const savedMessage = await message.save();
    return res.status(200).json(savedMessage);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error saving message" });
  }
};

const getChatMessages = async (req, res) => {
  const { chatID } = req.params;

  if (!chatID) {
    return req
      .status(400)
      .json({ error: "Every message needs a corresponding chat" });
  }

  try {
    const messages = await Message.find({ chatID }).lean().exec();
    return res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Problem getting messages" });
  }
};

module.exports = {
  createMessage,
  getChatMessages,
};
