'use strict'
//------------------------------------------IMPORTS-------------------------------
const { AdminUserModel } = require('../models/auth.model');
const { secret } = require('../config/auth.config');
const GLOBAL_CONSTANT = require('../../_global/global');
const GLOBAL_MESSAGES = require('../../_global/global.messages')
const GLOBAL_MAIL = require('../../_global/global.mail')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UPGRADE_PLAN_ERROR, GOT_ERROR, DATA_NOT_FOUND_ERROR, DATA_SAVED_SUCCESSFULLY, NOT_ALLOWED_ERROR, CONTACT_SUPER_ADMIN_ERROR, DATA_UPDATED_SUCCESSFULLY } = require('../../_global/global-request-responses');
//--------------------------------------------------------------------------------

// todo -> Method for Super & Sub Admin signup
exports.adminSignup = (req, res) => {
    let data = req.body;
    if (req.userId) {
        // Get creator of sub-admin who made a request.
        data.creator = req.userId;
    }

    bcrypt.hash(data.password, 10).then((hash) => {
        let newAdminUser = new AdminUserModel();
        newAdminUser.email = data.email.toLowerCase();
        newAdminUser.name = data.name;
        newAdminUser.mobile_number = data.mobile_number;
        newAdminUser.is_super_admin = data.is_super_admin;
        newAdminUser.permissions = data.permissions;
        newAdminUser.creator = !data.creator ? null : data.creator;
        newAdminUser.password = hash;

        // To create Super Admin
        if (data.is_super_admin) {
            // If Multiple Super Admins were not allowed
            if (!GLOBAL_CONSTANT.MULTIPLE_SUPER_ADMINS_ALLOWED) {
                return UPGRADE_PLAN_ERROR(res, 'Super Admin'); // ! Upgrade Plan
            } else {
                // Multiple Super Admins are allowed
                AdminUserModel.find({ is_super_admin: true }).lean().then(superAdmins => {
                    // Todo -> Create Root Super Admin
                    if (superAdmins.length === 0) {
                        // save new super admin user
                        newAdminUser.save((err, SuperAdminSaved) => {
                            if (err) return GOT_ERROR(res, err, 'Super Admin'); // ! Error                            
                            if (!SuperAdminSaved) return DATA_NOT_FOUND_ERROR(res, 'Super Admin'); // ! Error      

                            return DATA_SAVED_SUCCESSFULLY(res, 'Super Admin', 'Super admin created successfully.');
                        })
                    }
                    // ! Check if user is authorized to add new admin
                    AdminUserModel.findById({ _id: data.creator }, (err, Admin) => {
                        if (err) return GOT_ERROR(res, err, 'Admin'); // ! Error   
                        if (!Admin) return DATA_NOT_FOUND_ERROR(res, 'Admin'); // ! Error  
                        if (!Admin.is_super_admin) return NOT_ALLOWED_ERROR(res, 'to add sub-admin'); // ! Error  
                        // If admin tring to create super admin
                        if (superAdmins.length > 0 && !data.creator) return CONTACT_SUPER_ADMIN_ERROR(res, 'to create another super admin.') // ! Error                         

                        if (GLOBAL_CONSTANT.NUMBER_OF_SUPER_ADMIN_ALLOWED != 'UNLIMITED') {
                            // Return If user already created provided numbers of super admins
                            if (GLOBAL_CONSTANT.NUMBER_OF_SUPER_ADMINS_ALLOWED == superAdmins.length) {
                                return UPGRADE_PLAN_ERROR(res, 'Super Admin');
                            }
                        }
                        // todo -> Create new super admin
                        if ((GLOBAL_CONSTANT.NUMBER_OF_SUPER_ADMINS_ALLOWED == 'UNLIMITED' || GLOBAL_CONSTANT.NUMBER_OF_SUPER_ADMINS_ALLOWED > superAdmins.length) && (superAdmins.length !== 0)) {
                            newAdminUser.save((err, SuperAdminSaved) => {
                                if (err) return GOT_ERROR(res, err, 'Super Admin'); // ! Error 
                                if (!SuperAdminSaved) return DATA_NOT_FOUND_ERROR(res, 'Super Admin'); // ! Error  

                                return DATA_SAVED_SUCCESSFULLY(res, 'Super Admin', 'Super admin created successfully.');
                            })
                        }
                    });
                }).catch(err => GOT_ERROR(res, err, 'Super Admin'));
            }
        }
        // To create Sub-Admin
        if (!data.is_super_admin) {
            // ! Check if user is authorized to add new admin
            AdminUserModel.findById({ _id: data.creator }, (err, Admin) => {
                if (!Admin) return DATA_NOT_FOUND_ERROR(res, 'Admin'); // ! Error    
                if (!Admin.is_super_admin) return NOT_ALLOWED_ERROR(res, 'to add sub-admin'); // ! Error  

                // Multiple sub-admins are not allowed
                if (!GLOBAL_CONSTANT.MULTIPLE_SUB_ADMINS_ALLOWED) {
                    return UPGRADE_PLAN_ERROR(res, 'Sub-Admin');
                } else {
                    // Multiple sub-admins are allowed
                    AdminUserModel.find().lean().then(Admins => {
                        let subAdmins = Admins.filter(admin => !admin.is_super_admin);
                        let superAdmins = Admins.filter(admin => admin.is_super_admin);

                        // If no Super Admin available return
                        if (superAdmins.length == 0) {
                            return res.status(200).send({
                                status: GLOBAL_MESSAGES.ERROR_STATUS,
                                message: GLOBAL_MESSAGES.ERROR_CANNOT_CREATE_SUB_ADMIN_WITHOUT_SUPER_ADMIN_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                            });
                        }
                        // if there is no creator for sub admin return
                        if (!data.creator) return CONTACT_SUPER_ADMIN_ERROR(res, 'creation of Sub-Admin');

                        if (GLOBAL_CONSTANT.NUMBER_OF_SUB_ADMINS_ALLOWED != 'UNLIMITED') {
                            // Return If user already created provided numbers of sub-admins    
                            if (GLOBAL_CONSTANT.NUMBER_OF_SUB_ADMINS_ALLOWED == subAdmins.length) {
                                return UPGRADE_PLAN_ERROR(res, 'Sub-Admin');
                            }
                        }

                        if (GLOBAL_CONSTANT.NUMBER_OF_SUB_ADMINS_ALLOWED == 'UNLIMITED' || GLOBAL_CONSTANT.NUMBER_OF_SUB_ADMINS_ALLOWED > subAdmins.length) {
                            newAdminUser.save((err, SubAdminSaved) => {
                                if (err) return GOT_ERROR(res, err, 'Sub-Admin'); // ! Error 
                                if (!SubAdminSaved) return DATA_NOT_FOUND_ERROR(res, 'Sub-Admin'); // ! Error   

                                return DATA_SAVED_SUCCESSFULLY(res, 'Sub-Admin', 'Sub-Admin created successfully.');
                            })
                        }
                    }).catch(err => GOT_ERROR(res, err, 'Sub-Admin'));
                }
            })
        }
    })

}

// todo -> Method for Super & Sub Admin login
exports.adminLogin = (req, res) => {
    AdminUserModel.findOne({ email: req.body.email.toLowerCase() }).then((AdminUserData) => {
        if (!AdminUserData) return DATA_NOT_FOUND_ERROR(res, 'User'); // ! Error   

        // compare entered password with saved password
        bcrypt.compare(req.body.password, AdminUserData.password).then((response) => {
            if (response) {
                // create token
                const token = jwt.sign({ email: req.body.email, user_id: AdminUserData._id }, secret, {}) //expiresIn : '1h'
                let data = {
                    email: AdminUserData.email,
                    name: AdminUserData.name,
                    mobile_number: AdminUserData.mobile_number,
                    is_super_admin: AdminUserData.is_super_admin,
                    permissions: AdminUserData.permissions,
                }
                return res.status(200).send({
                    data: data,
                    token: token,
                    status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                    message: GLOBAL_MESSAGES.SUCCESSFULLY_LOGGED_IN_MESSAGE.replace('_LABEL_NAME', data.name)
                });
            } else {
                return res.status(200).send({
                    status: GLOBAL_MESSAGES.ERROR_STATUS,
                    message: 'Email or Password is incorrect.'
                })
            }
        })
    }).catch(err => GOT_ERROR(res, err, 'Login'));
}

// ! NOT IN USE CURRENTLY
exports.haveSuperAdmin = (req, res) => {
    AdminUserModel.find().then((AdminUserData) => {
        if (AdminUserData.length == 0) {
            res.status(200).send({
                // return false if no admin user is available
                data: false,
                status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                message: GLOBAL_MESSAGES.NOT_FOUND_MESSAGE.replace('_LABEL_NAME', 'Super-Admin')
            })
        } else {
            res.status(200).send({
                // return true if admin user is available
                data: true,
                status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                message: GLOBAL_MESSAGES.NOT_FOUND_MESSAGE.replace('_LABEL_NAME', 'Super-Admin')
            })
        }
    }).catch(err => {
        if (err) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                data: err,
                message: GLOBAL_MESSAGES.UNIDENTIFIED_ERROR_MESSAGE.replace('_LABEL_NAME', 'haveSuperAdmin() Method')
            });
        }
    })
}

// todo -> Method to get all sub-admins
exports.getSubAdmins = (req, res) => {
    let userId = req.userId;
    AdminUserModel.find({ _id: userId }).then((UserData) => {
        if (!UserData) return DATA_NOT_FOUND_ERROR(res, 'User'); // ! Error   

        AdminUserModel.find({ is_super_admin: false }).select('email name mobile_number creator permissions').then((AdminUserData) => {
            if (AdminUserData.length == 0) {
                res.status(200).send({
                    data: [], // send [] if no admin user is available
                    status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                    message: GLOBAL_MESSAGES.NOT_FOUND_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                });
            } else {
                res.status(200).send({
                    data: AdminUserData,
                    status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                    message: GLOBAL_MESSAGES.DATA_FOUND_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                });
            }
        })
    }).catch(err => GOT_ERROR(res, err, 'Sub-admins'));
}

// todo -> Method to get permissions of User
exports.getPermissionsList = (req, res) => {
    let data = req.body;

    AdminUserModel.findOne({ _id: data._id ? data._id : req.userId }).select('permissions').then((AdminUserData) => {
        if (!AdminUserData) return DATA_NOT_FOUND_ERROR(res, 'User'); // ! Error  

        return res.status(200).send({
            data: AdminUserData.permissions,
            status: GLOBAL_MESSAGES.SUCCESS_STATUS,
            message: GLOBAL_MESSAGES.DATA_FOUND_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', 'Permissions')
        });
    });
}

// todo -> Method to update permission of User
exports.updatePermissions = (req, res) => {
    AdminUserModel.findOneAndUpdate({ _id: req.body._id }, { permissions: req.body.permissions }, (err, AdminUpdated) => {
        if (err) return GOT_ERROR(res, err, 'Permission'); // ! Error 
        if (!AdminUpdated) return DATA_NOT_FOUND_ERROR(res, 'Permission'); // ! Error  

        return DATA_UPDATED_SUCCESSFULLY(res, 'Permission');
    });
}

// todo -> Method for forgot password
exports.forgotPassword = (req, res) => {
    AdminUserModel.findOne({ email: req.body.email.toLowerCase() }).then(Admin => {
        if (!Admin) return DATA_NOT_FOUND_ERROR(res, 'Email'); // ! Error  
        const resetPasswordLink = `${GLOBAL_CONSTANT.FRONT_WEBSITE_URL}/reset-password?id=${Admin._id}`

        GLOBAL_MAIL.transporter.sendMail({
            to: data.email.toLowerCase(),
            from: GLOBAL_CONSTANT.FROM_EMAIL_ADDRESS,
            subject: 'Forgot Password',
            html: GLOBAL_MAIL.RESET_PASSWORD_HTML_TEMPLATE
        }).then((mailSend) => {
            if (mailSend) {
                return DATA_SAVED_SUCCESSFULLY(res, 'Forgot Password', GLOBAL_MESSAGES.MAIL_SEND_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', 'Forgot Password'));;
            }
            return GOT_ERROR(res, new Error(GLOBAL_MESSAGES.ERROR_WHILE_MAIL_SEND_MESSAGE.replace('_LABEL_NAME', 'Forgot Password')), 'Forgot password');
        })
    });
}

// todo -> Method for Change Password
exports.changePassword = (req, res) => {
    let data = req.body;

    AdminUserModel.findOne({ _id: req.userId }).then(User => {
        if (!User) return DATA_NOT_FOUND_ERROR(res, 'User'); // ! Error  

        // return if old password do not match 
        bcrypt.compare(data.password, User.password).then((response) => {
            if (!response) {
                return res.status(200).send({
                    status: GLOBAL_MESSAGES.ERROR_STATUS,
                    message: GLOBAL_MESSAGES.PASSWORD_NOT_MATCH_ERROR_MESSAGE.replace('_LABEL_NAME', 'Old')
                })
            }

            // convert password to hash
            bcrypt.hash(data.new_password, 10).then((hash) => {
                User.password = hash;
                // save the updated user with new password
                User.save((err, PasswordUpdated) => {
                    if (err) return GOT_ERROR(res, err, 'Changing Password'); // ! Error
                    if (!PasswordUpdated) return DATA_NOT_FOUND_ERROR(res, 'User'); // ! Error  

                    // successfully updated new password
                    return DATA_SAVED_SUCCESSFULLY(res, 'Password', 'Password changed successfully.');
                })
            })
        })

    })
}

// todo -> Method for Reset Password
exports.resetPassword = (req, res) => {
    let data = req.body;
    AdminUserModel.findOne({ _id: data._id }).then((User) => {
        // convert password to hash and save updated password
        bcrypt.hash(data.password, 10).then((hash) => {
            User.password = hash;
            // save the updated user with new password
            User.save((err, PasswordUpdated) => {
                // if error occur while saving new password                
                if (err) return GOT_ERROR(res, err, 'Reset Password'); // ! Error
                if (!PasswordUpdated) return DATA_NOT_FOUND_ERROR(res, 'User'); // ! Error 

                // successfully updated new password
                return DATA_SAVED_SUCCESSFULLY(res, 'Password Reset', 'Password reset successfully.');
            })
        })
    })
}

// todo -> Method to get profile data of user
exports.getProfile = (req, res) => {
    AdminUserModel.findOne({ _id: req.body._id }).select('email name mobile_number is_super_admin creator permissions').then((User) => {
        if (!User) return DATA_NOT_FOUND_ERROR(res, 'User'); // ! Error 

        return res.status(200).send({
            status: GLOBAL_MESSAGES.SUCCESS_STATUS,
            data: User,
            message: GLOBAL_MESSAGES.DATA_FOUND_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', 'User')
        })

    })
}

// todo -> Method to update User Profile
exports.updateMyProfile = (req, res) => {
    let userId = req.userId;
    let data = req.body;

    AdminUserModel.findOne({ _id: userId }).then((AdminUserData) => {
        if (!AdminUserData) return DATA_NOT_FOUND_ERROR(res, 'User'); // ! Error 

        // if user is avilable
        AdminUserData.name = data.name;
        AdminUserData.email = data.email;
        AdminUserData.mobile_number = data.mobile_number;

        return AdminUserData.save((err, AdminUpdated) => {
            // got error while updating admin user
            if (err) return GOT_ERROR(res, err, 'Admin'); // ! Error
            if (!AdminUpdated) return DATA_NOT_FOUND_ERROR(res, 'Admin'); // ! Error 

            let data = {
                email: AdminUpdated.email,
                name: AdminUpdated.name,
                mobile_number: AdminUpdated.mobile_number,
                is_super_admin: AdminUpdated.is_super_admin,
                permissions: AdminUpdated.permissions,
            }

            // successfully updated admin
            return res.status(200).send({
                data: data,
                status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                message: GLOBAL_MESSAGES.FIELD_UPDATED_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', 'Admin')
            });
        })
    })
}