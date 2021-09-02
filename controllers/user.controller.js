const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


module.exports = {
    user_getAll: async (req, res) => {

        try {
            const users = await userModel.find();
            res.status(200).json({ message: "Fetch success!", users });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    user_get: async (req, res) => {
        const { id } = req.user;

        try {
            const user = await userModel.findOne({ _id: id });
            res.status(200).json({ message: "Fetch success!", user });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    user_post: async (req, res) => {

        try {
            const isUserName = await userModel.findOne({ userName: req.body.userName });
            if (isUserName) res.status(404).json({ message: "User already exists!" });

            const hashPassWord = await bcrypt.hash(req.body.passWord, 10);
            delete req.body.key; //when people use postman
            const newUser = new userModel({ ...req.body, passWord: hashPassWord })
            await newUser.save();

            res.status(200).json({ message: "Insert a user successful!" });
        } catch (error) {
            res.status(409).json({ message: "Faild to insert user", error })
        }
    },
    user_delete: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await userModel.findOne({ _id: userId });
            if (!user) res.status(404).json({ message: "User is not exists!" });

            await userModel.deleteOne({ _id: userId })
            res.status(200).json({ message: "Delete a user successful!" });
        } catch (error) {
            res.status(409).json({ message: "Faild to delete user", error })
        }
    },
    user_patch: async (req, res) => {
        const { _id, key } = req.user;
        const { userId } = req.params;
        try {
            if (userId !== _id || key !== 0) res.status(404).json({ message: "You can update your account" })

            const user = await userModel.findOne({ _id });
            if (!user) res.status(404).json({ message: "User is not exists!" });

            delete req.body.userName;
            if (req.body.passWord) req.body.passWord = await bcrypt.hash(req.body.passWord, 10);
            await userModel.updateOne({ _id: userId }, { $set: { ...req.body } })

            res.status(200).json({ message: "Update a user successful!" });
        } catch (error) {
            res.status(409).json({ message: "Faild to update user", error })
        }
    },
    user_login: async (req, res) => {
        try {
            const user = await userModel.findOne({ userName: req.body.userName });

            if (!user) res.status(404).json({ message: "User is not exists" })

            if (bcrypt.compare(req.body.passWord, user.passWord)) {

                const token = await jwt.sign({
                    name: user.name,
                    id: user._id,
                    key: user.key
                }, process.env.SECRECT_TOKEN, { expiresIn: '1d' });

                const refreshToken = await jwt.sign({
                    name: user.name,
                    id: user._id,
                    phoneNumber: user.phoneNumber
                }, process.env.REFRESH_SECRECT_TOKEN, { expiresIn: '7d' })

                return res.status(200).json({ message: 'Login successfully', token, refreshToken })

            } else {
                return res.status(404).json({ message: 'Wrong password!' })
            }

        } catch (error) {
            return res.status(500).json({ message: 'Faild to login!' })

        }
    },
    user_refresh_token: async (req, res) => {
        //handle refresh token
    }
}