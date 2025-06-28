const Product = require('../models/Product')

const insertSmapleProducts = async (req, res) => {
    try {
        const sampleProducts = [
            {
                name: "Laptop",
                category: "Electronics",
                price: 999,
                inStock: true,
                tags: ["computer", "tech"]
            },
            {
                name: "SmartPhone",
                category: "Electronics",
                price: 699,
                inStock: true,
                tags: ["mobile", "tech"]
            },
            {
                name: "HeadPhones",
                category: "Electronics",
                price: 199,
                inStock: false,
                tags: ["audio", "tech"]
            },
            {
                name: "Running Shoes",
                category: "Sports",
                price: 89,
                inStock: true,
                tags: ["footwear", "running"]
            },
            {
                name: "Novel",
                category: "Books",
                price: 15,
                inStock: true,
                tags: ["fiction", "bestseller"]
            }
        ]

        const result = await Product.insertMany(sampleProducts);
        return res.status(201).json({
            success: true,
            data: `Inserted ${result.length} smaples successfully`
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }
}

const getProductStats = async (req, res) => {
    try {
        const result = await Product.aggregate([
            // stage 1 : filtering
            {
                $match: {
                    inStock: true,
                    price: {
                        $gte: 100
                    }
                }
            },
            // stage 2 : grouping docs after filter
            {
                $group: {
                    _id: "$category",
                    avgPrice: {
                        $avg: "$price"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }
}

const getProductAnalysis = async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $match: {
                    category: 'Electronics'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$price"
                    },
                    avergePrice: {
                        $avg: "$price"
                    },
                    maxProductPrice: {
                        $max: "$price"
                    },
                    minProductPrice: {
                        $min: "$price"
                    }
                }
            },
            {
                $project : {
                    _id : 0,
                    totalRevenue : 1,
                    avergePrice : 1,
                    maxProductPrice : 1,
                    minProductPrice : 1,
                    priceRange : {
                        $subtract : ["$maxProductPrice","$minProductPrice"]
                    }
                }
            }
        ])

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }
}



module.exports = { insertSmapleProducts, getProductStats, getProductAnalysis };