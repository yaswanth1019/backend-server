const mongoose = require('mongoose')

const connectDB = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log("connected to mongodb successfully");
                resolve();
            })
            .catch((error) => {
                console.log("Failed to connect database!!");
                reject(error);
            });
    });
}

module.exports = connectDB;