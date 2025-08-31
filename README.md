# Node.js MongoDB Application

This is a basic Node.js application with MongoDB integration using Express and Mongoose.

## Prerequisites

- Node.js installed on your machine
- MongoDB installed and running locally (or a MongoDB Atlas connection string)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/myapp
   ```

3. Start the application:
   ```
   node src/index.js
   ```

## Using the Application

1. Open your browser and navigate to `http://localhost:3000`
2. The application has two main sections:
   - Users: Manage user accounts
   - Customers: Manage customer information

### Users Management
- Add new users using the form
- View the list of all users

### Customers Management
- Add new customers with their contact information
- View the list of all customers
- Track customer details including name, phone, email, and address

### Distributors Management
- Add new distributors with comprehensive details
- Track distributor information including:
  - Name and contact details
  - Full address
  - Coverage areas and radius
  - Contact person information
- View all distributors in an organized list

### Computers Management
- Add new computers with system information
- Required fields are only model and serial number
- Import computer details directly from system_info.json
- Track detailed system information including:
  - Machine name and network details
  - CPU specifications
  - Memory modules and capacity
- Collapsible detailed view for each computer

## API Endpoints

### Users
- `GET /` - User management interface
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users

### Customers
- `GET /customers.html` - Customer management interface
- `POST /api/customers` - Create a new customer
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get a specific customer by ID

### Distributors
- `GET /distributors.html` - Distributor management interface
- `POST /api/distributors` - Create a new distributor
- `GET /api/distributors` - Get all distributors
- `GET /api/distributors/:id` - Get a specific distributor
- `PUT /api/distributors/:id` - Update a distributor

### Computers
- `GET /computers.html` - Computer management interface
- `POST /api/computers` - Create a new computer
- `GET /api/computers` - Get all computers
- `GET /api/computers/:id` - Get a specific computer
- `PUT /api/computers/:id` - Update a computer
- `POST /api/computers/sync` - Add or update computer from system_info.json format

#### Using the Computer Sync API

The `/api/computers/sync` endpoint accepts system information in the same format as system_info.json. It will:
- Create a new computer if the serial number doesn't exist
- Update the existing computer if the serial number matches

Example usage with curl:
```bash
curl -X POST http://localhost:3000/api/computers/sync \
     -H "Content-Type: application/json" \
     -d @system_info.json
```

Example response:
```json
{
    "message": "Computer updated successfully",
    "computer": {
        "model": "NUCS BOX-1340P/D4",
        "serialNumber": "H3BSIF000006",
        ...
    },
    "action": "updated"
}
```

## Testing the API

You can test the API using tools like Postman or curl:

Create a new user:
```bash
curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com"}'
```

Get all users:
```bash
curl http://localhost:3000/api/users
```
