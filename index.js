const express = require("express")
const logger = require("morgan")
const connectToMongoDB = require("./db/connectToMongoDB")
const app = express()
const PORT = 3000


//middleware
app.use(logger("dev"))
app.use(express.json())


//require router

const customerRouter= require("/routes/customersRouter.js")

//app.use router Customer base path
app.use("/api/customer", customerRouter)



app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)

    connectToMongoDB()
})