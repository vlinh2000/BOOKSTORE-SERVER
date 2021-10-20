const admin = require("../firebase/config");
const jwt = require("jsonwebtoken");

let isAuth = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (accessToken) {
        jwt.verify(accessToken, process.env.SECRET_TOKEN, async (err, decoded) => {
            if (err) {
                const { uid, name, picture } = await admin.auth().verifyIdToken(accessToken);
                req.user = { id: uid, name, avatar: picture, key: 1 };
                next();
                return;
            }
            req.user = decoded;
            next();
        })
        // return res.status(400).json({ message: "Token expired!" })
    } else return res.status(400).json({ message: "No token provider!" })

}

const isAdmin = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (accessToken) {
        try {
            const data = await jwt.verify(accessToken, process.env.SECRET_TOKEN);
            if (data.key !== 0) return res.status(400).json({ message: "You have not access permission!" })
            next();
        } catch (error) {
            return res.status(400).json({ message: "Token expired!" })
        }
    } else return res.status(400).json({ message: "No token provider!" })
}

module.exports = { isAuth, isAdmin }




