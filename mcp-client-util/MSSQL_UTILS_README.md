# MSSQL Utilities - Refactored & Optimized

## Overview
This directory contains refactored and optimized utilities for working with MSSQL databases and MCP (Model Context Protocol) services.

## Structure

```
mcp-client-util/
├── utils/
│   └── mssqlClient.js          # Reusable MSSQL client class
├── get-schema.js               # Get table schema utility
├── insert-sample-data.js       # Insert sample user data
├── mssql-util.js               # CLI for common MSSQL operations
├── mcpClient.js                # MCP REST API client
└── create-jira-hierarchy.js    # Jira hierarchy creation script
```

## Key Improvements

### 1. **Simplified Configuration**
- MSSQL connection details use sensible defaults
- Can be overridden by passing custom config to MSSQLClient constructor
- No environment variables needed for basic usage

### 2. **Reusable MSSQL Client**
- `utils/mssqlClient.js` provides a clean, reusable class
- Common operations: `connect()`, `query()`, `insert()`, `getTableSchema()`, `getAll()`
- Proper error handling and connection pooling
- Parameterized queries to prevent SQL injection

### 3. **Modular Utilities**
- Each utility is self-contained and can be imported or run standalone
- Support for both CLI and programmatic usage
- Consistent error handling and logging

### 4. **CLI Interface**
- `mssql-util.js` provides a unified CLI for common operations
- Easy to use and discover available commands

## Usage

### Default Configuration

The MSSQL utilities use these default connection settings:
```javascript
{
  server: 'localhost',
  port: 1434,
  user: 'sa',
  password: 'MyStrongPassw0rd!',
  database: 'UserDB',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}
```

### Custom Configuration

Pass custom config to override defaults:
```javascript
const MSSQLClient = require('./utils/mssqlClient');

const customConfig = {
  server: 'myserver.database.windows.net',
  port: 1433,
  user: 'admin',
  password: 'SecurePass123!',
  database: 'MyDatabase',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

const client = new MSSQLClient(customConfig);
```

### CLI Commands

```bash
# Test database connection
node mssql-util.js test-connection

# Get table schema
node mssql-util.js schema users

# Insert sample data
node mssql-util.js insert-sample users

# Query table data
node mssql-util.js query users
node mssql-util.js query users 10  # with limit

# Show help
node mssql-util.js help
```

### Programmatic Usage

```javascript
const MSSQLClient = require('./utils/mssqlClient');

async function example() {
  const client = new MSSQLClient();
  
  try {
    await client.connect();
    
    // Get schema
    const schema = await client.getTableSchema('users');
    
    // Insert data
    await client.insert('users', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-1234',
      active: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Query data
    const users = await client.getAll('users', 10);
    
  } finally {
    await client.close();
  }
}
```

### Import and Reuse Functions

```javascript
const { getSchema } = require('./get-schema');
const { insertSampleData } = require('./insert-sample-data');

// Use in your code
await getSchema('users');
await insertSampleData('users');
```

## Benefits

✅ **DRY Principle** - No code duplication, reusable client class  
✅ **Type Safety** - Parameterized queries prevent SQL injection  
✅ **Error Handling** - Consistent, informative error messages  
✅ **Maintainability** - Easy to update connection details or add features  
✅ **Simplicity** - Works out of the box with sensible defaults  
✅ **Flexibility** - Override config when needed  
✅ **Testing** - Modular design makes unit testing straightforward  
✅ **CLI Support** - Quick operations without writing code  
✅ **Documentation** - Self-documenting with JSDoc comments  

## Migration from Old Code

### Before (Duplicated):
```javascript
// get-schema.js
const pool = await sql.connect({
  server: 'localhost',
  database: 'UserDB',
  user: 'sa',
  password: 'MyStrongPassw0rd!',
  port: 1434,
  // ...
});

// insert-sample-data.js
const pool = await sql.connect({
  server: 'localhost',  // Duplicated!
  database: 'UserDB',
  user: 'sa',
  password: 'MyStrongPassw0rd!',
  // ...
});
```

### After (Simplified):
```javascript
// Anywhere - uses defaults
const MSSQLClient = require('./utils/mssqlClient');
const client = new MSSQLClient();
await client.connect();

// Or with custom config
const client = new MSSQLClient(customConfig);
await client.connect();
```

## Dependencies

- `mssql` - SQL Server client for Node.js
- `dotenv` - Environment variable management
- `axios` - HTTP client for MCP REST API

## Next Steps

- Add unit tests for `mssqlClient.js`
- Extend CLI with more commands (update, delete, etc.)
- Add transaction support
- Implement query builder for complex queries
