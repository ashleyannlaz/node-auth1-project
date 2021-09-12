const router = require("express").Router();
const Users = require("./users-model");
const { restricted } = require("../auth/auth-middleware");

router.get("/", restricted, async (req, res, next) => {
  try {
    const allUsers = await Users.find();
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
