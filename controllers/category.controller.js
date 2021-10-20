const categoryModel = require("../models/category.model");

module.exports = {
    category_getAll: async (req, res) => {
        try {
            const categories = await categoryModel.find();
            res.status(200).json({ message: "Fetch successfully!", categories });
        } catch (error) {
            res.status(409).json({ message: "Fetch data failed", error })
        }
    },
    category_get: async (req, res) => {
        const { categoryId } = req.params;
        try {
            const category = await categoryModel.findOne({ _id: categoryId });
            res.status(200).json({ message: "Fetch successfully!", category });
        } catch (error) {
            res.status(409).json({ message: "Fetch data failed", error })
        }
    },
    category_post: async (req, res) => {
        try {
            const { name } = req.body;

            const category = await categoryModel.findOne({ name });
            if (category) return res.status(404).json({ message: "category already exists!" });

            const newCategory = new categoryModel({ name })
            await newCategory.save();

            res.status(200).json({ message: "Add new category successfully!" });

        } catch (error) {
            res.status(409).json({ message: "Add new category failed", error })
        }
    },
    category_delete: async (req, res) => {
        try {
            const { categoryId } = req.params;
            const category = await categoryModel.findOne({ _id: categoryId });
            if (!category) res.status(404).json({ message: "category does not exist!" });

            await categoryModel.deleteOne({ _id: categoryId })
            res.status(200).json({ message: "Delete category successfully!" });
        } catch (error) {
            res.status(409).json({ message: "Delete category failed", error })
        }
    },
    category_patch: async (req, res) => {
        try {
            console.log(req.body);
            const { name } = req.body;
            const { categoryId } = req.params;
            const category = await categoryModel.findOne({ _id: categoryId });
            if (!category) return res.status(404).json({ message: "category does not exist!" });

            await categoryModel.updateOne({ _id: categoryId }, { $set: { name } })
            res.status(200).json({ message: "Update category successfully!" });
        } catch (error) {
            res.status(409).json({ message: "Update category failed", error })
        }
    }
}