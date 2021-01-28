const Product = require('../models/product');
const {
    check,
    validationResult
} = require('express-validator');

const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const path=require('path');




exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
      .populate("category")
      .exec((err, product) => {
        if (err) {
          return res.status(400).json({
            error: "Product not found"
          });
        }
        req.product = product;
        next();
      });
  };


exports.createProduct = (req, res) => {

    let form = formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem is with the image itself"
            })
        }


        // destructuring our fields..

        const {
            name,
            description,
            price,
            category,
            stock
        } = fields;


        if (!name ||
            !description ||
            !price ||
            !category ||
            !stock

        ) {

            return res.status(400).json({
                error: "please include all the fields..."
            })

        }
        console.log(name,"added");

        if (name.length < 3 || description.length < 6) {

            return res.status(400).json({
                error: "please check the length of the inputs "
            })

        }

        if (isNaN(price)) {

            return res.status(400).json({
                error: "please check the type of the inputs "
            })

        }




        let product = new Product(fields);

        // handling the files

        if(!file.photo){
            return res.status(400).json({
                error: "please add the file"
            })
        }

        if (file.photo) {
            if (file.photo.size > 3145730) {
                return res.status(400).json({
                    error: "file size is too bigger"
                })
            }
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;


        // saving into the DB

        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Saving into the DB fails....."
                })
            }
            res.json(product);
        })

    })

}

exports.getProduct = (req, res) => {
    // because of the size of the photo
    req.product.photo = undefined;
    return res.json(req.product);
}



// middleWare photo


exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data);
        next();

    }

}




exports.deleteProduct = (req, res) => {
    // console.log(req.params.productId);
    
    let product=req.product;
    product.remove((err, deletedProduct) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to delete the product"
        });
      }
      res.json({
        message: "Deletion was a success",
        deletedProduct
      });
    });
  };

exports.updateProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem is with the image itself"
            })
        }

        let product = req.product;
        product = _.extend(product, fields);

        // handling the files

        if(!file.photo){
            return res.status(400).json({
                error: "please add the file"
            })
        }

        if (file.photo) {
            if (file.photo.size > 3145730) {
                return res.status(400).json({
                    error: "file size is too bigger"
                })
            }
        }

        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;


        


        // saving into the DB

        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Saving into the DB fails....."
                })
            }
            res.json(product);
        })

    })

}

exports.getAllProducts = (req, res) => {

    let limit = req.query.limit ? parseInt(req.query.limit) : 9;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
        .select("-photo")
        .populate("category")
        .sort([
            [sortBy, "asc"]
        ])
        .limit(limit)
        .exec((err, product) => {
            if (err) {
                res.status(400).json({
                    message: "error in finding product"
                })
            }
            res.json(product);
        })


}


exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                err: "No Categories found"
            })
        }
        return res.json(category);
    });
}

// todo not working
// middle ware....





exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {
                    _id: prod._id
                },
                update: {
                    $inc: {
                        stock: -prod.count,
                        sold: +prod.count
                    }
                }
            }
        };
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Bulk operation failed"
            });
        }
        next();
    });
};