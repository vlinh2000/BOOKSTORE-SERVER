const bookModel = require("../models/book.model");
const categoryModel = require("../models/category.model");

module.exports = {
    book_getAll: async (req, res) => {
        try {
            const { page, limit } = req.query;
            let books = await bookModel.find();

            if (page && limit) {
                const totalPage = Math.ceil(books.length / limit);
                books = books.slice((page - 1) * limit, page * limit);
                res.status(200).json({ message: "Fetch success!", books, page, limit, totalPage });
            }

            res.status(200).json({ message: "Fetch success!", books });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error: error.message })
        }
    },
    book_get: async (req, res) => {
        const { bookId } = req.params;
        try {
            const book = await bookModel.findOne({ _id: bookId });
            if (!book) res.status(404).json({ message: "Book is not exists" })

            res.status(200).json({ message: "Fetch success!", book });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    book_post: async (req, res) => {
        try {
            const fakeData = {
                name: "test",
                author: "linh test",
                categoryId: "612b831051f6bdf782ac756e",
                prices: [{ color: "Red", price: "19000" }]
            }
            const category = await categoryModel.findById(categoryId);
            const bookName = await bookModel.findOne({ name: req?.name });

            if (!category) res.status(404).json({ message: "Category is not exists!" });

            if (bookName) res.status(404).json({ message: "Book already exists!" });

            const newBook = new bookModel({
                ...fakeData                            // change if run truth
            })
            await newBook.save();
            res.status(200).json({ message: "Insert a book successful!" });
        } catch (error) {
            res.status(409).json({ message: "Faild to insert book", error })
        }
    },
    book_delete: async (req, res) => {
        const { bookId } = req.params;
        try {
            const book = await bookModel.findOne({ _id: bookId });
            if (!book) res.status(404).json({ message: "Book is not exists!" });

            await bookModel.deleteOne({ _id: bookId })
            res.status(200).json({ message: "Delete a book successful!" });

        } catch (error) {
            res.status(409).json({ message: "Faild to delete book", error })
        }
    },
    book_patch: async (req, res) => {
        const { bookId } = req.params;
        try {

            const book = await bookModel.findOne({ _id: bookId });
            if (!book) res.status(404).json({ message: "Book is not exists!" });

            await bookModel.updateOne({ _id: bookId }, { $set: { ...req.body } })
            res.status(200).json({ message: "Update a book successful!" });
        } catch (error) {
            res.status(409).json({ message: "Faild to update book", error })
        }
    }
}