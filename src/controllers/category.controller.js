const { CategoryModel, SubCategoryModel } = require('../models/category.model');
const { GOT_ERROR, DATA_NOT_FOUND_ERROR, DATA_SAVED_SUCCESSFULLY, DATA_UPDATED_SUCCESSFULLY, DATA_REMOVED_SUCCESSFULLY } = require('../../_global/global-request-responses');

// * ***************************
// ! IMAGE UPLOAD IS PENDING 
// * ***************************

// todo -> Method to add new Category
exports.addCategory = (req, res) => {
    let data = req.body;
    let category = new CategoryModel();
    category.name = data.name;
    category.image = data.image;
    category.sub_category = [];
    category.sizes = [];

    category.save((err, CategorySaved) => {
        if (err) {
            GOT_ERROR(res, 'category');
        }

        if (!CategorySaved) {
            DATA_NOT_FOUND_ERROR(res, 'category')
        }
        // send response of successfully saved data
        DATA_SAVED_SUCCESSFULLY(res, 'category')
    })
}

// todo -> Method to update Category
exports.updateCategory = (req, res) => {
    let data = req.body;
    CategoryModel.find({ _id: data._id }, (err, Category) => {
        Category.name = data.name;
        Category.image = data.image;
        // Category.sizes = data.sizes; // ! need logic to save sizes

        Category.save((err, CategoryUpdated) => {
            if (err) {
                GOT_ERROR(res, 'updating category');
            }

            if (!CategoryUpdated) {
                DATA_NOT_FOUND_ERROR(res, 'updated category')
            }
            // send response of successfully updated data
            DATA_UPDATED_SUCCESSFULLY(res, 'category updated')
        })
    })
}

// todo -> Method to remove Category
exports.removeCategory = (req, res) => {
    let id = req.body._id;

    CategoryModel.findByIdAndDelete(id, (err, deleted) => {
        if (err) {
            GOT_ERROR(res, 'removing category');
        } else {
            DATA_REMOVED_SUCCESSFULLY(res, 'category')
        }
    })
}

// todo -> Method to add new Sub Category
exports.addSubCategory = (req, res) => {
    let data = req.body;

    CategoryModel.findById(data.category_id, (err, CategoryData) => {
        if (err) {
            GOT_ERROR(res, 'category');
        }

        if (!CategoryData) {
            DATA_NOT_FOUND_ERROR(res, 'category')
        }

        CategoryData.sub_category.push(data.sub_category);

        CategoryData.save((err, subCategorySaved) => {
            if (err) {
                GOT_ERROR(res, 'sub category');
            }

            if (!subCategorySaved) {
                DATA_NOT_FOUND_ERROR(res, 'sub category')
            }
            // send response of successfully saved data
            DATA_SAVED_SUCCESSFULLY(res, 'sub category')
        })
    })
}

// todo -> Method to update Category
exports.updateSubCategory = (req,res) => {
    let data = req.body;
    SubCategoryModel.findById(data._id,(err,SubCategoryData) => {
        if(err){
            GOT_ERROR(res, 'category');
        }

        if(!SubCategoryData){
            DATA_NOT_FOUND_ERROR(res, 'sub category')
        }
        
        SubCategoryData.name = data.name;
        SubCategoryData.image = data.image;
        // SubCategoryData.sizes = data.sizes; // ! need logic for this

        SubCategoryData.save((err,SubCategoryUpdatedData) => {
            if(err){
                GOT_ERROR(res, 'category');
            }

            if(!SubCategoryUpdatedData){
                DATA_NOT_FOUND_ERROR(res, 'updated sub category')
            }

            // send response of successfully updated data
            DATA_UPDATED_SUCCESSFULLY(res, 'sub category updated')
        })

    })
}

// todo -> Method to remove Sub Category
exports.removeSubCategory = (req,res) => {
    let id = req.body._id;

    SubCategoryModel.findByIdAndDelete(id, (err, deleted) => {
        if (err) {
            GOT_ERROR(res, 'removing sub category');
        } else {
            DATA_REMOVED_SUCCESSFULLY(res, 'sub category')
        }
    })
}