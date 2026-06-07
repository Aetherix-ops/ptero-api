"use strict";

class PteroError extends Error {
  constructor(message, statusCode = null, response = null) {
    super(message);
    this.name = "PteroError";
    this.statusCode = statusCode;
    this.response = response;
  }
}

module.exports = { PteroError };
