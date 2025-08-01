const express = require("express")
const logger = require("morgan")
const connectToMongoDB = require("./db/connectToMongoDB")
const app = express()
const PORT = 3000


//middleware
app.use(logger("dev"))
app.use(express.json())


//require router

const customerRouter= require("./routes/customersRouter.js")
const productsRouter= require("./routes/productsRouter.js")
const cartsRouter= require("./routes/cartsRouter.js")
const ordersRouter= require("./routes/ordersRouter.js")

//app.use router Customer base path
app.use("/api/customers", customerRouter)
app.use("/api/products", productsRouter)
app.use("/api/cart", cartsRouter)
app.use("/api/orders", ordersRouter)



app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)

    connectToMongoDB()
})