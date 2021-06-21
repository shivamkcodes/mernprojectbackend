const User = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

const { validationResult } = require("express-validator");

exports.signup = (req, res) => {
  // console.log("signup is working", req.body);

  // handling the error messages.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameterContainErr: errors.array()[0].param,
      // error: errors
    });
  }
  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save our user in DB..",
      });
    }
    // res.json(user);
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  // destructuring of the object.....
  const { email, password } = req.body;

  // checking the validation
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameterContainErr: errors.array()[0].param,
    });
  }

  // const user = new User(req.body);

  // finding the email and password from database.
  User.findOne(
    {
      email,
    },
    (err, user) => {
      if (err || !user) {
        console.log("email  donot matched....");
        return res.status(400).json({
          error: "User Email doesnot exist",
        });
      }
      // checking the password from models user.js (authenticate function)
      if (!user.autheticate(password)) {
        console.log("password donot match");
        return res.status(401).json({
          error: "Your password didnot matches to the corresponding email",
        });
      }

      // creating the tokens.......
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.SECRET
      );

      // putting token into the user cookies..
      res.cookie("token", token, {
        expire: new Date() + 99999,
      });

      // sending the response to frontEnd

      const { _id, name, email, role, phone } = user;

      return res.json({
        token,
        user: {
          _id,
          name,
          email,
          role,
          phone,
        },
      });
    }
  );
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signout successfully!!!!!!",
  });
};

// middle wares.......
// never forget next while writing your custom middleware...

// protected routes.......
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// creating our custom middleWares

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access denied....",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Only admin Can do this........You are not an admin!!!!!!",
    });
  }
  next();
};
