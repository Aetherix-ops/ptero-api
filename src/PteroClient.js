"use strict";

const { request } = require("./utils/request");

/**
 * PteroClient
 * Wraps the Pterodactyl Client API (user-level)
 *
 * @example
 * const { PteroClient } = require("@aetherix-ops/ptero-api");
 * const client = new PteroClient("https://panel.yourdomain.com", "client_api_key");
 */
class PteroClient {
  /**
   * @param {string} panelUrl - Your Pterodactyl panel URL
   * @param {string} apiKey   - Client API key from account settings
   */
  constructor(panelUrl, apiKey) {
    if (!panelUrl || !apiKey) {
      throw new Error("panelUrl and apiKey are required");
    }
    this.panelUrl = panelUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
    this._base = "/api/client";
  }

  _req(method, path, body = null) {
    return request(this.panelUrl, this.apiKey, method, this._base + path, body);
  }

  // ── ACCOUNT ──────────────────────────────────────────────

  /**
   * Get current account info
   */
  getAccount() {
    return this._req("GET", "/account");
  }

  /**
   * Get all API keys for the current account
   */
  getApiKeys() {
    return this._req("GET", "/account/api-keys");
  }

  // ── SERVERS ───────────────────────────────────────────────

  /**
   * List all servers the client has access to
   */
  listServers() {
    return this._req("GET", "/");
  }

  /**
   * Get details of a specific server
   * @param {string} identifier - Server identifier
   */
  getServer(identifier) {
    return this._req("GET", `/servers/${identifier}`);
  }

  /**
   * Get resource usage of a server (RAM, CPU, disk, status)
   * @param {string} identifier - Server identifier
   */
  getServerResources(identifier) {
    return this._req("GET", `/servers/${identifier}/resources`);
  }

  /**
   * Get activity logs of a server
   * @param {string} identifier - Server identifier
   */
  getServerActivity(identifier) {
    return this._req("GET", `/servers/${identifier}/activity`);
  }

  // ── POWER ─────────────────────────────────────────────────

  /**
   * Send a power action to a server
   * @param {string} identifier - Server identifier
   * @param {"start"|"stop"|"restart"|"kill"} signal - Power signal
   */
  sendPowerAction(identifier, signal) {
    const valid = ["start", "stop", "restart", "kill"];
    if (!valid.includes(signal)) {
      throw new Error(`Invalid signal. Must be one of: ${valid.join(", ")}`);
    }
    return this._req("POST", `/servers/${identifier}/power`, { signal });
  }

  /**
   * Start a server
   * @param {string} identifier
   */
  startServer(identifier) {
    return this.sendPowerAction(identifier, "start");
  }

  /**
   * Stop a server
   * @param {string} identifier
   */
  stopServer(identifier) {
    return this.sendPowerAction(identifier, "stop");
  }

  /**
   * Restart a server
   * @param {string} identifier
   */
  restartServer(identifier) {
    return this.sendPowerAction(identifier, "restart");
  }

  /**
   * Kill a server (force stop)
   * @param {string} identifier
   */
  killServer(identifier) {
    return this.sendPowerAction(identifier, "kill");
  }

  // ── COMMAND ───────────────────────────────────────────────

  /**
   * Send a command to a server console
   * @param {string} identifier - Server identifier
   * @param {string} command    - Command to send
   */
  sendCommand(identifier, command) {
    return this._req("POST", `/servers/${identifier}/command`, { command });
  }

  // ── FILES ─────────────────────────────────────────────────

  /**
   * List files in a directory
   * @param {string} identifier - Server identifier
   * @param {string} directory  - Directory path (default: /)
   */
  listFiles(identifier, directory = "/") {
    return this._req("GET", `/servers/${identifier}/files/list?directory=${encodeURIComponent(directory)}`);
  }

  /**
   * Get contents of a file
   * @param {string} identifier - Server identifier
   * @param {string} file       - File path
   */
  getFileContents(identifier, file) {
    return this._req("GET", `/servers/${identifier}/files/contents?file=${encodeURIComponent(file)}`);
  }

  /**
   * Delete files or folders
   * @param {string} identifier - Server identifier
   * @param {string[]} roots    - Array of file/folder paths
   */
  deleteFiles(identifier, roots) {
    return this._req("POST", `/servers/${identifier}/files/delete`, { root: "/", files: roots });
  }

  // ── DATABASES ─────────────────────────────────────────────

  /**
   * List databases for a server
   * @param {string} identifier - Server identifier
   */
  listDatabases(identifier) {
    return this._req("GET", `/servers/${identifier}/databases`);
  }

  /**
   * Create a database for a server
   * @param {string} identifier - Server identifier
   * @param {string} database   - Database name
   * @param {string} remote     - Remote host (default: %)
   */
  createDatabase(identifier, database, remote = "%") {
    return this._req("POST", `/servers/${identifier}/databases`, { database, remote });
  }

  /**
   * Delete a database
   * @param {string} identifier  - Server identifier
   * @param {string} databaseId  - Database ID
   */
  deleteDatabase(identifier, databaseId) {
    return this._req("DELETE", `/servers/${identifier}/databases/${databaseId}`);
  }

  // ── BACKUPS ───────────────────────────────────────────────

  /**
   * List backups for a server
   * @param {string} identifier - Server identifier
   */
  listBackups(identifier) {
    return this._req("GET", `/servers/${identifier}/backups`);
  }

  /**
   * Create a backup
   * @param {string} identifier - Server identifier
   */
  createBackup(identifier) {
    return this._req("POST", `/servers/${identifier}/backups`);
  }

  /**
   * Delete a backup
   * @param {string} identifier - Server identifier
   * @param {string} backupUuid - Backup UUID
   */
  deleteBackup(identifier, backupUuid) {
    return this._req("DELETE", `/servers/${identifier}/backups/${backupUuid}`);
  }

  // ── SCHEDULES ─────────────────────────────────────────────

  /**
   * List schedules for a server
   * @param {string} identifier - Server identifier
   */
  listSchedules(identifier) {
    return this._req("GET", `/servers/${identifier}/schedules`);
  }

  /**
   * Get a specific schedule
   * @param {string} identifier  - Server identifier
   * @param {number} scheduleId  - Schedule ID
   */
  getSchedule(identifier, scheduleId) {
    return this._req("GET", `/servers/${identifier}/schedules/${scheduleId}`);
  }
}

module.exports = PteroClient;
