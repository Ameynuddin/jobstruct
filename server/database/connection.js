const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./.env'})

// mongoose.connect(process.env.DBURL)
// .then(db => console.log("Database is connected"))
// .catch(error=> console.log("Database is not connected", error))

mongoose.connect(process.env.DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));
