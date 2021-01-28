const express = require('express');
const router = express.Router();

const {
    check
} = require('express-validator');

const {
    getCategoryById,
    createCategory,
    getCategory,
    getAllCategory,
    updateCategory,
    removeCategory

} = require('../controllers/category');

const {
    isSignedIn,
    isAdmin,
    isAuthenticated
} = require('../controllers/auth')

const {
    getUserById
} = require('../controllers/user');




// they are params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// actual routes..

// create routes...
router.post("/category/create/:userId",
    [
        check("name", "name should be of at least 3 characters").isLength({
            min: 3
        }),
       

    ],
    isSignedIn, isAuthenticated, isAdmin, createCategory);

// read routes
router.get("/category/:categoryId", getCategory);
router.get("/categories",  getAllCategory);


// update routes..

router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

// delete routes...

router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory);



module.exports = router;