const Users = require("../users/users-model");

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next({ status: 401, message: "You shall not pass!" });
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const existing = await Users.findBy({ username: req.body.username });
    if (existing.length) {
      next({ status: 422, message: "Username taken" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

function checkUsernameExists(req, res, next) {
  next();
}

async function checkPasswordLength(req, res, next) {
  try {
    if (!req.body.password || req.body.password.length < 3) {
      next({ status: 422, message: "Password must be longer than 3 chars" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  restricted,
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
};
