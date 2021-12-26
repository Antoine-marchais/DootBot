// Setting up a local server to run Bot Locally
express = require('express')
const mainModule = require('./main.js')

const app = express()
const port = 8080

app.get("/", (req, res) => {
    mainModule.processMessage((req, res))
})

app.listen(port, () => {
    console.log(`Local server running at address http://localhost:${port}`)
})