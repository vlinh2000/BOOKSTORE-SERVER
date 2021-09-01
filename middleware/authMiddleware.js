const jwt = require("jsonwebtoken");

let isAuth = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (accessToken) {
        const user = await jwt.verify(accessToken, process.env.SECRECT_TOKEN);
        req.user = user;
        next();
    } else return res.status(400).json({ message: "No token provider!" })

}

const isAdmin = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (accessToken) {
        const data = await jwt.verify(accessToken, process.env.SECRECT_TOKEN);
        if (data.key !== 0) return res.status(400).json({ message: "You have not access permission!" })
        next();
    } else return res.status(400).json({ message: "No token provider!" })
}

module.exports = { isAuth, isAdmin }




