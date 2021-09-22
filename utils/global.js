const axios = require('axios');

const verifyTokenSocialMedia = async (token) => {
    const user = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
    console.log(user);
}

module.exports = { verifyTokenSocialMedia }