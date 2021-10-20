const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/')
    },
    filename: function (req, file, cb) {

        //format filename : bookname +  .png /.jpeg
        const index = Math.ceil(Math.random() * 100000000);
        cb(null, `image${index}.` + file.mimetype.split('/')[1]);
    }
})

const upload = multer({ storage })

module.exports = upload;