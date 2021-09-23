const { now } = require("mongoose");
const bookModel = require("../models/book.model");
const feedBackModel = require("../models/feedBack.model");

module.exports = {
    feedBack_getAll: async (req, res) => {
        try {
            const feedBackList = await feedBackModel.find();
            res.status(200).json({ message: "Fetch success!", feedBack: feedBackList });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    feedBack_get: async (req, res) => {
        const { bookId } = req.params;

        try {
            const isBook = await bookModel.findOne({ _id: bookId });
            if (!isBook) return res.status(404).json({ message: "Book does not exists!" });

            const feedBackList = await feedBackModel.findOne({ bookId: bookId });
            if (!feedBackList) return res.json({ message: "Book have not evaluated yet!" });

            res.status(200).json({ message: "Fetch success!", feedBack: feedBackList });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    feedBack_post: async (req, res) => {
        try {

            const { id, name, avatar } = req.user;
            const { voted, message, bookId } = req.body;

            const newFeedBack = {
                uid: id,
                name,
                avatar,
                voted,
                feedBackMessage: message,
                createAt: now()
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
            // res.status(409).json({ message: "Faild to feedback", error: error.message })
        }
    },
    // color_delete: async (req, res) => {
    //     const { colorId } = req.params;
    //     try {
    //         const color = await evaluatedModel.findOne({ _id: colorId });
    //         if (color) res.status(404).json({ message: "Color is not exists!" });

    //         await colorModel.deleteOne({ _id: colorId })
    //         res.status(200).json({ message: "Delete a color successful!" });
    //     } catch (error) {
    //         res.status(409).json({ message: "Faild to delete color", error })
    //     }
    // },
    // color_patch: async (req, res) => {
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