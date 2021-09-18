const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


module.exports = {
    user_getAll: async (req, res) => {

        try {
            const users = await userModel.find();
            res.json({ message: "Fetch success!", users });
        } catch (error) {
            res.status(500).json({ message: "Faild to fetch data", error })
        }
    },
    user_get: async (req, res) => {
        const { id } = req.user;

        try {
            const user = await userModel.findOne({ _id: id });
            res.json({ message: "Fetch success!", user });
        } catch (error) {
            res.status(500).json({ message: "Faild to fetch data", error })
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

            res.status(201).json({ message: "Create a user successful!" });
        } catch (error) {
            res.status(400).json({ message: "Faild to insert user" }) // 400 that mean wrong input from client
        }
    },
    user_delete: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await userModel.findOne({ _id: userId });
            if (!user) res.status(404).json({ message: "User is not exists!" });

            await userModel.deleteOne({ _id: userId })
            res.json({ message: "Delete a user successful!" });
        } catch (error) {
            res.status(400).json({ message: "Faild to delete user" })
        }
    },
    user_patch: async (req, res) => {
        const { _id, key } = req.user;
        const { userId } = req.params;
        try {
            if (userId !== _id || key !== 0) res.json({ message: "You can only update your account" })

            const user = await userModel.findOne({ _id });
            if (!user) res.status(404).json({ message: "User is not exists!" });

            delete req.body.userName;
            if (req.body.passWord) req.body.passWord = await bcrypt.hash(req.body.passWord, 10);
            await userModel.updateOne({ _id: userId }, { $set: { ...req.body } })

            res.json({ message: "Update a user successful!" });
        } catch (error) {
            res.status(400).json({ message: "Faild to update user" })
        }
    },
    user_login: async (req, res) => {
        try {
            const user = await userModel.findOne({ userName: req.body.userName });
            console.log(req.body);

            if (!user) res.status(401).json({ message: "User is not exists" })

            const result = await bcrypt.compare(req.body.passWord, user.passWord)

            if (result) {

                const token = await jwt.sign({
                    name: user.name,
                    id: user._id,
                    key: user.key,
                    avatar: user.avatar
                }, process.env.SECRET_TOKEN, { expiresIn: '1d' });

                const refreshToken = await jwt.sign({
                    name: user.name,
                    id: user._id,
                    key: user.key,
                    avatar: user.avatar
                }, process.env.REFRESH_SECRET_TOKEN, { expiresIn: '7d' })

                return res.json({ message: 'Login successfully', token, refreshToken })

            } else {
                return res.status(400).json({ message: 'Wrong password!' })
            }

        } catch (error) {
            return res.status(400).json({ message: 'Faild to login!' })

        }
    },
    user_refresh_token: async (req, res) => {
        //handle refresh token
    }
}