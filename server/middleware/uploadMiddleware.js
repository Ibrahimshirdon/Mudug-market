const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

function checkFileType(file, cb) {
    // Allow all common image formats
    const filetypes = /jpg|jpeg|png|gif|bmp|webp|svg|tiff|tif|ico|heic|heif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /^image\//.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb('Images only!');
}

module.exports = upload;
