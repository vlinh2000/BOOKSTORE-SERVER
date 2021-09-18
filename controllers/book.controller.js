const bookModel = require("../models/book.model");
const categoryModel = require("../models/category.model");

module.exports = {
    book_getAll: async (req, res) => {
        try {
            const { _page, _limit, categoryId, bookId } = req.query;

            let books = [];
            // handle for pagination
            if (_page && _limit) {
                books = await bookModel.find();
                const _totalPage = Math.ceil(books.length / _limit);
                books = books.slice((_page - 1) * _limit, _page * _limit);
                return res.status(200).json({ message: "Fetch success!", books, _page, _limit, _totalPage });
            }
            // handle for related product
            if (_limit && categoryId && bookId) {
                books = await bookModel.find({ $and: [{ categoryId: categoryId }, { _id: { $ne: bookId } }] }).limit(parseInt(_limit));
                return res.status(200).json({ message: "Fetch success!", books });
            }


            books = await bookModel.find();
            res.status(200).json({ message: "Fetch success!", books });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error: error.message })
        }
    },
    book_get: async (req, res) => {
        const { bookId } = req.params;
        try {
            const book = await bookModel.findOne({ _id: bookId });
            if (!book) return res.status(404).json({ message: "Book is not exists" })

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

            if (!category) return res.status(404).json({ message: "Category is not exists!" });

            if (bookName) return res.status(404).json({ message: "Book already exists!" });

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
            if (!book) return res.status(404).json({ message: "Book is not exists!" });

            await bookModel.deleteOne({ _id: bookId })
            return res.status(200).json({ message: "Delete a book successful!" });

        } catch (error) {
            res.status(409).json({ message: "Faild to delete book", error })
        }
    },
    book_patch: async (req, res) => {
        const { bookId } = req.params;
        try {

            const book = await bookModel.findOne({ _id: bookId });
            if (!book) return res.status(404).json({ message: "Book is not exists!" });

            await bookModel.updateOne({ _id: bookId }, { $set: { ...req.body } })
            res.status(200).json({ message: "Update a book successful!" });
        } catch (error) {
            res.status(409).json({ message: "Faild to update book", error })
        }
    }
}