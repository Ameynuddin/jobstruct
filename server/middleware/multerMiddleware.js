const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists
// const ensureDirExists = (dir) => {
//     if (!fs.existsSync(dir)) {
//         console.log('Upload directory does not exist, creating...');
//         fs.mkdirSync(dir, { recursive: true });
//     } else {
//         console.log('Directory already exists');
//     }
// };

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // Determine the directory based on the request
//         let uploadDir;
//         if (req.body.type === 'profile') {
//             uploadDir = path.join(__dirname, '../profile');
//         } else {
//             uploadDir = path.join(__dirname, '../uploads');
//         }

//         // Ensure the directory exists
//         ensureDirExists(uploadDir);
//         cb(null, uploadDir);
//     },

//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now();
//         cb(null, uniqueSuffix + file.originalname);
//     }
// });

// Storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now();
//         cb(null, uniqueSuffix + file.originalname);
//     }
// });
// upload image to database
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        return cb(null, uniqueSuffix + file.originalname);
    }
});

const upload = multer({ storage });

module.exports = upload;
