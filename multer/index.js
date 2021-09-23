const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/')
    },
    filename: function (req, file, cb) {
        //format filename : avatar + id + .png /.jpeg
        cb(null, `avatar${req.user.id}.` + file.originalname.split('.')[1])
    }
})

const upload = multer({ storage })

module.exports = upload;