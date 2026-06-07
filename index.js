// =============================================================
//  @aetherix-ops/ptero-api
//  A modern Node.js library for the Pterodactyl Panel API
//  Supports both Client and Application API
// =============================================================

"use strict";

const PteroClient = require("./src/PteroClient");
const PteroApp = require("./src/PteroApp");
const { PteroError } = require("./src/utils/errors");

module.exports = {
  PteroClient,
  PteroApp,
  PteroError
};
