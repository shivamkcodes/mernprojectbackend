const express = require('express');
const router = express.Router();

const {
    isSignedIn,
    isAuthenticated,
    isAdmin
    
} = require('../controllers/auth');

const {getToken}=require('../controllers/paymentBraintree')

// const {
//     getUserById,
//     getAllUser
// } = require('../controllers/user');

// router.param("userId", getUserById);


// const getToken=require('../controllers/paymentBraintree');
const {processPayment}=require('../controllers/paymentBraintree');

router.get("/payment/gettoken/:userId",isSignedIn,   getToken);
// router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);



// router.post("payment/braintree/:userId",isSignedIn,  processPayment);
router.post(
    "/payment/braintree/:userId",
    isSignedIn,
    // isAuthenticated,
    processPayment
  );



module.exports = router;

