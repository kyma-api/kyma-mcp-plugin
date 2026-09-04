<p align="center">
  <img src="assets/logo-400.png" width="96" height="96" alt="Kyma API">
</p>

<h1 align="center">Kyma API MCP Server</h1>

<p align="center">
  Every model behind one endpoint, with measured uptime, public rankings and a spend cap you set.<br>
  <code>https://mcp.kymaapi.com/mcp</code>
</p>

<p align="center">
  <a href="https://registry.modelcontextprotocol.io/v0/servers?search=kyma"><img alt="MCP Registry" src="https://img.shields.io/badge/MCP%20Registry-com.kymaapi%2Fkyma-0F766E"></a>
  <a href="https://www.npmjs.com/package/@kyma-api/mcp-server"><img alt="npm" src="https://img.shields.io/npm/v/@kyma-api/mcp-server?label=stdio%20bridge&color=0F766E"></a>
  <a href="https://docs.kymaapi.com/guides/mcp-server"><img alt="Docs" src="https://img.shields.io/badge/docs-kymaapi.com-1B2430"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-1B2430"></a>
</p>

<p align="center">
  <a href="#install">Install</a> · <a href="#tools">Tools</a> · <a href="#security-and-spend">Security and spend</a> · <a href="#examples">Examples</a> · <a href="#troubleshooting">Troubleshooting</a> · <a href="#registries-and-marketplaces">Registries</a>
</p>

Kyma API is an LLM gateway: one OpenAI-compatible endpoint (plus an Anthropic-compatible one) in front of open and frontier models, with uptime measured per model from real traffic and scheduled probes. This server gives any MCP client the live catalog, prices, rankings, uptime and your own spend as read tools, and one chat tool that is guarded by a per-connection spend cap.

- **Hosted, remote, OAuth sign-in.** Streamable HTTP with OAuth 2.1, PKCE and dynamic client registration. No API key is pasted into the client.
- **A dedicated key per connection.** Separate from your REST API keys, capped at **$10 per 30 days** by default (adjustable from $1 to $500 on the approval screen or at [kymaapi.com/integrations](https://kymaapi.com/integrations)), revocable at any time.
- **Read tools never charge.** Catalog, pricing, rankings, uptime, credits and spend are free to call and auto-approved by most clients.
- **`send_message` is the only tool that spends.** The client must allow it first; every reply reports what the call cost, what has been spent and the cap.
- **Measured uptime, not a promise.** `get_model_uptime` returns the 30-day rate per model from [kymaapi.com/status](https://kymaapi.com/status). If a route fails mid-request, Kyma retries the same model on another route.
- **Beyond chat.** The same Kyma key covers speech-to-text, text-to-speech, embeddings, rerank, image and video through the REST API; `list_models` shows all of them.

## Install

<details open>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add --transport http kyma https://mcp.kymaapi.com/mcp
```

Run `/mcp` to sign in. This repository is also a Claude Code plugin (`.claude-plugin/plugin.json` + `.mcp.json`).
</details>

<details>
<summary><b>Claude.ai and Claude Desktop</b></summary>

Settings → Connectors → **Add custom connector** → paste `https://mcp.kymaapi.com/mcp` → sign in with Kyma.
</details>

<details>
<summary><b>Cursor</b></summary>

One click: [**Add to Cursor**](https://cursor.com/en/install-mcp?name=Kyma&config=eyJ1cmwiOiJodHRwczovL21jcC5reW1hYXBpLmNvbS9tY3AifQ==)

Or in `.cursor/mcp.json`:

```json
{ "mcpServers": { "kyma": { "url": "https://mcp.kymaapi.com/mcp" } } }
```
</details>

<details>
<summary><b>VS Code (GitHub Copilot)</b></summary>

One click: [**Install in VS Code**](https://vscode.dev/redirect/mcp/install?name=kyma&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.kymaapi.com%2Fmcp%22%7D)

Or in `.vscode/mcp.json`:

```json
{ "servers": { "kyma": { "type": "http", "url": "https://mcp.kymaapi.com/mcp" } } }
```
</details>

<details>
<summary><b>Codex CLI</b></summary>

```toml
# ~/.codex/config.toml
[mcp_servers.kyma]
url = "https://mcp.kymaapi.com/mcp"
```

```bash
codex mcp login kyma
```
</details>

<details>
<summary><b>Cline</b></summary>

Cline → MCP Servers → **Configure MCP Servers**:

```json
{ "mcpServers": { "kyma": { "url": "https://mcp.kymaapi.com/mcp", "type": "streamableHttp" } } }
```

Cline CLI: `cline mcp add kyma https://mcp.kymaapi.com/mcp --transport streamableHttp --yes`. Cline asks you to sign in with Kyma on first use.
</details>

<details>
<summary><b>Gemini CLI</b></summary>

```bash
gemini extensions install https://github.com/kyma-api/kyma-mcp-plugin
```

The first tool call opens a browser for OAuth sign-in, handled by Gemini CLI.
</details>

<details>
<summary><b>Grok</b></summary>

- **grok.com**: Connectors → New Connector → Custom → paste the URL.
- **Grok Build**: this repository is a Claude Code format plugin; Grok Build loads it as-is.
</details>

<details>
<summary><b>ChatGPT (Developer Mode)</b></summary>

Settings → Connectors (Plus, Pro, Business, Enterprise, Edu) → add the URL → sign in. ChatGPT connections never see `get_topup_link`.
</details>

<details>
<summary><b>Any stdio-only client</b></summary>

```json
{ "mcpServers": { "kyma": { "command": "npx", "args": ["-y", "@kyma-api/mcp-server"] } } }
```

The bridge runs `mcp-remote` against the hosted URL, so the tools are exactly the hosted ones. Set `KYMA_MCP_KEY=km-…` (a Kyma MCP key from [kymaapi.com/integrations](https://kymaapi.com/integrations), not a REST `kyma-…` key) to skip the browser. Source: [`bridge/`](bridge/).
</details>

## Tools

15 tools. 13 appear on a default connection; `list_keys` and `set_low_balance_alert` appear when their optional scopes are granted on the approval screen.

| Tool | What it does | Scope | Approval |
|---|---|---|---|
| `list_models` | Live model catalog with prices, context window and capabilities | `models.read` | auto, read-only |
| `get_model` | One model's details | `models.read` | auto, read-only |
| `list_pricing` | Prices across the catalog | `models.read` | auto, read-only |
| `list_rankings` | Top models and apps from real traffic | `models.read` | auto, read-only |
| `get_model_uptime` | Measured 30-day uptime per model | `models.read` | auto, read-only |
| `recommend_model` | Best model and config for Cline, Cursor, Claude Code and other agents | `models.read` | auto, read-only |
| `search_docs` | Search Kyma docs | `models.read` | auto, read-only |
| `ping` | Health check | `models.read` | auto, read-only |
| `get_credits` | Your balance | `usage.read` | auto, read-only |
| `get_spend` | This connection's cap, spent, remaining and reset date | `usage.read` | auto, read-only |
| `get_transactions` | Recent credit ledger entries | `usage.read` | auto, read-only |
| `get_topup_link` | Balance and the billing page (a link, never a checkout) | `usage.read` | auto, read-only |
| `list_keys` | Your REST API keys by name, masked | `keys.read` (optional) | auto, read-only |
| `set_low_balance_alert` | Balance at which Kyma emails you | `billing.alerts` (optional) | asks once |
| `send_message` | A chat completion through any model; the only tool that spends credit | `chat.completions` | asks once; no charge without your Allow |

Every `send_message` reply carries `cost`, `spent_usd` and `spend_cap_usd`, and `get_spend` shows what is left before you call it.

## Security and spend

- **What a connection can do:** read the catalog, prices, rankings, uptime, your balance and this connection's spend; send chat completions up to its cap; with optional scopes, list your keys masked and set a low-balance alert.
- **What it can never do:** create or delete API keys, change billing or payment methods, buy credits, register accounts, or see provider internals. Those scopes do not exist on this server.
- **Spend cap:** each connection gets a dedicated key with its own cap, $10 per 30 days by default, adjustable from $1 to $500. The cap is enforced on the server; when it is reached `send_message` returns an error until the window resets or you raise the cap at [kymaapi.com/integrations](https://kymaapi.com/integrations).
- **Tokens and keys:** access tokens live 7 days, refresh tokens 90 days and rotate on use; connection keys are stored hashed (SHA-256) and can be revoked without touching your REST API keys.
- **Prompt injection:** model output that reaches your agent is untrusted text. Keep your client's confirmation prompt on for `send_message`, and do not let the agent paste keys or balances into other tools.
- **Data:** request logs are kept 90 days for billing reconciliation and abuse handling, then deleted. Kyma does not train on customer data. Privacy: [kymaapi.com/privacy](https://kymaapi.com/privacy).

## Examples

Prompts you can paste once connected:

- "Which models under $1 per million output tokens have the best 30-day uptime?"
- "Recommend a model and config for Cline, then show its price."
- "How much of this connection's budget is left, and when does it reset?"
- "Send 'summarize this in one line' to qwen-3.6-plus and tell me what it cost."
- "Show the top apps on Kyma rankings this week."

## Troubleshooting

- **Sign-in loops or "connector failed":** remove the connection and add it again; the client's stored token may belong to a revoked connection. Check [kymaapi.com/integrations](https://kymaapi.com/integrations) for the active list.
- **`send_message` says the cap is reached:** raise the cap at kymaapi.com/integrations or wait for the 30-day window to reset; `get_spend` shows the date.
- **A tool returns 403 insufficient scope:** the connection was approved without that optional scope. Reconnect and tick it on the approval screen.
- **Stdio bridge cannot sign in:** set `KYMA_MCP_KEY` to a Kyma MCP key (`km-…`) created at kymaapi.com/integrations; REST `kyma-…` keys are rejected on purpose.
- **Remote connections drop:** some clients need a reconnect after long idle periods; the server itself is stateless.

## Registries and marketplaces

- Official MCP Registry: `com.kymaapi/kyma` (`server.json` in this repo, published with `mcp-publisher`, namespace verified by DNS on kymaapi.com)
- Smithery: `kyma-api/kyma`
- npm stdio bridge: [`@kyma-api/mcp-server`](https://www.npmjs.com/package/@kyma-api/mcp-server)
- Gemini CLI extensions gallery: `gemini-extension.json` and the repo topic `gemini-cli-extension`
- Submitted, pending review: Cursor Marketplace, xAI Grok Build marketplace, Docker MCP Catalog, Cline Marketplace, mcp.so

## About Kyma API

Kyma is an LLM API gateway: open and frontier models, one endpoint, pay per token, with automatic failover across providers and per-model measured uptime published at [kymaapi.com/models](https://kymaapi.com/models). New accounts start with free credit.

- Website: https://kymaapi.com · Docs: https://docs.kymaapi.com · Status: https://kymaapi.com/status
- Support: hello@kymaapi.com · Abuse: report@kymaapi.com
- Changelog: [CHANGELOG.md](CHANGELOG.md) · License: MIT
