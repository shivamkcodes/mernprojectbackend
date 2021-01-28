const express = require('express');
const router = express.Router();
const {
    check
} = require('express-validator');

const {
    signin,
    signout,
    signup,
    isSignedIn
} = require('../controllers/auth');




router.post("/signup",
    // doing the validation for the database........
    [
        check("name", "name should be of at least 3 characters").isLength({
            min: 3
        }),
        check("password", "password should be of at least 5 characters").isLength({
            min: 5
        }),
        check("phone", "phone should be of at exactly 10 characters").isLength({
            min: 10
        }),
        check("email", "Your email should be a validOne").isEmail(),

    ], signup);


router.post("/signin", [

    check("email", "Your email should be a validOne").isEmail(),
    check("password", "password should be of at least 5 characters").isLength({
        min: 5
    }),

], signin);
router.get("/signout", signout);


// TODO testing route...

router.get("/test", isSignedIn, (req, res) => {
    // res.send("Succesfully Enters into a protected route.....authorization....")
    res.json(req.auth);
})

module.exports = router;