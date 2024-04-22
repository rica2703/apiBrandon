const db = require("../models");
// const ROLES = db.role;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, username) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (username) {
      res.status(400).send({ message: "Fallo! usuario esta en uso!" });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Fallo! Correo electronico en uso!" });
        return;
      }

      next();
    });
  });
};

// checkRolesExisted = (req, res, next) => {
//   if (req.body.roles) {
//     for (let i = 0; i < req.body.roles.length; i++) {
//       if (!ROLES.includes(req.body.roles[i])) {
//         res.status(400).send({
//           message: `Failed! Role ${req.body.roles[i]} does not exist!`
//         });
//         return;
//       }
//     }
//   }

//   next();
// };

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  // checkRolesExisted
};

module.exports = verifySignUp;
