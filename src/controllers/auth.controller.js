'use strict'
const { AdminUserModel } = require('../models/auth.model');
const { secret } = require('../config/auth.config');
const GLOBAL_CONSTANT = require('../../_global/global');
const GLOBAL_MESSAGES = require('../../_global/global.messages')
const GLOBAL_MAIL = require('../../_global/global.mail')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// todo -> Method for Super & Sub Admin signup
exports.adminSignup = (req, res) => {
    let data = req.body;
    if (req.userId) {
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
            // Multiple Super Admins are not allowed
            if (!GLOBAL_CONSTANT.MULTIPLE_SUPER_ADMINS_ALLOWED) {
                return res.status(200).send({
                    status: GLOBAL_MESSAGES.ERROR_STATUS,
                    message: GLOBAL_MESSAGES.UPGRADE_PLAN_ERROR_MESSAGE.replace('_LABEL_NAME', 'Super Admin')
                });
            } else {
                // Multiple Super Admins are allowed
                AdminUserModel.find({ is_super_admin: true }).lean().then(superAdmins => {
                    // Create Root Super Admin
                    if (superAdmins.length == 0) {
                        // save new super admin user
                        newAdminUser.save((err, SuperAdminSaved) => {
                            // got error while saving super admin user
                            if (err) {
                                return res.status(200).send({
                                    status: GLOBAL_MESSAGES.ERROR_STATUS,
                                    data: err,
                                    message: GLOBAL_MESSAGES.ERROR_WHILE_SAVING_MESSAGE.replace('_LABEL_NAME', 'Super Admin')
                                });
                            }
                            // data of saved super admin user not found
                            if (!SuperAdminSaved) {
                                return res.status(200).send({
                                    status: GLOBAL_MESSAGES.ERROR_STATUS,
                                    message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'Super Admin')
                                });
                            }
                            // successfully saved super admin
                            return res.status(200).send({
                                status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                                message: GLOBAL_MESSAGES.SUCCESSFULLY_SAVED_MESSAGE.replace('_LABEL_NAME', 'Super Admin')
                            });
                        })
                    }
                    // ! Check if user is authorized to add new admin
                    AdminUserModel.findById({_id : data.creator},(err,Admin)=>{                
                        if(!Admin){
                            return res.status(200).send({
                                status : GLOBAL_MESSAGES.ERROR_STATUS,
                                data : Admin,
                                message : GLOBAL_MESSAGES.NOT_FOUND_MESSAGE.replace('_LABEL_NAME', 'Admin')
                            })
                        }
        
                        if(!Admin.is_super_admin){
                            return res.status(200).send({
                                status : GLOBAL_MESSAGES.ERROR_STATUS,
                                message : GLOBAL_MESSAGES.NOT_AUTHORIZED_USER_ERROR_MESSAGE.replace('_LABEL_NAME', 'to add sub-admins')
                            })
                        }
                        
                        // If have super Admin and creator is not provided
                        if (superAdmins.length > 0 && !data.creator) {
                            return res.status(200).send({
                                status: GLOBAL_MESSAGES.ERROR_STATUS,
                                message: GLOBAL_MESSAGES.CONTACT_SUPER_ADMIN_ERROR_MESSAGE.replace('_LABEL_NAME', 'another super admin creation')
                            });
                        }
    
                        // Other Super Admin if Unlimited Provided Super Admin
                        if (GLOBAL_CONSTANT.NUMBER_OF_SUPER_ADMIN_ALLOWED != 'UNLIMITED') {
                            // Return If user already created provided numbers of super admins
                            if (GLOBAL_CONSTANT.NUMBER_OF_SUPER_ADMINS_ALLOWED == superAdmins.length) {
                                return res.status(200).send({
                                    status: GLOBAL_MESSAGES.ERROR_STATUS,
                                    message: GLOBAL_MESSAGES.UPGRADE_PLAN_ERROR_MESSAGE.replace('_LABEL_NAME', 'Super Admin')
                                });
                            }
                        }
                        // Other Super Admin if Numbers of Super Admins Provided
                        if ((GLOBAL_CONSTANT.NUMBER_OF_SUPER_ADMINS_ALLOWED == 'UNLIMITED' || GLOBAL_CONSTANT.NUMBER_OF_SUPER_ADMINS_ALLOWED > superAdmins.length) && (superAdmins.length != 0)) {
                            // save new super admin user
                            newAdminUser.save((err, SuperAdminSaved) => {
                                // got error while saving super admin user
                                if (err) {
                                    return res.status(200).send({
                                        status: GLOBAL_MESSAGES.ERROR_STATUS,
                                        data: err,
                                        message: GLOBAL_MESSAGES.ERROR_WHILE_SAVING_MESSAGE.replace('_LABEL_NAME', 'Super Admin')
                                    });
                                }
                                // data of saved super admin user not found
                                if (!SuperAdminSaved) {
                                    return res.status(200).send({
                                        status: GLOBAL_MESSAGES.ERROR_STATUS,
                                        message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'Super Admin')
                                    });
                                }
                                // successfully saved super admin
                                return res.status(200).send({
                                    status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                                    message: GLOBAL_MESSAGES.SUCCESSFULLY_SAVED_MESSAGE.replace('_LABEL_NAME', 'Super Admin')
                                });
                            })
                        }
                    });
                }).catch(err => {
                    if (err) {
                        return res.status(200).send({
                            status: GLOBAL_MESSAGES.ERROR_STATUS,
                            data: err,
                            message: GLOBAL_MESSAGES.UNIDENTIFIED_ERROR_MESSAGE.replace('_LABEL_NAME', 'adminSignup() Method *comment - Multiple Super Admins are allowed')
                        });
                    }
                })
            }
        }
        // To create Sub-Admin
        if (!data.is_super_admin) {
            // ! Check if user is authorized to add new admin
            AdminUserModel.findById({_id : data.creator},(err,Admin)=>{                
                if(!Admin){
                    return res.status(200).send({
                        status : GLOBAL_MESSAGES.ERROR_STATUS,
                        data : Admin,
                        message : GLOBAL_MESSAGES.NOT_FOUND_MESSAGE.replace('_LABEL_NAME', 'Admin')
                    })
                }

                if(!Admin.is_super_admin){
                    return res.status(200).send({
                        status : GLOBAL_MESSAGES.ERROR_STATUS,
                        message : GLOBAL_MESSAGES.NOT_AUTHORIZED_USER_ERROR_MESSAGE.replace('_LABEL_NAME', 'to add sub-admins')
                    })
                }

                // Multiple sub-admins are not allowed
                if (!GLOBAL_CONSTANT.MULTIPLE_SUB_ADMINS_ALLOWED) {
                    return res.status(200).send({
                        status: GLOBAL_MESSAGES.ERROR_STATUS,
                        message: GLOBAL_MESSAGES.UPGRADE_PLAN_ERROR_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                    });
                } else {
                    // Multiple sub-admins are allowed
                    AdminUserModel.find().lean().then(Admins => {
                        let subAdmins = [];
                        let superAdmins = [];
    
                        for (let admin of Admins) {
                            // if super admin then add to superAdmins
                            if (admin.is_super_admin) {
                                superAdmins.push(admin)
                            } else { // add to subAdmins
                                subAdmins.push(admin)
                            }
                        }
    
                        // If no Super Admin available return
                        if (superAdmins.length == 0) {
                            return res.status(200).send({
                                status: GLOBAL_MESSAGES.ERROR_STATUS,
                                message: GLOBAL_MESSAGES.ERROR_CANNOT_CREATE_SUB_ADMIN_WITHOUT_SUPER_ADMIN_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                            });
                        }
    
                        // if there is no creator for sub admin return
                        if (!data.creator) {
                            return res.status(200).send({
                                status: GLOBAL_MESSAGES.ERROR_STATUS,
                                message: GLOBAL_MESSAGES.CONTACT_SUPER_ADMIN_ERROR_MESSAGE.replace('_LABEL_NAME', 'creation of Sub-Admin')
                            });
                        }
    
                        if (GLOBAL_CONSTANT.NUMBER_OF_SUB_ADMINS_ALLOWED != 'UNLIMITED') {
                            // Return If user already created provided numbers of sub-admins    
                            if (GLOBAL_CONSTANT.NUMBER_OF_SUB_ADMINS_ALLOWED == subAdmins.length) {
                                return res.status(200).send({
                                    status: GLOBAL_MESSAGES.ERROR_STATUS,
                                    message: GLOBAL_MESSAGES.UPGRADE_PLAN_ERROR_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                                });
                            }
                        }
    
                        if (GLOBAL_CONSTANT.NUMBER_OF_SUB_ADMINS_ALLOWED == 'UNLIMITED' || GLOBAL_CONSTANT.NUMBER_OF_SUB_ADMINS_ALLOWED > subAdmins.length) {
                            // save new sub-admin user
                            newAdminUser.save((err, SubAdminSaved) => {
                                // got error while saving super admin user
                                if (err) {
                                    return res.status(200).send({
                                        status: GLOBAL_MESSAGES.ERROR_STATUS,
                                        data: err,
                                        message: GLOBAL_MESSAGES.ERROR_WHILE_SAVING_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                                    });
                                }
                                // data of saved sub-admin user not found
                                if (!SubAdminSaved) {
                                    return res.status(200).send({
                                        status: GLOBAL_MESSAGES.ERROR_STATUS,
                                        message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                                    });
                                }
                                // successfully saved sub-admin
                                return res.status(200).send({
                                    status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                                    message: GLOBAL_MESSAGES.SUCCESSFULLY_SAVED_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                                });
                            })
                        }
                    }).catch(err => {
                        if (err) {
                            return res.status(200).send({
                                status: GLOBAL_MESSAGES.ERROR_STATUS,
                                data: err,
                                message: GLOBAL_MESSAGES.UNIDENTIFIED_ERROR_MESSAGE.replace('_LABEL_NAME', 'adminSignup() Method *comment - Multiple sub-admins are allowed')
                            });
                        }
                    })
                }
            })
        }
    })

}

// todo -> Method for Super & Sub Admin login
exports.adminLogin = (req, res) => {
    AdminUserModel.findOne({ email: req.body.email.toLowerCase() }).then((AdminUserData) => {
        // if user NOT FOUND
        if (!AdminUserData) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'User')
            });
        }

        // compare entered password with saved password
        bcrypt.compare(req.body.password, AdminUserData.password).then((response) => {
            if (response) {
                // create token
                const token = jwt.sign({ email: req.body.email, user_id: AdminUserData._id }, secret, {})//expiresIn : '1h'
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
                    message: GLOBAL_MESSAGES.PASSWORD_NOT_MATCH_ERROR_MESSAGE.replace('_LABEL_NAME', 'Login')
                })
            }
        })
    }).catch(err => {
        if (err) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                data: err,
                message: GLOBAL_MESSAGES.UNIDENTIFIED_ERROR_MESSAGE.replace('_LABEL_NAME', 'adminLogin() Method')
            });
        }
    })
}

// NOT IN USE CURRENTLY
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
        if (!UserData) {
            res.status(200).send({
                data: [],
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                message: GLOBAL_MESSAGES.NOT_FOUND_MESSAGE.replace('_LABEL_NAME', 'User Not found')
            })
        }

        AdminUserModel.find({ is_super_admin: false }).select('email name mobile_number creator permissions').then((AdminUserData) => {
            if (AdminUserData.length == 0) {
                res.status(200).send({
                    // return [] if no admin user is available
                    data: [],
                    status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                    message: GLOBAL_MESSAGES.NOT_FOUND_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                })
            } else {
                res.status(200).send({
                    data: AdminUserData,
                    status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                    message: GLOBAL_MESSAGES.DATA_FOUND_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', 'Sub-Admin')
                })
            }
        }).catch(err => {
            if (err) {
                return res.status(200).send({
                    status: GLOBAL_MESSAGES.ERROR_STATUS,
                    data: err,
                    message: GLOBAL_MESSAGES.UNIDENTIFIED_ERROR_MESSAGE.replace('_LABEL_NAME', 'getSubAdmins() Method 1')
                });
            }
        })
    }).catch(err => {
        if (err) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                data: err,
                message: GLOBAL_MESSAGES.UNIDENTIFIED_ERROR_MESSAGE.replace('_LABEL_NAME', 'getSubAdmins() Method 2')
            });
        }
    })
}

// todo -> Method to get permissions of User
exports.getPermissionsList = (req, res) => {
    let data = req.body;

    AdminUserModel.findOne({ _id: data._id ? data._id : req.userId }).select('permissions').then((AdminUserData) => {
        // if user NOT FOUND
        if (!AdminUserData) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'User')
            });
        }

        if (AdminUserData) {
            return res.status(200).send({
                data: AdminUserData.permissions,
                status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                message: GLOBAL_MESSAGES.DATA_FOUND_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', 'Permissions')
            });
        }
    });
}

// todo -> Method to update permission of User
exports.updatePermissions = (req, res) => {
    let data = req.body;

    // Update the Admin
    AdminUserModel.findOneAndUpdate({ _id: data._id }, { permissions: data.permissions }, (err, AdminUpdated) => {
        // got error while updating admin user
        if (err) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                data: err,
                message: GLOBAL_MESSAGES.ERROR_WHILE_UPDATING_MESSAGE.replace('_LABEL_NAME', 'Permission')
            });
        }
        // data of saved admin user not found
        if (!AdminUpdated) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'Permission')
            });
        }
        // successfully updated admin
        return res.status(200).send({
            status: GLOBAL_MESSAGES.SUCCESS_STATUS,
            message: GLOBAL_MESSAGES.FIELD_UPDATED_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', 'Permission')
        });
    })
}

// todo -> Method for forgot password
exports.forgotPassword = (req, res) => {
    let data = req.body;
    AdminUserModel.findOne({ email: data.email.toLowerCase() }).then(Admin => {
        // if admin NOT FOUND
        if (!Admin) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'Email')
            });
        } else {
            let resetPasswordLink = `${GLOBAL_CONSTANT.FRONT_WEBSITE_URL}/reset-password?id=${Admin._id}`
            GLOBAL_MAIL.transporter.sendMail({
                to: data.email.toLowerCase(),
                from: GLOBAL_CONSTANT.FROM_EMAIL_ADDRESS,
                subject: 'Forgot Password',
                html: `
                <!doctype html>
                <html lang="en-US">
                
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Reset Password</title>
                    <meta name="description" content="Reset Password.">
                    <style type="text/css">
                        a:hover {text-decoration: underline !important;}
                    </style>
                </head>
                
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <!--100% body table-->
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,200,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <h1 style="color:#1e1e2d; font-weight:200; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                            requested to reset your password</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                            We cannot simply send you your old password. A unique link to reset your
                                                            password has been generated for you. To reset your password, click the
                                                            following link and follow the instructions.
                                                        </p>
                                                        <a href="${resetPasswordLink}" target="_blank"
                                                            style="background:#20e277;text-decoration:none !important; font-weight:200; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                            Password</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>${GLOBAL_CONSTANT.WEBSITE_DOMAIN_NAME}</strong></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!--/100% body table-->
                </body>
                
                </html>    
                `
            }).then((mailSend) => {
                if (mailSend) {
                    return res.status(200).send({
                        status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                        message: GLOBAL_MESSAGES.MAIL_SEND_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', 'Forgot Password')
                    });
                } else {
                    return res.status(200).send({
                        status: GLOBAL_MESSAGES.ERROR_STATUS,
                        message: GLOBAL_MESSAGES.ERROR_WHILE_MAIL_SEND_MESSAGE.replace('_LABEL_NAME', 'Forgot Password')
                    });
                }
            })
        }
    })
}

// todo -> Method for Change Password
exports.changePassword = (req, res) => {
    let data = req.body;
    let userId = req.userId;

    AdminUserModel.findOne({ _id: userId }).then(User => {
        // return if user not found
        if (!User) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'User')
            });
        }
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
                    // if error occur while saving new password
                    if (err) {
                        return res.status(200).send({
                            status: GLOBAL_MESSAGES.ERROR_STATUS,
                            message: GLOBAL_MESSAGES.ERROR_WHILE_SAVING_MESSAGE.replace('_LABEL_NAME', 'Changing Password')
                        })
                    }
                    // if updated user data not found
                    if (!PasswordUpdated) {
                        return res.status(200).send({
                            status: GLOBAL_MESSAGES.ERROR_STATUS,
                            message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'User')
                        });
                    }
                    // successfully updated new password
                    return res.status(200).send({
                        status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                        message: GLOBAL_MESSAGES.SUCCESSFULLY_SAVED_MESSAGE.replace('_LABEL_NAME', 'Password')
                    })
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
                if (err) {
                    return res.status(200).send({
                        status: GLOBAL_MESSAGES.ERROR_STATUS,
                        message: GLOBAL_MESSAGES.ERROR_WHILE_SAVING_MESSAGE.replace('_LABEL_NAME', 'Reset Password')
                    })
                }
                // if updated user data not found
                if (!PasswordUpdated) {
                    return res.status(200).send({
                        status: GLOBAL_MESSAGES.ERROR_STATUS,
                        message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'User')
                    });
                }
                // successfully updated new password
                return res.status(200).send({
                    status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                    message: GLOBAL_MESSAGES.SUCCESSFULLY_SAVED_MESSAGE.replace('_LABEL_NAME', 'Password Reset')
                })
            })
        })
    })
}

// todo -> Method to get profile data of user
exports.getProfile = (req, res) => {
    AdminUserModel.findOne({ _id: req.body._id }).select('email name mobile_number is_super_admin creator permissions').then((User) => {
        // if User NOT FOUND
        if (!User) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'User')
            });
        } else {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.SUCCESS_STATUS,
                data: User,
                message: GLOBAL_MESSAGES.DATA_FOUND_SUCCESSFULLY_MESSAGE.replace('_LABEL_NAME', 'User')
            })
        }
    })
}

// todo -> Method to update User Profile
exports.updateMyProfile = (req, res) => {
    let userId = req.userId;
    let data = req.body;
    console.log(userId)

    AdminUserModel.findOne({ _id: userId }).then((AdminUserData) => {
        // if user NOT FOUND
        if (!AdminUserData) {
            return res.status(200).send({
                status: GLOBAL_MESSAGES.ERROR_STATUS,
                message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'User')
            });
        }

        // if user is avilable
        AdminUserData.name = data.name;
        AdminUserData.email = data.email;
        AdminUserData.mobile_number = data.mobile_number;

        return AdminUserData.save((err, AdminUpdated) => {
            // got error while updating admin user
            if (err) {
                return res.status(200).send({
                    status: GLOBAL_MESSAGES.ERROR_STATUS,
                    data: err,
                    message: GLOBAL_MESSAGES.ERROR_WHILE_UPDATING_MESSAGE.replace('_LABEL_NAME', 'Admin')
                });
            }
            // data of saved admin user not found
            if (!AdminUpdated) {
                return res.status(200).send({
                    status: GLOBAL_MESSAGES.ERROR_STATUS,
                    message: GLOBAL_MESSAGES.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE.replace('_LABEL_NAME', 'Admin')
                });
            }
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