# @kyma-api/mcp-server

Stdio bridge to the hosted Kyma API MCP server at `https://mcp.kymaapi.com/mcp`.

Most clients (Claude, Cursor, Codex, ChatGPT, Grok) connect to that URL directly and sign in with OAuth; you do not need this package. Use it only for clients that can launch stdio servers but cannot speak Streamable HTTP. It runs [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) against the hosted URL, so the tools are exactly the hosted ones: live open-model catalog with prices and measured uptime, rankings, a model recommendation for your coding agent, your credits, spend and transactions, and `send_message` (a chat completion billed to your Kyma credits, capped at $10 per 30 days per connection).

## Install

```json
{
  "mcpServers": {
    "kyma": { "command": "npx", "args": ["-y", "@kyma-api/mcp-server"] }
  }
}
```

The first tool call opens a browser to sign in to Kyma (OAuth 2.1 with PKCE). To run without a browser, create a Kyma MCP key on [kymaapi.com/integrations](https://kymaapi.com/integrations) and set it as `KYMA_MCP_KEY`:

```json
{
  "mcpServers": {
    "kyma": {
      "command": "npx",
      "args": ["-y", "@kyma-api/mcp-server"],
      "env": { "KYMA_MCP_KEY": "km-..." }
    }
  }
}
```

`KYMA_MCP_KEY` is an MCP key (`km-…`), not a REST API key (`kyma-…`). Extra arguments are passed through to `mcp-remote`.

Docs: https://docs.kymaapi.com/guides/mcp-server · Source: https://github.com/kyma-api/kyma-mcp-plugin/tree/main/bridge · License: MIT
