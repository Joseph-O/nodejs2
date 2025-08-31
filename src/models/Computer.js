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
    memoryType: String,
    formFactor: String,
    bankLabel: String,
    deviceLocator: String
});

const computerSchema = new mongoose.Schema({
    machineName: String,
    model: {
        type: String,
        required: true
    },
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    primaryMacAddress: String,
    primaryIpAddress: String,
    cpuInformation: [cpuSchema],
    memoryModules: [memoryModuleSchema],
    totalPhysicalMemory: Number,
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
