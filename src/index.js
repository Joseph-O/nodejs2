const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');
const Customer = require('./models/Customer');
const Distributor = require('./models/Distributor');
const Computer = require('./models/Computer');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// User routes
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Customer routes
app.post('/api/customers', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Distributor routes
app.post('/api/distributors', async (req, res) => {
    try {
        const distributor = new Distributor(req.body);
        await distributor.save();
        res.status(201).json(distributor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/distributors', async (req, res) => {
    try {
        const distributors = await Distributor.find();
        res.json(distributors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/distributors/:id', async (req, res) => {
    try {
        const distributor = await Distributor.findById(req.params.id);
        if (!distributor) {
            return res.status(404).json({ error: 'Distributor not found' });
        }
        res.json(distributor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/distributors/:id', async (req, res) => {
    try {
        const distributor = await Distributor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!distributor) {
            return res.status(404).json({ error: 'Distributor not found' });
        }
        res.json(distributor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Computer routes
app.post('/api/computers', async (req, res) => {
    try {
        const computer = new Computer(req.body);
        await computer.save();
        res.status(201).json(computer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// JSON API endpoint for adding/updating computers from system info
app.post('/api/computers/sync', async (req, res) => {
    try {
        // Transform the system info JSON keys to match our schema
        const knownFields = [
            'MachineName', 'Model', 'SerialNumber', 'PrimaryMacAddress', 'PrimaryIpAddress',
            'CpuInformation', 'MemoryModules', 'TotalPhysicalMemory', 'StorageDisks'
        ];
        const computerData = {
            model: req.body.Model,
            serialNumber: req.body.SerialNumber,
            machineName: req.body.MachineName,
            primaryMacAddress: req.body.PrimaryMacAddress,
            primaryIpAddress: req.body.PrimaryIpAddress,
            cpuInformation: req.body.CpuInformation?.map(cpu => ({
                name: cpu.Name,
                description: cpu.Description,
                manufacturer: cpu.Manufacturer,
                version: cpu.Version,
                numberOfCores: cpu.NumberOfCores,
                numberOfLogicalProcessors: cpu.NumberOfLogicalProcessors,
                architecture: cpu.Architecture,
                maxClockSpeed: cpu.MaxClockSpeed,
                currentClockSpeed: cpu.CurrentClockSpeed,
                processorId: cpu.ProcessorId,
                socketDesignation: cpu.SocketDesignation,
                temperature: cpu.Temperature,
                coreTemperatures: cpu.CoreTemperatures,
                fanSpeed: cpu.FanSpeed
            })),
            memoryModules: req.body.MemoryModules?.map(module => ({
                manufacturer: module.Manufacturer,
                partNumber: module.PartNumber,
                serialNumber: module.SerialNumber,
                capacity: module.Capacity,
                speed: module.Speed,
                memoryType: module.MemoryType,
                formFactor: module.FormFactor,
                bankLabel: module.BankLabel,
                deviceLocator: module.DeviceLocator
            })),
            storageDisks: req.body.StorageDisks?.map(disk => ({
                model: disk.Model,
                serialNumber: disk.SerialNumber,
                size: disk.Size,
                type: disk.Type,
                partitions: disk.Partitions
            })),
            totalPhysicalMemory: req.body.TotalPhysicalMemory,
            lastUpdated: Date.now(),
            // Store any additional fields in 'extra'
            extra: {}
        };

        // Copy any additional fields from the input JSON to 'extra'
        for (const key in req.body) {
            if (!knownFields.includes(key)) {
                computerData.extra[key] = req.body[key];
            }
        }

        // Try to find an existing computer with the same serial number
        const existingComputer = await Computer.findOne({ 
            serialNumber: computerData.serialNumber 
        });

        let computer;
        if (existingComputer) {
            // Update existing computer
            computer = await Computer.findByIdAndUpdate(
                existingComputer._id,
                computerData,
                { new: true, runValidators: true }
            );
            res.json({
                message: 'Computer updated successfully',
                computer,
                action: 'updated'
            });
        } else {
            // Create new computer
            computer = new Computer(computerData);
            await computer.save();
            res.status(201).json({
                message: 'Computer created successfully',
                computer,
                action: 'created'
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/computers', async (req, res) => {
    try {
        const computers = await Computer.find();
        res.json(computers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/computers/:id', async (req, res) => {
    try {
        const computer = await Computer.findById(req.params.id);
        if (!computer) {
            return res.status(404).json({ error: 'Computer not found' });
        }
        res.json(computer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/computers/:id', async (req, res) => {
    try {
        const computer = await Computer.findByIdAndUpdate(
            req.params.id,
            { ...req.body, lastUpdated: Date.now() },
            { new: true, runValidators: true }
        );
        if (!computer) {
            return res.status(404).json({ error: 'Computer not found' });
        }
        res.json(computer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
