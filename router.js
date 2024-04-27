const controllers = require("./controllers");

const router = (app) => {
  app.post("/login", controllers.Account.login);
  app.post("/signup", controllers.Account.signup);

  app.post("/chats", controllers.Chat.createChat);
  app.post("/message", controllers.Chat.addMessage);

  app.get("/logout", controllers.Account.logout);
  app.get("/chats", controllers.Chat.chats);
  app.get("/user", controllers.Account.user);
};

module.exports = router;
