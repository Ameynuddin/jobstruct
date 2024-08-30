const app = require('./index')
require('./database/connection')
const dotenv = require('dotenv')
dotenv.config({path:'./.env'})

const port = process.env.PORT 
app.listen(port, ()=>{
    console.log(`http://127.0.0.1:${port}`)
})