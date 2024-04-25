const controllers = require("./controllers");

const router = (app) => {
  app.post("/login", controllers.Account.login);
  app.post("/signup", controllers.Account.signup);
  app.get("/logout", controllers.Account.logout);
  app.get("/user", controllers.Account.user);
};

module.exports = router;
