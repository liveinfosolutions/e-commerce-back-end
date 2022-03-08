exports.WEBSITE_DOMAIN_NAME = 'Live Info Solutions';
exports.FRONT_WEBSITE_URL = 'http://localhost:4200';

// Multiple super admins are allowed or not
exports.MULTIPLE_SUPER_ADMINS_ALLOWED = true;
exports.NUMBER_OF_SUPER_ADMINS_ALLOWED = 2 // (Number || UNLIMITED)
// Multiple sub-admins are allowed or not
exports.MULTIPLE_SUB_ADMINS_ALLOWED = true;
exports.NUMBER_OF_SUB_ADMINS_ALLOWED = 2 // (Number || UNLIMITED)

//----------------------------------------------------------------------------------
// Permissions Component
//----------------------------------------------------------------------------------
exports.PERMISSIONS = [
    'roles-management'
];


//----------------------------------------------------------------------------------
// MESSAGES *Use _LABEL_NAME to replace with pre-specified labels
//----------------------------------------------------------------------------------
exports.SUCCESS_STATUS = 'success';
exports.ERROR_STATUS = 'error';

exports.UPGRADE_PLAN_ERROR_MESSAGE = 'Please upgrade your plan to create more _LABEL_NAME.'
exports.ERROR_WHILE_SAVING_MESSAGE = 'Got error while saving _LABEL_NAME';
exports.SAVED_DATA_NOT_FOUND_ERROR_MESSAGE = '_LABEL_NAME data not found';
exports.SUCCESSFULLY_SAVED_MESSAGE = '_LABEL_NAME saved successfully';
exports.SUCCESSFULLY_LOGGED_IN_MESSAGE = '_LABEL_NAME logged In successfully';
exports.PASSWORD_NOT_MATCH_ERROR_MESSAGE = '_LABEL_NAME password did not match';
exports.NOT_AUTHORIZED_USER_ERROR_MESSAGE = 'NOT Authorized';
exports.NOT_FOUND_MESSAGE = '_LABEL_NAME not found';
exports.DATA_FOUND_SUCCESSFULLY_MESSAGE = '_LABEL_NAME found successfully';
exports.UNIDENTIFIED_ERROR_MESSAGE = 'got error in _LABEL_NAME';
exports.FIELD_UPDATED_SUCCESSFULLY_MESSAGE = '_LABEL_NAME updated successfully'
exports.ERROR_WHILE_UPDATING_MESSAGE = 'Got error while updating _LABEL_NAME';
exports.ERROR_CANNOT_CREATE_SUB_ADMIN_WITHOUT_SUPER_ADMIN = 'At least one super admin is requried to create sub admin';
exports.ERROR_PROVIDE_CREATOR_OF_SUB_ADMIN = 'Please provide creator for sub admin'
exports.MAIL_SEND_SUCCESSFULLY = '_LABEL_NAME mail send successfully';
exports.ERROR_WHILE_MAIL_SEND = 'Error occued while sending _LABEL_NAME mail.';
exports.CONTACT_SUPER_ADMIN_ERROR_MESSAGE = 'Contact you super admin for _LABEL_NAME';

//----------------------------------------------------------------------------------
// For Sending E-mails
//----------------------------------------------------------------------------------
const nodemailer = require('nodemailer');
exports.FROM_EMAIL_ADDRESS = 'amitsharma661124@gmail.com';
exports.transporter = nodemailer.createTransport({
    service : 'gmail',
    auth: {
        user: 'amitsharma661124@gmail.com', // generated ethereal user
        pass: 'loveupapa5210', // generated ethereal password
    }
}
);


