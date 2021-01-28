const express = require('express');
const router = express.Router();


const {
    isSignedIn,
    isAuthenticated,
    isAdmin
} = require('../controllers/auth');

const {
    updateStock
} = require('../controllers/product');
const {
    getUserById,
    pushOrderinPurchaseList,

} = require('../controllers/user');
const {
    getOrderById,
    createOrder,
    getAllOrders,
    getOrderStatus,
    updateStatus


} = require('../controllers/order');


// param
router.param("userId", getUserById);
router.param("orderId", getOrderById);


// actual routes

// create

// router.post("/order/create/:userId", isSignedIn, isAuthenticated, updatedStock, createOrder);
router.post(
    "/order/create/:userId",
    isSignedIn,
    isAuthenticated,
    pushOrderinPurchaseList,
    updateStock,
    createOrder
);


// read 

router.get('/order/all/:userId', isSignedIn, isAuthenticated, isAdmin, getAllOrders);

// status of order

router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router;