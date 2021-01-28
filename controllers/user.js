// getting the user model from the database
const User = require('../models/user');
const Order = require('../models/order');



// middleWare 
exports.getUserById = (req, res, next, id) => {
    // searching the userID in DB
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "No user was found..."
            });

        }

        req.profile = user;
        next();
    })
}


exports.getUser = (req, res) => {
    // todo come here for the password.......
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}



// TODO-> check this if u can use it..

exports.getAllUser = (req, res) => {
    User.find({

    }, {
        name: 1
    }).exec((err, user) => {
        if (err || !user) {

            return res.status(400).json({
                error: "Users not found"
            })
        }

        req.profile = user;

        console.log('working', req.body);
        return res.json(req.profile)
    })

}


exports.updateUser = (req, res) => {
    User.findByIdAndUpdate({
            _id: req.profile._id
        }, {
            $set: req.body
        }, {
            new: true,
            useFindAndModify: false
        },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized......"
                })
            }

            user.salt = undefined;
            user.encry_password = undefined;
            user.updatedAt = undefined;
            user.createdAt = undefined;

            res.json(user);

        }
    )

}

// TODO=>come here gain........
exports.userPurchaseList = (req, res) => {

    Order.find({
            user: req.profile._id
        })
        .populate("user", "_id name")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "No orders are present in this cart!!"
                })
            }
            return res.json(order);
        })

}


// middleWare

exports.pushOrderinPurchaseList = (req, res, next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product._name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id

        })
    });


    // stroring into the DataBase......
    User.findOneAndUpdate({
            _id: req.profile._id
        }, {
            $push: {
                purchases: purchases
            }
        }, {
            new: true
        },
        (err, purchase) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to save Your purchaseList"
                })
            }
            next();

        }

    )
}