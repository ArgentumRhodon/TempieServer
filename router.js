const controllers = require('./controllers');

const router = (app) => {
  app.post('/login', controllers.Account.login);
  app.post('/signup', controllers.Account.signup);

  app.post('/chats', controllers.Chat.createChat);
  app.post('/messages', controllers.Message.createMessage);

  app.get('/logout', controllers.Account.logout);
  app.get('/chats', controllers.Chat.getChats);
  app.get('/user', controllers.Account.user);
  app.get('/messages/:chatID', controllers.Message.getChatMessages);
  app.get('/username/:uID', controllers.Account.username);
};

module.exports = router;
