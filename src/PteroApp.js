"use strict";

const { request } = require("./utils/request");

/**
 * PteroApp
 * Wraps the Pterodactyl Application API (admin-level)
 *
 * @example
 * const { PteroApp } = require("@aetherix-ops/ptero-api");
 * const app = new PteroApp("https://panel.yourdomain.com", "application_api_key");
 */
class PteroApp {
  /**
   * @param {string} panelUrl - Your Pterodactyl panel URL
   * @param {string} apiKey   - Application API key from admin settings
   */
  constructor(panelUrl, apiKey) {
    if (!panelUrl || !apiKey) {
      throw new Error("panelUrl and apiKey are required");
    }
    this.panelUrl = panelUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
    this._base = "/api/application";
  }

  _req(method, path, body = null) {
    return request(this.panelUrl, this.apiKey, method, this._base + path, body);
  }

  // ── SERVERS ───────────────────────────────────────────────

  /**
   * List all servers
   * @param {number} page - Page number (default: 1)
   */
  listServers(page = 1) {
    return this._req("GET", `/servers?page=${page}&per_page=100`);
  }

  /**
   * Get a server by ID
   * @param {number} serverId
   */
  getServer(serverId) {
    return this._req("GET", `/servers/${serverId}`);
  }

  /**
   * Get a server by external ID
   * @param {string} externalId
   */
  getServerByExternalId(externalId) {
    return this._req("GET", `/servers/external/${externalId}`);
  }

  /**
   * Create a new server
   * @param {Object} data - Server creation data
   */
  createServer(data) {
    return this._req("POST", "/servers", data);
  }

  /**
   * Update server details
   * @param {number} serverId
   * @param {Object} data
   */
  updateServerDetails(serverId, data) {
    return this._req("PATCH", `/servers/${serverId}/details`, data);
  }

  /**
   * Update server build configuration
   * @param {number} serverId
   * @param {Object} data
   */
  updateServerBuild(serverId, data) {
    return this._req("PATCH", `/servers/${serverId}/build`, data);
  }

  /**
   * Suspend a server
   * @param {number} serverId
   */
  suspendServer(serverId) {
    return this._req("POST", `/servers/${serverId}/suspend`);
  }

  /**
   * Unsuspend a server
   * @param {number} serverId
   */
  unsuspendServer(serverId) {
    return this._req("POST", `/servers/${serverId}/unsuspend`);
  }

  /**
   * Reinstall a server
   * @param {number} serverId
   */
  reinstallServer(serverId) {
    return this._req("POST", `/servers/${serverId}/reinstall`);
  }

  /**
   * Delete a server
   * @param {number} serverId
   * @param {boolean} force - Force delete even if server is running
   */
  deleteServer(serverId, force = false) {
    const path = force
      ? `/servers/${serverId}/force`
      : `/servers/${serverId}`;
    return this._req("DELETE", path);
  }

  // ── USERS ─────────────────────────────────────────────────

  /**
   * List all users
   * @param {number} page
   */
  listUsers(page = 1) {
    return this._req("GET", `/users?page=${page}&per_page=100`);
  }

  /**
   * Get a user by ID
   * @param {number} userId
   */
  getUser(userId) {
    return this._req("GET", `/users/${userId}`);
  }

  /**
   * Get a user by external ID
   * @param {string} externalId
   */
  getUserByExternalId(externalId) {
    return this._req("GET", `/users/external/${externalId}`);
  }

  /**
   * Create a new user
   * @param {Object} data - { email, username, first_name, last_name, password? }
   */
  createUser(data) {
    return this._req("POST", "/users", data);
  }

  /**
   * Update a user
   * @param {number} userId
   * @param {Object} data
   */
  updateUser(userId, data) {
    return this._req("PATCH", `/users/${userId}`, data);
  }

  /**
   * Delete a user
   * @param {number} userId
   */
  deleteUser(userId) {
    return this._req("DELETE", `/users/${userId}`);
  }

  // ── NODES ─────────────────────────────────────────────────

  /**
   * List all nodes
   */
  listNodes() {
    return this._req("GET", "/nodes?per_page=100");
  }

  /**
   * Get a node by ID
   * @param {number} nodeId
   */
  getNode(nodeId) {
    return this._req("GET", `/nodes/${nodeId}`);
  }

  /**
   * Get node configuration (Wings config)
   * @param {number} nodeId
   */
  getNodeConfig(nodeId) {
    return this._req("GET", `/nodes/${nodeId}/configuration`);
  }

  /**
   * Create a new node
   * @param {Object} data
   */
  createNode(data) {
    return this._req("POST", "/nodes", data);
  }

  /**
   * Delete a node
   * @param {number} nodeId
   */
  deleteNode(nodeId) {
    return this._req("DELETE", `/nodes/${nodeId}`);
  }

  // ── LOCATIONS ─────────────────────────────────────────────

  /**
   * List all locations
   */
  listLocations() {
    return this._req("GET", "/locations?per_page=100");
  }

  /**
   * Create a location
   * @param {string} short - Short code
   * @param {string} long  - Long description
   */
  createLocation(short, long) {
    return this._req("POST", "/locations", { short, long });
  }

  /**
   * Delete a location
   * @param {number} locationId
   */
  deleteLocation(locationId) {
    return this._req("DELETE", `/locations/${locationId}`);
  }

  // ── NESTS & EGGS ──────────────────────────────────────────

  /**
   * List all nests
   */
  listNests() {
    return this._req("GET", "/nests?per_page=100");
  }

  /**
   * Get eggs in a nest
   * @param {number} nestId
   */
  listEggs(nestId) {
    return this._req("GET", `/nests/${nestId}/eggs?per_page=100`);
  }

  /**
   * Get a specific egg
   * @param {number} nestId
   * @param {number} eggId
   */
  getEgg(nestId, eggId) {
    return this._req("GET", `/nests/${nestId}/eggs/${eggId}`);
  }
}

module.exports = PteroApp;
    
