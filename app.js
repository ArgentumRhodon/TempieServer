require("dotenv").config();
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const redis = require("redis");
const cors = require("cors");

const router = require("./router");
const socketSetup = require("./io");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1/Tempie";
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});
const redisClient = redis.createClient({
  url: process.env.REDISCLOUD_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error ", err));

redisClient.connect().then(() => {
  const app = express();

  const sessionMid = session({
    key: "sessionid",
    store: new RedisStore({
      client: redisClient,
    }),
    secret: "Tempie Bones",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      secure: false,
    },
  });

  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(sessionMid);
  app.use(
    cors({
      origin: ["http://localhost:1212"],
      credentials: true,
    })
  );

  router(app);

  const server = socketSetup(app, sessionMid);

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening on port ${port}`);
  });
});
