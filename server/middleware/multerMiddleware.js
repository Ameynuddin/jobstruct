// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// Ensure the upload directory exists
// const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) {
//     console.log('Upload directory does not exist, creating...');
//     fs.mkdirSync(uploadDir);
// } else {
//     console.log('Upload directory already existed');
// }

// Storage configuration
// const storage = multer.memoryStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + file.originalname;
//         cb(null, uniqueSuffix);
//     }
// });

// Multer middleware for handling file uploads
// const multerConfig = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB file size limit
//     },
// });

// const upload = multer({ storage });

// module.exports = upload;
