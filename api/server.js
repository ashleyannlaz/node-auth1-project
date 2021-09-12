const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(
  session({
    name: "chocolatechip", // name of sessionID
    secret: "1234567890", //session id encrypted
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, //in prod should be true, it will only work over HTTPS
      httpOnly: false, // make true if possible ()
    },
    rolling: true, //extend session if good cookie
    resave: false,
    saveUninitialized: false,
  })
);

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => {// eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
