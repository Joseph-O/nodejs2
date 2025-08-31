const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: false
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Customer', customerSchema);
