const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


module.exports = {
    user_getAll: async (req, res) => {

        try {
            let users = await userModel.find();
            users = users.map(user => (
                {
                    name: user.name, _id: user._id,
                    phoneNumber: user.phoneNumber,
                    avatar: user.avatar, address: user.address,
                    email: user.email,
                    key: user.key
                }));

            res.json({ message: "Fetch successfully!", users });
        } catch (error) {
            res.status(500).json({ message: "Fetch data failed", error })
        }
    },
    user_get: async (req, res) => {
        const { id } = req.user;

        try {
            const user = await userModel.findOne({ _id: id });
            res.json({ message: "Fetch successfully!", user });
        } catch (error) {
            res.status(500).json({ message: "Fetch data failed", error })
        }
    },
    user_post: async (req, res) => {

        try {
            const isUserName = await userModel.findOne({ userName: req.body.userName });
            if (isUserName) return res.status(404).json({ message: "User has already exist!" });

            const hashPassWord = await bcrypt.hash(req.body.passWord, 10);
            delete req.body.key; //when people use postman
            const newUser = new userModel({ ...req.body, passWord: hashPassWord })
            await newUser.save();
            return res.status(201).json({ message: "Add new user successful!" });
        } catch (error) {
            return res.status(400).json({ message: "Add new user failed" }) // 400 that mean wrong input from client
        }
    },
    user_delete: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await userModel.findOne({ _id: userId });
            if (!user) return res.status(404).json({ message: "User does not exist!" });

            await userModel.deleteOne({ _id: userId })
            res.json({ message: "Delete user successfully!" });
        } catch (error) {
            res.status(400).json({ message: "Delete user failed" })
        }
    },
    user_patch: async (req, res) => {

        try {

            const { id, key } = req.user;
            const { userId } = req.params;
            const avatar = req.file?.path && `${process.env.REACT_APP_API_URL}/${req.file?.path.split('\\').slice(1).join("/")}`;

            if (userId !== id || (userId !== id && key !== 0)) return res.status(404).json({ message: "You can only update your account" })

            const user = await userModel.findOne({ _id: id });
            if (!user) return res.status(404).json({ message: "User does not exist!" });

            const {
                name, email, phone, address
            } = req.body;

            const fieldValid = { name, email, phoneNumber: phone, address };
            let fieldUpdate = avatar ? { avatar } : {};

            for (let key in fieldValid) {
                if (fieldValid[key] !== undefined) fieldUpdate = { ...fieldUpdate, [key]: fieldValid[key] }
            }

            console.log(fieldUpdate);

            // if (req.body.passWord) req.body.passWord = await bcrypt.hash(req.body.passWord, 10);
            await userModel.findOneAndUpdate({ _id: userId }, { ...fieldUpdate })
            res.json({ message: "Update user successfully!" });
        } catch (error) {
            res.status(400).json({ message: "Update user faild", error: error.message })
        }
    },
    user_login: async (req, res) => {
        try {
            const user = await userModel.findOne({ userName: req.body.userName });

            if (!user) return res.status(401).json({ message: "User does not exist" })

            const result = await bcrypt.compare(req.body.passWord, user.passWord)

            if (result) {

                const token = await jwt.sign({
                    name: user.name,
                    id: user._id,
                    key: user.key,
                    avatar: user.avatar || ''
                }, process.env.SECRET_TOKEN, { expiresIn: '365d' });

                const refreshToken = await jwt.sign({
                    name: user.name,
                    id: user._id,
                    key: user.key,
                    avatar: user.avatar || ''
                }, process.env.REFRESH_SECRET_TOKEN, { expiresIn: '365d' })

                return res.json({ message: 'Login successfully', token, refreshToken })

            } else {
                return res.status(400).json({ message: 'Wrong password!' })
            }

        } catch (error) {
            return res.status(400).json({ message: 'Login failed!' })

        }
    },
    user_refresh_token: async (req, res) => {
        //handle refresh token
    }
}