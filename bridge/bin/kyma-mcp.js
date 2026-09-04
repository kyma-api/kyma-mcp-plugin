#!/usr/bin/env node
/**
 * @kyma-api/mcp-server — stdio bridge to the hosted Kyma MCP server.
 *
 * One server, two transports. Clients that speak Streamable HTTP should use
 * https://mcp.kymaapi.com/mcp directly; this bridge is for clients that only
 * launch stdio servers. It runs mcp-remote against that URL, so the tools are
 * exactly the hosted ones (no separate tool set, no API key of its own).
 *
 * Auth:
 *   default            OAuth 2.1 in the browser (mcp-remote handles PKCE + DCR).
 *   KYMA_MCP_KEY=km-…  skip the browser: a Kyma MCP key from kymaapi.com/integrations
 *                      is sent as Authorization: Bearer. Not a REST kyma- key.
 *
 * Extra arguments are passed through to mcp-remote (e.g. --transport http-only).
 */
"use strict";
const { spawn } = require("node:child_process");
const path = require("node:path");

const URL = process.env.KYMA_MCP_URL || "https://mcp.kymaapi.com/mcp";

let proxy;
try {
  proxy = require.resolve("mcp-remote/dist/proxy.js");
} catch (e) {
  process.stderr.write("kyma-mcp: mcp-remote is not installed next to this package\n");
  process.exit(1);
}

const args = [proxy, URL];
const key = process.env.KYMA_MCP_KEY;
if (key) {
  if (!key.startsWith("km-")) {
    process.stderr.write("kyma-mcp: KYMA_MCP_KEY must be a Kyma MCP key (km-…) from https://kymaapi.com/integrations, not a REST kyma- key\n");
    process.exit(1);
  }
  args.push("--header", `Authorization: Bearer ${key}`);
}
args.push(...process.argv.slice(2));

const child = spawn(process.execPath, args, { stdio: "inherit", env: process.env, cwd: path.dirname(proxy) });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code == null ? 1 : code);
});
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => child.kill(sig));
}
