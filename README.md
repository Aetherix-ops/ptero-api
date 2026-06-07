# @aetherix-ops/ptero-api

<div align="center">

![npm](https://img.shields.io/npm/v/@aetherix-ops/ptero-api?style=flat-square&color=00d2ff)
![license](https://img.shields.io/npm/l/@aetherix-ops/ptero-api?style=flat-square&color=green)
![node](https://img.shields.io/node/v/@aetherix-ops/ptero-api?style=flat-square&color=339933)
![deps](https://img.shields.io/badge/dependencies-0-00d2ff?style=flat-square)

**A modern Node.js library for the Pterodactyl Panel API.**
Supports both Client API and Application API. Zero dependencies.

</div>

---

## Installation

    npm install @aetherix-ops/ptero-api

---

## Quick Start

```javascript
const { PteroClient, PteroApp } = require("@aetherix-ops/ptero-api");

// Client API (user-level)
const client = new PteroClient("https://panel.yourdomain.com", "client_api_key");

// Application API (admin-level)
const app = new PteroApp("https://panel.yourdomain.com", "application_api_key");
```

---

## PteroClient — Client API

For user-level actions. Use your **Client API key** from Account Settings.

### Account

```javascript
// Get current account info
const account = await client.getAccount();

// Get API keys
const keys = await client.getApiKeys();
```

### Servers

```javascript
// List all your servers
const servers = await client.listServers();

// Get a specific server
const server = await client.getServer("abc12345");

// Get server resource usage (RAM, CPU, disk, status)
const resources = await client.getServerResources("abc12345");
console.log(resources.attributes.current_state); // "running"
console.log(resources.attributes.resources.memory_bytes);
console.log(resources.attributes.resources.cpu_absolute);
```

### Power Actions

```javascript
await client.startServer("abc12345");
await client.stopServer("abc12345");
await client.restartServer("abc12345");
await client.killServer("abc12345");

// Or use sendPowerAction directly
await client.sendPowerAction("abc12345", "restart");
```

### Console Commands

```javascript
await client.sendCommand("abc12345", "say Hello from ptero-api!");
```

### Files

```javascript
// List files in root directory
const files = await client.listFiles("abc12345", "/");

// Get file contents
const content = await client.getFileContents("abc12345", "/server.properties");

// Delete files
await client.deleteFiles("abc12345", ["logs/latest.log", "crash-reports"]);
```

### Databases

```javascript
// List databases
const databases = await client.listDatabases("abc12345");

// Create database
const db = await client.createDatabase("abc12345", "mydb", "%");

// Delete database
await client.deleteDatabase("abc12345", "database_id");
```

### Backups

```javascript
// List backups
const backups = await client.listBackups("abc12345");

// Create backup
await client.createBackup("abc12345");

// Delete backup
await client.deleteBackup("abc12345", "backup-uuid");
```

---

## PteroApp — Application API

For admin-level actions. Use your **Application API key** from Admin Settings.

### Servers

```javascript
// List all servers
const servers = await app.listServers();

// Get server by ID
const server = await app.getServer(1);

// Suspend / unsuspend
await app.suspendServer(1);
await app.unsuspendServer(1);

// Reinstall
await app.reinstallServer(1);

// Delete
await app.deleteServer(1);
await app.deleteServer(1, true); // force delete
```

### Users

```javascript
// List all users
const users = await app.listUsers();

// Get user by ID
const user = await app.getUser(1);

// Create user
const newUser = await app.createUser({
  email: "user@example.com",
  username: "newuser",
  first_name: "New",
  last_name: "User"
});

// Update user
await app.updateUser(1, { first_name: "Updated" });

// Delete user
await app.deleteUser(1);
```

### Nodes

```javascript
// List nodes
const nodes = await app.listNodes();

// Get node config (Wings configuration)
const config = await app.getNodeConfig(1);

// Delete node
await app.deleteNode(1);
```

### Nests & Eggs

```javascript
// List nests
const nests = await app.listNests();

// List eggs in a nest
const eggs = await app.listEggs(1);

// Get specific egg
const egg = await app.getEgg(1, 3);
```

---

## Error Handling

```javascript
const { PteroError } = require("@aetherix-ops/ptero-api");

try {
  await client.startServer("invalid");
} catch (err) {
  if (err instanceof PteroError) {
    console.log(err.message);     // Error message
    console.log(err.statusCode);  // HTTP status code
    console.log(err.response);    // Full API response
  }
}
```

---

## Testing

    PANEL_URL=https://panel.yourdomain.com \
    CLIENT_KEY=your_client_key \
    APP_KEY=your_app_key \
    node test/test.js

---

## File Structure

    @aetherix-ops/ptero-api/
    |- src/
    |   |- PteroClient.js     - Client API wrapper
    |   |- PteroApp.js        - Application API wrapper
    |   |- utils/
    |       |- request.js     - HTTP request utility
    |       |- errors.js      - Error classes
    |- test/
    |   |- test.js            - Basic test suite
    |- index.js               - Entry point
    |- package.json
    |- README.md

---

## Related

- [ptero-cli](https://github.com/Aetherix-ops/ptero-cli) — CLI tool built on this library
- [ptero-scripts](https://github.com/Aetherix-ops/ptero-scripts) — Shell scripts for Pterodactyl
- [ptero-eggs](https://github.com/Aetherix-ops/ptero-eggs) — Updated egg collection

---

## License

MIT — by [aetherix-ops](https://github.com/Aetherix-ops)
