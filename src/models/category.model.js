const mongoose = require('mongoose');

// todo -> Schema for sub-category
const SubCategorySchema = mongoose.Schema({
    category : {
        type : String,
        required : true
    },
    category_id : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    sizes : [{
        type : SizeSchema,
        default : []
    }]
})

// todo -> Size for category products
const SizeSchema = mongoose.Schema({
    size : {
        type : String,
        required : true
    },
    parent : {
        type : String,
        required : true
    }
})

// todo -> Schema for category
const CategorySchema = mongoose.Schema({
    image : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    sub_category : [{
        type : SubCategorySchema,
        default : []
    }],
    sizes : [{
        type : SizeSchema,
        default : []
    }]
})

exports.CategoryModel = mongoose.model('Categories',CategorySchema);
exports.SubCategoryModel = mongoose.model('Sub_Categories',SubCategorySchema);