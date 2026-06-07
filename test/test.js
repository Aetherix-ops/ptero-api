// =============================================================
//  @aetherix-ops/ptero-api — test/test.js
//  Basic test to verify API connection
//
//  Usage:
//    PANEL_URL=https://panel.yourdomain.com \
//    CLIENT_KEY=your_client_key \
//    APP_KEY=your_app_key \
//    node test/test.js
// =============================================================

const { PteroClient, PteroApp } = require("../index");

const PANEL_URL  = process.env.PANEL_URL  || "https://panel.yourdomain.com";
const CLIENT_KEY = process.env.CLIENT_KEY || "your_client_key";
const APP_KEY    = process.env.APP_KEY    || "your_app_key";

const pass = (msg) => console.log(`  \x1b[32m[PASS]\x1b[0m ${msg}`);
const fail = (msg) => console.log(`  \x1b[31m[FAIL]\x1b[0m ${msg}`);
const info = (msg) => console.log(`  \x1b[36m[INFO]\x1b[0m ${msg}`);

async function testClient() {
  console.log("\n\x1b[1;37mTesting PteroClient (Client API)\x1b[0m");
  console.log("─".repeat(40));

  const client = new PteroClient(PANEL_URL, CLIENT_KEY);

  try {
    const account = await client.getAccount();
    pass(`getAccount() — ${account?.attributes?.email}`);
  } catch (e) {
    fail(`getAccount() — ${e.message}`);
  }

  try {
    const servers = await client.listServers();
    const count = servers?.data?.length || 0;
    pass(`listServers() — ${count} servers found`);

    if (count > 0) {
      const id = servers.data[0].attributes.identifier;
      const resources = await client.getServerResources(id);
      const state = resources?.attributes?.current_state;
      pass(`getServerResources() — ${id} is ${state}`);
    }
  } catch (e) {
    fail(`listServers() — ${e.message}`);
  }
}

async function testApp() {
  console.log("\n\x1b[1;37mTesting PteroApp (Application API)\x1b[0m");
  console.log("─".repeat(40));

  const app = new PteroApp(PANEL_URL, APP_KEY);

  try {
    const servers = await app.listServers();
    const count = servers?.data?.length || 0;
    pass(`listServers() — ${count} servers`);
  } catch (e) {
    fail(`listServers() — ${e.message}`);
  }

  try {
    const users = await app.listUsers();
    const count = users?.data?.length || 0;
    pass(`listUsers() — ${count} users`);
  } catch (e) {
    fail(`listUsers() — ${e.message}`);
  }

  try {
    const nodes = await app.listNodes();
    const count = nodes?.data?.length || 0;
    pass(`listNodes() — ${count} nodes`);
  } catch (e) {
    fail(`listNodes() — ${e.message}`);
  }
}

async function main() {
  console.log("\x1b[36m");
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   @aetherix-ops/ptero-api — Test Suite   ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("\x1b[0m");
  info(`Panel: ${PANEL_URL}`);

  await testClient();
  await testApp();

  console.log("\n" + "─".repeat(40));
  console.log("Test complete.\n");
}

main().catch(console.error);
    
