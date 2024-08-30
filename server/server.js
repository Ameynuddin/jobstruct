const app = require('./index')
require('./database/connection')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server listens to port ${port}`)
})