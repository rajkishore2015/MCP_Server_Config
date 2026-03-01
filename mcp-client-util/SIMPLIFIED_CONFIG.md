# Simplified MSSQL Utilities - No Config File, No Environment Variables

## What Changed

### Removed
- ❌ `config/mssqlConfig.js` - Configuration file removed
- ❌ Environment variables for MSSQL (MSSQL_HOST, MSSQL_PORT, etc.)
- ❌ `.env` dependency for MSSQL configuration

### Simplified
- ✅ `utils/mssqlClient.js` - Now uses built-in defaults
- ✅ Direct configuration override via constructor parameter
- ✅ Works out of the box with sensible defaults

## Default Configuration

The MSSQLClient now has built-in defaults:
```javascript
{
  server: 'localhost',
  port: 1434,
  user: 'sa',
  password: 'MyStrongPassw0rd!',
  database: 'UserDB',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
}
```

## Usage Examples

### Using Defaults (Simplest)
```javascript
const MSSQLClient = require('./utils/mssqlClient');
const client = new MSSQLClient();
await client.connect();
```

### Using Custom Config
```javascript
const customConfig = {
  server: 'myserver.com',
  port: 1433,
  user: 'admin',
  password: 'SecurePass!',
  database: 'MyDB'
};

const client = new MSSQLClient(customConfig);
await client.connect();
```

### CLI Still Works
```bash
node mssql-util.js test-connection
node mssql-util.js schema users
node mssql-util.js query users 10
```

## Benefits

✨ **Simpler** - No environment setup required  
✨ **Flexible** - Override config when needed  
✨ **Portable** - Works anywhere without .env files  
✨ **Less Files** - Removed config/ directory  
✨ **Easier Onboarding** - New developers can run immediately  

## Migration Guide

No changes needed in your code! All utilities work the same way:

```javascript
// This still works
const { getSchema } = require('./get-schema');
await getSchema('users');

// This still works
const { insertSampleData } = require('./insert-sample-data');
await insertSampleData('users');

// CLI still works
node mssql-util.js help
```

## When to Use Custom Config

Override defaults when:
- Connecting to a different server
- Using different credentials
- Connecting to Azure SQL Database (encrypt: true)
- Testing with different databases

```javascript
const client = new MSSQLClient({
  server: 'myazure.database.windows.net',
  database: 'production',
  user: 'produser',
  password: process.env.PROD_PASSWORD, // Can still use env vars if you want!
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
});
```

## Verification

All tests passed ✅:
- Connection test: ✓
- Schema retrieval: ✓
- Data querying: ✓
- Demo script: ✓

The utilities are now simpler, more flexible, and work out of the box!
