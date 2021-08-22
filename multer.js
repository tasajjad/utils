const multer = require('multer');
const path = require('path');

const finalPath = path.join(`${__dirname}/../../uploads/students/`);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, finalPath)
    },
    filename: function (req, file, cb) {
        console.log(file)
        const extention = path.extname(file.originalname)
        const fileName = file.originalname.replace(extention, "")
            .toLocaleLowerCase()
            .split(" ")
            .join("-")

        cb(null, +  Date.now() + "--" + fileName + extention)


    }
})


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: (req, file, cb) => {

        if (file.mimetype === 'image/jpeg'
            || file.mimetype === 'image/jpg'
            || file.mimetype === 'image/png') {
            cb(null)
        } else {
            cb(new Error('Only .jpg .jpeg .png formatm supported'))
        }
    }
})


module.exports = upload;