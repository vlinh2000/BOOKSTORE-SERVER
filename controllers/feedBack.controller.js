const { now } = require("mongoose");
const bookModel = require("../models/book.model");
const feedBackModel = require("../models/feedBack.model");

module.exports = {
    feedBack_getAll: async (req, res) => {
        try {
            const feedBackList = await feedBackModel.find().populate('comments.user', "name key avatar");

            res.status(200).json({ message: "Fetch success!", feedBack: feedBackList });
        } catch (error) {
            console.log(error.message)
            res.status(409).json({ message: "Fetch feed back failed", error: error.message })
        }
    },
    feedBack_get: async (req, res) => {
        const { bookId } = req.params;

        try {
            const isBook = await bookModel.findOne({ _id: bookId });
            if (!isBook) return res.status(404).json({ message: "Book does not exists!" });

            const feedBackList = await feedBackModel.findOne({ bookId: bookId }).populate('comments.user', "name key avatar");
            if (!feedBackList) return res.json({ message: "Book have not feed back yet!" });

            res.status(200).json({ message: "Fetch success!", feedBack: feedBackList });
        } catch (error) {
            console.log(error.message)
            res.status(409).json({ message: "Fetch feed back failed", error })
        }
    },
    feedBack_post: async (req, res) => {
        try {

            const { id } = req.user;
            const { voted, message, bookId } = req.body;

            const newFeedBack = {
                user: id,
                voted,
                message,
                createAt: Date.now()
            };

            const currentBookFeedBack = await feedBackModel.findOne({ bookId: bookId });
            if (!currentBookFeedBack) {
                const newFeedBackOnBook = new feedBackModel({
                    bookId,
                    comments: [newFeedBack]
                });
                await newFeedBackOnBook.save();
            } else {
                await feedBackModel.updateOne({ bookId: bookId }, { $push: { comments: newFeedBack } });
            }
            res.status(200).json({ message: "Thanks for your feedback!" });

        } catch (error) {
            console.log(error.message);
            res.status(409).json({ message: "Post feed back failed", error: error.message })
        }
    },
    // feedBack_delete: async (req, res) => {
    //     const { bookId } = req.params;
    //     try {
    //         const color = await evaluatedModel.findOne({ _id: colorId });
    //         if (color) res.status(404).json({ message: "Color is not exists!" });

    //         await colorModel.deleteOne({ _id: colorId })
    //         res.status(200).json({ message: "Delete a color successful!" });
    //     } catch (error) {
    //         res.status(409).json({ message: "Faild to delete color", error })
    //     }
    // },
    // feedBack_patch: async (req, res) => {
    //     const { colorId } = req.params;
    //     try {
    //         const color = await colorModel.findOne({ _id: colorId });
    //         if (!color) res.status(404).json({ message: "Color is not exists!" });

    //         await colorModel.updateOne({ _id: colorId }, { $set: { ...req.body } })
    //         res.status(200).json({ message: "Update a color successful!" });
    //     } catch (error) {
    //         res.status(409).json({ message: "Faild to update color", error })
    //     }
    // }
}