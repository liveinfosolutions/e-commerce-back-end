const { VendorModel } = require("../models/vendor.model");
const bcrypt = require('bcrypt');
const { GOT_ERROR, DATA_NOT_FOUND_ERROR, DATA_SAVED_SUCCESSFULLY, DATA_UPDATED_SUCCESSFULLY, PASSWORD_NOT_MATCH } = require("../../_global/global-request-responses");

exports.addVendor = (req, res) => {
    let data = req.body;

    bcrypt.hash(data.password, 10).then((hash) => {
        let vendor = new VendorModel();
        vendor.first_name = data.first_name;
        vendor.last_name = data.last_name;
        vendor.email = data.email;
        vendor.mobile_number = data.mobile_number;
        vendor.password = hash;

        vendor.save((err, SavedVendor) => {
            if (err) {
                GOT_ERROR(res, 'vendor');
            }

            if (!SavedVendor) {
                DATA_NOT_FOUND_ERROR(res, 'vendor')
            }

            // send response of successfully saved data
            DATA_SAVED_SUCCESSFULLY(res, 'vendor')
        })

    });
}

exports.updateVendor = (req, res) => {
    let data = req.data;
    let id = data._id ? data._id : req.userId;

    let updateObject = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        mobile_number: data.mobile_number
    }

    VendorModel.findOneAndUpdate({ _id: id }, { updateObject }, (err, UpdatedVendor) => {
        if (err) {
            GOT_ERROR(res, 'updating vendor');
        }

        if (!UpdatedVendor) {
            DATA_NOT_FOUND_ERROR(res, 'updated vendor')
        }

        // send response of successfully saved data
        DATA_UPDATED_SUCCESSFULLY(res, 'vendor')
    })
}

exports.changePassword = (req,res) => {
    let data = req.body;
    let id = data._id ? data._id : req.userId;

    VendorModel.findOne({ _id: id }).then(User => {
        // return if user not found
        if (!User) {
            DATA_NOT_FOUND_ERROR(res, 'vendor')
        }
        // return if old password do not match 
        bcrypt.compare(data.password, User.password).then((response) => {
            if (!response) {
                PASSWORD_NOT_MATCH(req,'vendor')
            }

            // convert password to hash
            bcrypt.hash(data.new_password, 10).then((hash) => {
                User.password = hash;
                // save the updated user with new password
                User.save((err, PasswordUpdated) => {
                    // if error occur while saving new password
                    if (err) {
                       GOT_ERROR(res,'vendor change password')
                    }
                    // if updated user data not found
                    if (!PasswordUpdated) {
                       DATA_NOT_FOUND_ERROR(res,'updated vendor')
                    }
                    // successfully updated new password
                    DATA_UPDATED_SUCCESSFULLY(res,'Password');                   
                })
            })
        })

    })
}