//------------------------------------------IMPORTS-------------------------------
const { VendorModel } = require('../models/vendor.model');
const bcrypt = require('bcrypt');
const { GOT_ERROR, DATA_NOT_FOUND_ERROR, DATA_SAVED_SUCCESSFULLY, DATA_UPDATED_SUCCESSFULLY, PASSWORD_NOT_MATCH, DATA_REMOVED_SUCCESSFULLY } = require('../../_global/global-request-responses');
//--------------------------------------------------------------------------------

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
                return GOT_ERROR(res, 'vendor');
            }

            if (!SavedVendor) {
                return DATA_NOT_FOUND_ERROR(res, 'vendor')
            }

            // send response of successfully saved data
            return DATA_SAVED_SUCCESSFULLY(res, 'vendor')
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
            return GOT_ERROR(res, 'updating vendor');
        }

        if (!UpdatedVendor) {
            return DATA_NOT_FOUND_ERROR(res, 'updated vendor')
        }

        // send response of successfully saved data
        return DATA_UPDATED_SUCCESSFULLY(res, 'vendor')
    })
}

exports.changePassword = (req, res) => {
    let data = req.body;
    let id = data._id ? data._id : req.userId;

    VendorModel.findOne({ _id: id }).then(User => {
        // return if user not found
        if (!User) {
            return DATA_NOT_FOUND_ERROR(res, 'vendor')
        }
        // return if old password do not match 
        bcrypt.compare(data.password, User.password).then((response) => {
            if (!response) {
                return PASSWORD_NOT_MATCH(req, 'vendor')
            }

            // convert password to hash
            bcrypt.hash(data.new_password, 10).then((hash) => {
                User.password = hash;
                // save the updated user with new password
                User.save((err, PasswordUpdated) => {
                    // if error occur while saving new password
                    if (err) {
                        return GOT_ERROR(res, 'vendor change password')
                    }
                    // if updated user data not found
                    if (!PasswordUpdated) {
                        return DATA_NOT_FOUND_ERROR(res, 'updated vendor')
                    }
                    // successfully updated new password
                    return DATA_UPDATED_SUCCESSFULLY(res, 'Password');
                })
            })
        })

    })
}

// todo -> Method to delete vendor
exports.removeVendor = (req, res) => {
    let id = req.body._id;

    VendorModel.findByIdAndDelete(id, (err, deleted) => {
        if (err) {
            return GOT_ERROR(res, 'removing vendor');
        } else {
            return DATA_REMOVED_SUCCESSFULLY(res, 'vendor');
        }
    });
}