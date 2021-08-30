const bookModel = require("../models/book.model");

module.exports = {
    book_getAll: async (req, res) => {
        try {
            const books = await bookModel.find();
            res.status(200).json({ message: "Fetch success!", books });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    book_get: async (req, res) => {
        const { bookId } = req.params;
        try {
            const book = await bookModel.findOne({ _id: bookId });
            res.status(200).json({ message: "Fetch success!", book });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    book_post: async (req, res) => {
        try {
            const bookName = await bookModel.findOne({ name: req?.name });
            if (bookName) {
                res.status(200).json({ message: "Book already exists!" });
            } else {
                const newBook = new bookModel({
                    ...req.body
                })
                await newBook.save();
                res.status(200).json({ message: "Insert a book successful!" });
            }
        } catch (error) {
            res.status(409).json({ message: "Faild to insert book", error })
        }
    },
    book_delete: async (req, res) => {
        const { bookId } = req.params;
        try {
            const book = await bookModel.findOne({ _id: bookId });
            if (book) {
                await bookModel.deleteOne({ _id: bookId })
                res.status(200).json({ message: "Delete a book successful!" });
            } else {
                res.status(200).json({ message: "Book is not exists!" });
            }
        } catch (error) {
            res.status(409).json({ message: "Faild to delete book", error })
        }
    },
    book_patch: async (req, res) => {
        const { bookId } = req.params;
        console.log(bookId)
        try {
            const book = await bookModel.findOne({ _id: bookId });
            if (book) {
                await bookModel.updateOne({ _id: bookId }, { $set: { ...req.body } })
                res.status(200).json({ message: "Update a book successful!" });
            } else {
                res.status(200).json({ message: "Book is not exists!" });
            }
        } catch (error) {
            res.status(409).json({ message: "Faild to update book", error })
        }
    }
}