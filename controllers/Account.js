const models = require("../models");

const { Account } = models;

const login = (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.password}`;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  return Account.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: "Wrong username or password" });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: "/app" });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const password1 = `${req.body.password1}`;
  const password2 = `${req.body.password2}`;

  if (!username || !password1 || !password2) {
    return res.status(400).json({ error: "All fields required" });
  }

  if (password1 !== password2) {
    return res.status(400).json({ error: "Passwords must match" });
  }

  try {
    const hash = await Account.generateHash(password1);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: "/app" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username already in use" });
    }
    return res.status(500).json({ error: "An error occurred" });
  }
};

const user = async (req, res) => {
  try {
    return res.json({ user: req.session.account });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while attempting to get the user" });
  }
};

const username = async (req, res) => {
  const { uID } = req.params;

  try {
    const account = await Account.findOne({ _id: uID }).lean().exec();
    return res.status(200).json(account.username);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error getting username from ID" });
  }
};

const makeFriends = async (req, res) => {
  const { uID_1, uID_2 } = req.body;

  if (!uID_1 || !uID_2) {
    return res.status(400).json({ error: "Need 2 usernames to add friend" });
  }

  try {
    // const user = Account.find({ _id: req.session.account._id });
    const acc1 = await Account.findOne({ username: uID_1 });
    const acc2 = await Account.findOne({ username: uID_2 });

    acc1.friends.push(acc2._id);
    acc2.friends.push(acc1._id);
    acc1.save();
    acc2.save();
    return res.status(200).json({ message: "Friends added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error adding friend" });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.json({ redirect: "/auth/login" });
};

module.exports = {
  login,
  signup,
  logout,
  user,
  makeFriends,
  username,
};
