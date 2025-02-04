const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

const templateModel = mongoose.model('template', templateSchema);

module.exports = templateModel;