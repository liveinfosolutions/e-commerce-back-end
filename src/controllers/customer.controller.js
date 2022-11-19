//------------------------------------------IMPORTS-------------------------------
const bcrypt = require('bcrypt');
const { DATA_REMOVED_SUCCESSFULLY, GOT_ERROR, DATA_NOT_FOUND_ERROR, DATA_UPDATED_SUCCESSFULLY, PASSWORD_NOT_MATCH, DATA_SAVED_SUCCESSFULLY } = require('../../_global/global-request-responses');
const { CustomerModel } = require('../models/customer.model');
//--------------------------------------------------------------------------------

exports.addCustomer = (req, res) => {
    let data = req.body;

    bcrypt.hash(data.password, 10).then((hash) => {
        let customer = new CustomerModel();
        customer.name = data.name;
        customer.email = data.email;
        customer.mobile_number = data.mobile_number;
        customer.password = hash;

        customer.save((err, SavedVendor) => {
            if (err) {
                return GOT_ERROR(res, 'customer');
            }

            if (!SavedVendor) {
                return DATA_NOT_FOUND_ERROR(res, 'customer')
            }

            // send response of successfully saved data
            return DATA_SAVED_SUCCESSFULLY(res, 'customer')
        })

    });
}

exports.updateCustomer = (req, res) => {
    let data = req.data;
    let id = data._id ? data._id : req.userId;

    let updateObject = {
        name: data.name,
        email: data.email,
        mobile_number: data.mobile_number
    }

    CustomerModel.findOneAndUpdate({ _id: id }, { updateObject }, (err, UpdatedCustomer) => {
        if (err) {
            return GOT_ERROR(res, 'updating customer');
        }

        if (!UpdatedCustomer) {
            return DATA_NOT_FOUND_ERROR(res, 'updated customer')
        }

        // send response of successfully saved data
        return DATA_UPDATED_SUCCESSFULLY(res, 'customer')
    })
}

// ? ---------------------------------CHANGE PASSWORD API ---------------------------------
exports.changeCustomerPassword = (req, res) => {
    const data = req.body;
    const id = data._id ? data._id : req.userId;

    CustomerModel.findOne({ _id: id }).then(User => {
        if (!User) return DATA_NOT_FOUND_ERROR(res, 'customer');
        // return if old password do not match 
        isPasswordMached(res, data, User);
    });
}

// Controller's Main Method // ! Used in changeCustomerPassword Controller
function isPasswordMached(res, data, User) {
    bcrypt.compare(data.password, User.password).then((response) => {
        if (!response) return PASSWORD_NOT_MATCH(res, 'customer');

        // convert password to hashedPassword
        bcrypt.hash(data.new_password, 10).then((hashedPassword) => {
            User.password = hashedPassword;
            User.save((err, PasswordUpdated) => {
                if (err) return GOT_ERROR(res, 'customer change password');
                if (!PasswordUpdated) return DATA_NOT_FOUND_ERROR(res, 'updated customer');

                // successfully updated new password
                return DATA_UPDATED_SUCCESSFULLY(res, 'Password');
            });
        });
    });
}
// ? --------------------------------------------------------------------------------------


// * Method to delete customer
exports.removeCustomer = (req, res) => {
    let id = req.body._id;

    CustomerModel.findByIdAndDelete(id, (err, deleted) => {
        if (err) {
            return GOT_ERROR(res, 'removing customer');
        } else {
            return DATA_REMOVED_SUCCESSFULLY(res, 'customer');
        }
    });
}