var admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'bookstore-293d8',
});




module.exports = admin;