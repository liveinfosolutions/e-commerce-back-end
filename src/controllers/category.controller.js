//------------------------------------------IMPORTS-------------------------------
const { CategoryModel, SubCategoryModel } = require('../models/category.model');
const {
  GOT_ERROR,
  DATA_NOT_FOUND_ERROR,
  DATA_SAVED_SUCCESSFULLY,
  DATA_UPDATED_SUCCESSFULLY,
  DATA_REMOVED_SUCCESSFULLY,
} = require('../../_global/global-request-responses');
const { DELETE_FILE } = require('../../_global/global.methods');
//---------------------------------------------------------------------------------

// * Method to add new Category
exports.addCategory = (req, res) => {
  let data = req.body;
  let category = new CategoryModel();
  category.name = data.name;
  category.image = `images/categories/${req.file.filename}`;
  category.sub_category = [];
  // category.sizes = [];  // ! need logic to save sizes

  category.save((err, CategorySaved) => {
    if (err) return GOT_ERROR(res, 'category'); // !! Error
    if (!CategorySaved) return DATA_NOT_FOUND_ERROR(res, 'category'); // !! Error

    return DATA_SAVED_SUCCESSFULLY(res, 'category');
  });
};

// * Method to update Category
exports.updateCategory = (req, res) => {
  const updatedData = req.body;
  CategoryModel.find({ _id: updatedData._id }, (err, Category) => {
    if (updatedData.image) DELETE_FILE(Category.image); // Remove old image if have new
    Category.name = updatedData.name;
    Category.image = `images/categories/${req.file.filename}`;
    // Category.sizes = updatedData.sizes; // ! need logic to save sizes

    Category.save((err, CategoryUpdated) => {
      if (err) return GOT_ERROR(res, 'updating category'); // !! Error
      if (!CategoryUpdated) return DATA_NOT_FOUND_ERROR(res, 'updated category');  // !! Error

      return DATA_UPDATED_SUCCESSFULLY(res, 'category updated');
    });
  });
};

// * Method to remove Category
exports.removeCategory = (req, res) => {
  CategoryModel.findOne({ _id: req.body._id }, (error, CategoryData) => {
    if (error) return GOT_ERROR(res, 'removing category'); // !! Error
    if (!CategoryData) return DATA_NOT_FOUND_ERROR(res, 'category'); // !! Error

    DELETE_FILE(CategoryData.image); // Remove stored category image
    CategoryModel.findByIdAndDelete(id, (err, deleted) => {
      if (err) return GOT_ERROR(res, 'removing category');  // !! Error

      return DATA_REMOVED_SUCCESSFULLY(res, 'category');
    });
  });
};

// * Method to add new Sub Category
exports.addSubCategory = (req, res) => {
  let data = req.body;

  CategoryModel.findById(data.category, (err, CategoryData) => {
    if (err) return GOT_ERROR(res, 'category'); // !! Error
    if (!CategoryData) return DATA_NOT_FOUND_ERROR(res, 'category'); // !! Error

    let subCategory = new SubCategoryModel();
    subCategory.name = data.name;
    subCategory.image = `images/sub-categories/${req.file.filename}`;
    // subCategory.sizes = [];  // ! need logic to save sizes
    subCategory.category = data.category;

    subCategory.save((err, subCategorySaved) => {
      if (err) return GOT_ERROR(res, 'sub category'); // !! Error
      if (!subCategorySaved) return DATA_NOT_FOUND_ERROR(res, 'sub category'); // !! Error

      return DATA_SAVED_SUCCESSFULLY(res, 'sub category');
    });
  });
};

// * Method to update Category
exports.updateSubCategory = (req, res) => {
  let updatedData = req.body;
  SubCategoryModel.findById(updatedData._id, (err, SubCategoryData) => {
    if (err) return GOT_ERROR(res, 'category'); // !! Error
    if (!SubCategoryData) return DATA_NOT_FOUND_ERROR(res, 'sub category'); // !! Error
    if (updatedData.image) DELETE_FILE(SubCategoryData.image); // Remove old image if have new

    SubCategoryData.name = updatedData.name;
    SubCategoryData.image = `images/sub-categories/${req.file.filename}`;
    // SubCategoryData.sizes = updatedData.sizes; // ! need logic for this

    SubCategoryData.save((err, SubCategoryUpdatedData) => {
      if (err) return GOT_ERROR(res, 'category'); // !! Error
      if (!SubCategoryUpdatedData) return DATA_NOT_FOUND_ERROR(res, 'updated sub category'); // !! Error

      return DATA_UPDATED_SUCCESSFULLY(res, 'sub-category updated');
    });
  });
};

// * Method to remove Sub Category
exports.removeSubCategory = (req, res) => {
  let id = req.body._id;
  SubCategoryModel.findOne({ _id: req.body._id }, (error, subCategoryData) => {
    if (error) return GOT_ERROR(res, 'removing sub-category'); // !! Error
    if (!CategoryData) return DATA_NOT_FOUND_ERROR(res, 'sub-category'); // !! Error

    DELETE_FILE(subCategoryData.image); // Remove stored sub-category image
    SubCategoryModel.findByIdAndDelete(id, (err, deleted) => {
      if (err) return GOT_ERROR(res, 'removing sub category'); // !! Error

      return DATA_REMOVED_SUCCESSFULLY(res, 'sub category');
    });
  });
};
