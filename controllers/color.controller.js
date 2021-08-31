const colorModel = require("../models/color.model");

module.exports = {
    color_getAll: async (req, res) => {
        try {
            const colors = await colorModel.find();
            res.status(200).json({ message: "Fetch success!", colors });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    color_get: async (req, res) => {
        const { colorId } = req.params;
        try {
            const color = await colorModel.findOne({ _id: colorId });
            res.status(200).json({ message: "Fetch success!", color });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    color_post: async (req, res) => {
        try {
            const colorName = await colorModel.findOne({ colorName: req.body.colorName });
            if (colorName) {
                res.status(200).json({ message: "Color already exists!" });
            } else {
                const newColor = new colorModel({ ...req.body })
                await newColor.save();
                res.status(200).json({ message: "Insert a color successful!" });
            }
        } catch (error) {
            res.status(409).json({ message: "Faild to insert color", error })
        }
    },
    color_delete: async (req, res) => {
        const { colorId } = req.params;
        try {
            const color = await colorModel.findOne({ _id: colorId });
            if (color) {
                await colorModel.deleteOne({ _id: colorId })
                res.status(200).json({ message: "Delete a color successful!" });
            } else {
                res.status(200).json({ message: "Color already not exists!" });
            }
        } catch (error) {
            res.status(409).json({ message: "Faild to delete color", error })
        }
    },
    color_patch: async (req, res) => {
        const { colorId } = req.params;
        try {
            const color = await colorModel.findOne({ _id: colorId });
            if (color) {
                await colorModel.updateOne({ _id: colorId }, { $set: { ...req.body } })
                res.status(200).json({ message: "Update a color successful!" });
            } else {
                res.status(200).json({ message: "Color is not exists!" });
            }
        } catch (error) {
            res.status(409).json({ message: "Faild to update color", error })
        }
    }
}