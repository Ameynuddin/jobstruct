//import all require library
const express = require('express')
// const bodyparser = require('body-parser')
const cors = require('cors')
const morgon = require('morgan')
const helmet = require('helmet')
const mangoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const app = express() //Start APP  Middleware
const path = require('path')
const multer = require('./middleware/multerMiddleware')

app.use(cors()); //cors  Middleware
// app.use('*', cors())
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
app.use("/uploads", express.static("./uploads"));
// app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Example route to handle file uploads
app.post('http://localhost:8080/api/v1/jobs', multer.single('file'), (req, res) => {
    res.json({ fileUrl: `./uploads/${req.file.filename}` }); // Return the URL to the uploaded file
});

//IMPORT ROUTES
const userRoutes = require('./routes/userRoutes')
const jobRoutes = require('./routes/jobRoutes')
//All ROUTES START HERE 
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/jobs', jobRoutes);

module.exports = app