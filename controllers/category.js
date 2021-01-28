const Category = require('../models/category');
const {
    validationResult
} = require('express-validator');

exports.getCategoryById = (req, res, next, Id) => {
    Category.findById(Id).exec((err, cate) => {
        if (err) {
            return res.status(400).json({
                err: "category not found in Db"
            })
        }

        req.category = cate;
        next();
    })
}




exports.createCategory = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            // error: errors.array()[0].msg,
            // parameterContainErr: errors.array()[0].param
            error: errors
        })

    }
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "Not able to save in Db"
            })
        }
        res.json({
            category
        });
    })
}


exports.getCategory = (req, res) => {
    return res.json(req.category);
}


exports.getAllCategory = (req, res) => {
    Category.find().exec((err, items) => {
        if (err) {
            return res.status(400).json({
                error: "No category Found"
            })
        }
        res.json(items);
    })

}

exports.updateCategory = (req, res) => {
   

    const category = req.category;
    category.name = req.body.name;

// console.log(category);

    if(!req.body){
        return res.status(400).json({
            error: "please enter the category"
        })
    }

    // category.save((err, updatedCategory) => {
    //     if (err) {
    //         return res.status(400).json({
    //             error: "Failed to update the category"
    //         })
    //     }

    //     res.json(updatedCategory);

    // })
// }
    category.save((err, updatedCategory) => {
        if (err) {
          return res.status(400).json({
            error: "Failed to update category"
          });
        }
        console.log(updatedCategory);
        
        res.json(updatedCategory);
      });
    };


exports.removeCategory = (req, res) => {

    const category = req.category;
    category.remove((err, category) => {
        if (err) {
            return res.status(400).json({
                error: `Failed to delete the ${category}`
            })
        }
        res.json({
            message: `successfully deleted delete the ${category}`

        })

    })

}