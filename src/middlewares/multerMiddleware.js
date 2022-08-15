const path = require('path');
const multer = require ('multer'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/public/images');

    },

    filename: (req, file, cb) => {
        cb (null, file.originalname)
        //let filename = `${}`
    }
})

const uploadFile = multer({ storage: storage })

module.exports = uploadFile;
