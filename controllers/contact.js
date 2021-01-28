const Contact = require("../models/contact");

exports.createQuery = (req, res) => {
  const contact = new Contact(req.body);
  contact.save((err, contact) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save in Db",
      });
    }
    res.json({
      contact,
    });
  });
};

exports.getContactById = (req, res, next, id) => {
  Contact.findById(id).exec((err, value) => {
    if (err) {
      return res.status(400).json({
        err: "category not found in Db",
      });
    }

    req.contact = value;
    next();
  });
};

exports.getContact = (req, res) => {
  return res.json(req.contact);
  //
};

exports.removeContact = (req, res) => {
  const contact = req.contact;
  contact.remove((err, contact) => {
    if (err) {
      return res.status(400).json({
        error: `Failed to delete the ${contact}`,
      });
    }
    res.json({
      message: `successfully deleted delete the ${contact}`,
    });
  });
};

exports.getAllContacts = (req, res) => {
  Contact.find().exec((err, items) => {
    if (err) {
      return res.status(400).json({
        error: "No category Found",
      });
    }
    res.json(items);
  });
};
