const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");

const { getUserById } = require("../controllers/user");

const {
  createQuery,
  getAllContacts,
  getContact,
  getContactById,
  removeContact,
} = require("../controllers/contact");

router.param("userId", getUserById);
router.param("contactId", getContactById);

// "/category/create/:userId",
router.post(
  "/contact/create/:userId",
  [
    check("email", "Your email should be a validOne").isEmail(),
    check("name", "name should be of at least 3 characters").isLength({
      min: 3,
    }),
  ],

  isSignedIn,
  isAuthenticated,
  createQuery
);

router.get("/allContacts", getAllContacts);
router.get("/contact/:contactId", getContact);

router.delete(
  "/contact/:contactId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeContact
);

module.exports = router;
