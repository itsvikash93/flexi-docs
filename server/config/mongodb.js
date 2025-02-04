const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI).then(() => {
            console.log(`connected to database`);
        })

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectToDB;