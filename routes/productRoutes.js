const express = require('express');
const {insertSmapleProducts, getProductStats, getProductAnalysis} = require('../controller/productController');
const productRouter = express.Router();

productRouter.post('/add',insertSmapleProducts)
productRouter.get('/stats',getProductStats)
productRouter.get('/analysis',getProductAnalysis)

module.exports = productRouter;