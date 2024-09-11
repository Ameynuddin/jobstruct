//import all require library
const express = require('express')
// const bodyparser = require('body-parser')
const cors = require('cors')
const morgon = require('morgan')
const helmet = require('helmet')
const mangoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path')
const multer = require('multer');
// const upload = require('./middleware/multerMiddleware');
// const { Storage } = require('@google-cloud/storage');
const app = express() //Start APP  Middleware

// const storage = new Storage({
//     keyFilename: './key/key.json',
// });

// // Create a bucket instance
// const bucketName = 'jobstruct-web-app';
// const bucket = storage.bucket(bucketName);

// // Multer middleware for handling file uploads
// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB file size limit
//     },
// });

// app.use(cors({
//     origin: 'https://jobstruct.onrender.com',
//     optionsSuccessStatus: 200
//   })); //cors  Middleware
app.use(cors({ origin: '*' }));
// app.use(cors({
    // origin: 'https://jobstruct.onrender.com',
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization']
  // }));

// app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(morgon('dev'))
//sanitize the data after the cashed are full non sql query injects 
app.use(mangoSanitize())
//protect against HTTP Parameter Pollution attacks
app.use(hpp())
//File path 
// app.use(express.static("./public"))
// app.use("/profile", express.static('./profile'));

// Serve static files from the 'uploads' directory
// app.use("/uploads", express.static("./uploads"));
// app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Route for handling file uploads
// app.post('/api/v1/jobs', upload.single('resume'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         uploadedFile = req.file;
//         const fileName = Date.now() + uploadedFile.originalname;
//         const blob = bucket.file(fileName);

//         // Create write stream for uploading file
//         const blobStream = blob.createWriteStream({
//             resumable: false,
//             metadata: {
//                 contentType: uploadedFile.mimetype,
//             },
//         });

//         blobStream.on('error', (err) => {
//             console.error('Error uploading file:', err);
//             res.status(500).json({ error: 'Unable to upload file, please try again later' });
//         });

//         blobStream.on('finish', () => {
//             const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//             res.status(200).json({ fileUrl: publicUrl });
//         });

//         blobStream.end(uploadedFile.buffer);
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         res.status(500).json({ error: 'Unable to upload file, please try again later' });
//     }
// });

// app.get('/', async (req, res) => {
// 	try{
// 		const [resumes] = await bucket.getFiles();
// 		res.render('index', {resumes});
// 	} catch (error){
// 		res.status(500).send(error)
// 	}
// })

//IMPORT ROUTES
const userRoutes = require('./routes/userRoutes')
const jobRoutes = require('./routes/jobRoutes')
//All ROUTES START HERE 
app.get('/', (req, res) => {
    res.send("Server is running");
})
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/jobs', jobRoutes);

module.exports = app
