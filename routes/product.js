const express = require('express');
const router = express.Router();


const {
    check
} = require('express-validator');


const {
    body,
    validationResult
} = require('express-validator');

const {
    getProductById,
    createProduct,
    getProduct,
    photo,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getAllUniqueCategories
} = require('../controllers/product');


const {
    isSignedIn,
    isAuthenticated,
    isAdmin
} = require('../controllers/auth');

const {
    getUserById,
    getAllUser
} = require('../controllers/user');


// const getToken=require('../controllers/paymentBraintree');
// router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);








// all the params

router.param("userId", getUserById);
router.param("productId", getProductById);


// all the actual Routes...
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)

// read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// router.get("/payment",(req,res)=>{
//     res.json({
//         name:"shivam"
//     })
//     console.log('payment');
    
// } );





// delete route
// router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);

router.delete(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteProduct
  );

// update route
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);


// listing routes

router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);


module.exports = router;