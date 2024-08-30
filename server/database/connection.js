const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./.env'})

// mongoose.connect(process.env.DBURL)
// .then(db => console.log("Database is connected"))
// .catch(error=> console.log("Database is not connected", error))

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DBURL, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Call the function to connect to the database
connectToDatabase();
