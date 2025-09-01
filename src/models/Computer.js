const mongoose = require('mongoose');

const cpuSchema = new mongoose.Schema({
    name: String,
    description: String,
    manufacturer: String,
    version: String,
    numberOfCores: Number,
    numberOfLogicalProcessors: Number,
    architecture: String,
    maxClockSpeed: Number,
    currentClockSpeed: Number,
    processorId: String,
    socketDesignation: String,
    temperature: Number,
    coreTemperatures: [Number],
    fanSpeed: Number
});

const memoryModuleSchema = new mongoose.Schema({
    manufacturer: String,
    partNumber: String,
    serialNumber: String,
    capacity: Number,
    speed: Number,
    memoryType: mongoose.Schema.Types.Mixed, // can be string or number
    typeDetail: mongoose.Schema.Types.Mixed, // new field, can be number or string
    formFactor: String,
    bankLabel: String,
    deviceLocator: String
});

const storageDiskSchema = new mongoose.Schema({
    model: String,
    serialNumber: String,
    size: mongoose.Schema.Types.Mixed,
    type: String,
    partitions: mongoose.Schema.Types.Mixed
});

const computerSchema = new mongoose.Schema({
    machineName: String,
    model: {
        type: String,
        required: true
    },
    serialNumber: {
        type: String,
        required: true
    },
    primaryMacAddress: {
        type: String,
        required: true,
        unique: true
    },
    primaryIpAddress: String,
    cpuInformation: [cpuSchema],
    memoryModules: [memoryModuleSchema],
    totalPhysicalMemory: Number,
    storageDisks: [storageDiskSchema],
    // Store any additional fields from the JSON here
    extra: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Computer', computerSchema);
