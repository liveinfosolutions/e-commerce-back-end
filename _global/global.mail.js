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