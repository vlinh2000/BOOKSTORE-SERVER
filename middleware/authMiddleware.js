
let isAuth = async (req, res, next) => {

    const accessToken = req.headers.authorization?.split(' ')[1] || null;
    console.log(accessToken);


    next();
}

module.exports = { isAuth }




