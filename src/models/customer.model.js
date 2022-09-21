const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}; 

const CustomerSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    mobile_number : {
        type: Number,
        validate: {
            validator: function(v) {
                return /d{10}/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        }
    },
    password : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum: {
            values: ['Active','Inactive'],
            message: '{VALUE} is not supported'
          },
        default : 'Active'
    }
})

exports.CustomerModel = mongoose.model('Customers',CustomerSchema);