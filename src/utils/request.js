"use strict";

const https = require("https");
const http = require("http");
const { PteroError } = require("./errors");

/**
 * Make an HTTP request to the Pterodactyl API
 */
function request(baseUrl, apiKey, method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl + path);
    const lib = url.protocol === "https:" ? https : http;
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname + url.search,
      method: method.toUpperCase(),
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(payload && { "Content-Length": Buffer.byteLength(payload) })
      }
    };

    const req = lib.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        // No content
        if (res.statusCode === 204) {
          return resolve(null);
        }

        let parsed;
        try {
          parsed = data ? JSON.parse(data) : null;
        } catch {
          return reject(new PteroError("Invalid JSON response", res.statusCode));
        }

        if (res.statusCode >= 400) {
          const msg = parsed?.errors?.[0]?.detail
            || parsed?.error
            || `HTTP ${res.statusCode}`;
          return reject(new PteroError(msg, res.statusCode, parsed));
        }

        resolve(parsed);
      });
    });

    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new PteroError("Request timeout", 408));
    });

    if (payload) req.write(payload);
    req.end();
  });
}

module.exports = { request };
