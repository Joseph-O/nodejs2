const mongoose = require('mongoose');

const distributorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: false
        },
        zipCode: {
            type: String,
            required: false
        }
    },
    contact: {
        phone: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        contactPerson: {
            type: String,
            required: false
        }
    },
    coverage: {
        areas: [{
            type: String,
            required: false
        }],
        radius: {
            type: Number,
            required: false,
            min: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Distributor', distributorSchema);
