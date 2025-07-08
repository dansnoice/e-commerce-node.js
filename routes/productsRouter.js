const express = require("express");
const router = express.Router();
const { createProduct, getProducts } = require("../controllers/productsController");


router.get("/", async (req, res) => {
  try {
    const products = await getProducts()
    res.status(200).json({
        message: "Successfully found these products",
        payload: products
    })
  } catch (error) {
    res.status(400).json({
      message: "failure",
      payload: error.message,
    });
}
});
router.post("/", async (req,res) => {
    try {
        const product = await createProduct(req.body)
        res.status(200).json({
            message: "Successfully created this Product",
            payload: product
        })
    } catch (error) {
        res.status(400).json({
          message: "failure",
          payload: error.message,
        });
    }
})






module.exports = router;
