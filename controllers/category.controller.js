const categoryModel = require("../models/category.model");

module.exports = {
    category_getAll: async (req, res) => {
        try {
            const categories = await categoryModel.find();
            res.status(200).json({ message: "Fetch success!", categories });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    category_get: async (req, res) => {
        const { categoryId } = req.params;
        try {
            const category = await categoryModel.findOne({ _id: categoryId });
            res.status(200).json({ message: "Fetch success!", category });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    category_post: async (req, res) => {
        try {
            const categoryName = await categoryModel.findOne({ categoryName: req.body.categoryName });
            if (categoryName) {
                res.status(200).json({ message: "category already exists!" });
            } else {
                const newCategory = new categoryModel({ ...req.body })
                await newCategory.save();
                res.status(200).json({ message: "Insert a category successful!" });
            }
        } catch (error) {
            res.status(409).json({ message: "Faild to insert category", error })
        }
    },
    category_delete: async (req, res) => {
        const { categoryId } = req.params;
        try {
            const category = await categoryModel.findOne({ _id: categoryId });
            if (category) {
                await categoryModel.deleteOne({ _id: categoryId })
                res.status(200).json({ message: "Delete a category successful!" });
            } else {
                res.status(200).json({ message: "category already not exists!" });
            }
        } catch (error) {
            res.status(409).json({ message: "Faild to delete category", error })
        }
    },
    category_patch: async (req, res) => {
        const { categoryId } = req.params;
        try {
            const category = await categoryModel.findOne({ _id: categoryId });
            if (category) {
                await categoryModel.updateOne({ _id: categoryId }, { $set: { ...req.body } })
                res.status(200).json({ message: "Update a category successful!" });
            } else {
                res.status(200).json({ message: "category is not exists!" });
            }
        } catch (error) {
            res.status(409).json({ message: "Faild to update category", error })
        }
    }
}