const mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');


// SCHEMA FOR ADMIN USERS
const PermissionsSchema = mongoose.Schema({
    component : {
        type : String,
        required : true
    },
    route : {
        type : String,
        required : true
    },
    create_action : {
        type : Boolean,
        required : true,
        default : false
    },
    update_action : {
        type : Boolean,
        required : true,
        default : false
    },
    read_action : {
        type : Boolean,
        required : true,
        default : false
    },
    delete_action : {
        type : Boolean,
        required : true,
        default : false
    }
})

const AdminUserSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type:String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    mobile_number : {
        type : String,
        required : true
    },
    is_super_admin : {
        type : Boolean,
        required : true,
        default : false
    },
    creator : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AdminUser',
        required: false,
        default : null
    },
    permissions : [{
        type : PermissionsSchema,
        default : []
    }]
})

AdminUserSchema.plugin(uniqueValidator, { message: 'Email address is already used.' })
exports.AdminUserModel = mongoose.model('AdminUser',AdminUserSchema);

// SCHEMA FOR SELLER USERS


// SCHEMA OF CUSTOMER USERS


