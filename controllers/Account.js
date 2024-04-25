const models = require("../models");

const { Account } = models;

const login = (req, res) => {
  const email = `${req.body.email}`;
  const password = `${req.body.password}`;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  return Account.authenticate(email, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: "Wrong username or password" });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: "/app" });
  });
};

const signup = async (req, res) => {
  const email = `${req.body.email}`;
  const username = `${req.body.username}`;
  const password = `${req.body.password}`;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const hash = await Account.generateHash(password);
    const newAccount = new Account({ email, username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: "/app" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Email or username already in use" });
    }
    return res.status(500).json({ error: "An error occurred" });
  }
};

const user = async (req, res) => {
  try {
    return res.json({ user: req.session.account });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while attempting to get the user" });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.json({ redirect: "/" });
};

module.exports = {
  login,
  signup,
  logout,
  user,
};
