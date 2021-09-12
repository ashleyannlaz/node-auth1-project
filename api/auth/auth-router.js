const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { checkPasswordLength, checkUsernameFree } = require("./auth-middleware");
const Users = require("../users/users-model");

router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const hash = bcrypt.hashSync(password, 8);
      const user = { username, password: hash };
      const createdUser = await Users.add(user);
      res.status(200).json(createdUser);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [user] = await Users.findBy({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({ message: `Welcome ${username}` });
    } else {
      next({ status: 401, message: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((error) => {
      if (!error) {
        res.status(200).json({ message: "logged out" });
      } else {
        next(error);
      }
    });
  } else {
    res.status(200).json({ message: "no session" });
  }
});

module.exports = router;
