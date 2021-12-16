const bookModel = require("../models/book.model");
const categoryModel = require("../models/category.model");
const feedBackModel = require("../models/feedBack.model");
const { handleDeleteFile, handleDeleteFiles } = require("../utils/fs");

const mongoose = require("mongoose");

module.exports = {
    book_getAll: async (req, res) => {
        try {
            const { _page, _limit, categoryId, bookId } = req.query;

            let books = [];
            // handle for pagination
            if (_page && _limit) {
                books = await bookModel.find({}).populate("category").exec();
                const _totalPage = Math.ceil(books.length / _limit);
                books = books.slice((_page - 1) * _limit, _page * _limit);
                return res.status(200).json({ message: "Fetch success!", books, _page, _limit, _totalPage });
            }
            // handle for related product
            if (_limit && categoryId && bookId) {
                // books = await bookModel.find({ $and: [{ categoryId: categoryId }, { _id: { $ne: bookId } }] }).limit(parseInt(_limit));
                books = await bookModel.aggregate([
                    {
                        $set: { bookId: { $toString: "$_id" }, categoryId: { $toObjectId: "$category" } }
                    },
                    {
                        $match: {
                            $expr:
                            {
                                $and: [
                                    { $eq: ["$category", categoryId] },
                                    { $ne: ["$bookId", bookId] },
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "feedbacks",
                            localField: "bookId",
                            foreignField: "bookId",
                            as: "feedBack"
                        }
                    }
                    ,
                    {
                        $lookup: {
                            from: "categories",
                            localField: "categoryId",
                            foreignField: "_id",
                            as: "category"
                        }
                    },
                    {
                        $limit: parseInt(_limit)
                    }
                ])



                return res.status(200).json({ message: "Fetch success!", books });
            }

            books = await bookModel.aggregate([
                {
                    $set: { bookId: { $toString: "$_id" }, categoryId: { $toObjectId: "$category" } }
                },
                {
                    $lookup: {
                        from: "feedbacks",
                        localField: "bookId",
                        foreignField: "bookId",
                        as: "feedBack"
                    }
                }
                ,
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "category"
                    }
                }
            ])

            res.status(200).json({ message: "Fetch success!", books });
        } catch (error) {
            res.status(409).json({ message: "Failed to fetch data", error: error.message })
        }
    },
    book_get: async (req, res) => {
        const { bookId } = req.params;
        try {
            const book = await bookModel.findOne({ _id: bookId }).populate("category").exec();
            if (!book) return res.status(404).json({ message: "Book is not exists" })

            res.status(200).json({ message: "Fetch success!", book });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    book_post: async (req, res) => {
        try {
            const {
                name, author, price,
                category, description, quantity
            } = req.body


            const hasCategory = await categoryModel.findById(category);

            if (!hasCategory) return res.status(404).json({ message: "Category is not exists!" });

            const bookName = await bookModel.findOne({ name });

            if (bookName) return res.status(404).json({ message: "Book already exists!" });

            let banner = [];
            let images = [];

            if (Object.keys(req.files).length === 2) {

                banner = req.files.banner.map(bn => bn.path);
                images = req.files.images.map(img => img.path);

            } else {
                return res.status(404).json({ message: "Lack information!" });
            }

            const newBook = new bookModel({
                name, author, category,
                description, price, stockQuantity: quantity,
                images, banner: banner[0]
            })

            await newBook.save();
            res.status(200).json({ message: "Insert a book successful!" });
        } catch (error) {
            console.log(error.message);
            res.status(409).json({ message: "Failed to insert book", error })
        }
    },
    book_delete: async (req, res) => {
        try {
            const { bookId } = req.params;
            console.log(bookId)
            const book = await bookModel.findOne({ _id: bookId });
            if (!book) return res.status(404).json({ message: "Book is not exists!" });

            await bookModel.deleteOne({ _id: bookId })
            await feedBackModel.deleteOne({ bookId })
            book.image.forEach(img => {
                handleDeleteFile(img);
            })
            return res.status(200).json({ message: "Delete a book successful!" });
        } catch (error) {
            res.status(409).json({ message: "Failed to delete book", error })
        }
    },
    book_patch: async (req, res) => {
        try {
            const { bookId } = req.params;
            let {
                name, author, price,
                category, description, quantity, fileRemove
            } = req.body

            const book = await bookModel.findOne({ _id: bookId });
            if (!book) return res.status(404).json({ message: "Book is not exists!" });


            const hasCategory = category ? await categoryModel.findById(category) : true;

            if (!hasCategory) return res.status(404).json({ message: "Category is not exists!" });

            const fieldValid = { name, author, price, category, description, stockQuantity: quantity };

            let fieldUpdate = {};

            for (let key in fieldValid) {
                if (fieldValid[key] !== undefined) fieldUpdate = { ...fieldUpdate, [key]: fieldValid[key] }
            }

            //handle images file
            let banner = [];
            let images = book.images;
            if (fileRemove) {
                fileRemove = JSON.parse(fileRemove);
                images = book.images.filter(img => !fileRemove.images?.includes(img))
            }

            if (Object.keys(req.files).length > 0) {

                if (req.files.banner?.length > 0) {
                    banner = req.files.banner.map(bn => bn.path);
                    fieldUpdate = { ...fieldUpdate, banner: banner[0] }
                }

                if (req.files.images?.length > 0) {
                    images = [...images, ...req.files.images.map(img => img.path)];
                }
            }

            fieldUpdate = images.length > 0 ? { ...fieldUpdate, images } : { ...fieldUpdate }
            await bookModel.updateOne({ _id: bookId }, { $set: { ...fieldUpdate } })


            //remove file in public 
            // if (Object.keys(fileRemove).length > 0) {
            //     for (let file in fileRemove) {
            //         console.log(file);
            //         // handleDeleteFiles(fileRemove[file]);
            //     }
            // }

            res.status(200).json({ message: "Update a book successful!" });
        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "Failed to update book", error: error.message })
        }
    }
}