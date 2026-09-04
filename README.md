# Kyma API — MCP Plugin

Connect any MCP-capable agent to [Kyma API](https://kymaapi.com): browse the live model
catalog with real prices and measured uptime, check your credits, and send test
completions.

**One URL. OAuth sign-in. No API key to paste.**

```
https://mcp.kymaapi.com/mcp
```

## What your agent gets

| Tool | What it does | Approval |
|---|---|---|
| `list_models` | Live model catalog with pricing | auto (read-only) |
| `get_model` | One model's details | auto (read-only) |
| `list_pricing` | Prices across the catalog | auto (read-only) |
| `get_credits` | Your balance | auto (read-only) |
| `search_docs` | Search Kyma docs | auto (read-only) |
| `ping` | Health check | auto (read-only) |
| `get_spend` | This connection's cap, spent, remaining, reset date | auto (read-only) |
| `list_rankings` | Top models and apps from real traffic | auto (read-only) |
| `get_model_uptime` | Measured 30-day uptime per model | auto (read-only) |
| `recommend_model` | Best model for Cline, Cursor, Claude Code and other agents | auto (read-only) |
| `get_transactions` | Recent credit ledger entries | auto (read-only) |
| `get_topup_link` | Balance and the billing page (a link, never a checkout) | auto (read-only) |
| `list_keys` | Your REST API keys by name, masked (optional `keys.read`) | auto (read-only) |
| `set_low_balance_alert` | Balance at which Kyma emails you (optional `billing.alerts`) | asks once |
| `send_message` | A real chat completion (billed) | asks once — no charge without your Allow |

Security model: OAuth 2.1 + PKCE with rotating refresh tokens. Each connection gets its
own key, spend-capped at **$10 per 30 days** (adjustable from $1 to $500) and revocable at
[kymaapi.com/integrations](https://kymaapi.com/integrations) without touching your REST
API keys. `list_keys` returns masked prefixes only; no tool can create keys or move money.
Secrets are stored hashed (SHA-256).

## Install

### Cursor

One click:
[**Add to Cursor**](https://cursor.com/en/install-mcp?name=Kyma&config=eyJ1cmwiOiJodHRwczovL21jcC5reW1hYXBpLmNvbS9tY3AifQ==)

Or manually in `.cursor/mcp.json`:

```json
{ "mcpServers": { "kyma": { "url": "https://mcp.kymaapi.com/mcp" } } }
```

### Claude Code

```bash
claude mcp add --transport http kyma https://mcp.kymaapi.com/mcp
```

Then run `/mcp` to sign in.

### Claude.ai (web / desktop)

Settings → Connectors → **Add custom connector** → paste the URL → sign in.

### Codex

```toml
# ~/.codex/config.toml
[mcp_servers.kyma]
url = "https://mcp.kymaapi.com/mcp"
```

```bash
codex mcp login kyma
```

### Grok

- **grok.com**: Connectors → New Connector → Custom → paste the URL.
- **Grok Build**: this repository is a Claude-Code-format plugin — Grok Build loads it
  as-is (`.mcp.json`).

### ChatGPT (Developer Mode)

Settings → Connectors (Plus/Pro/Business/Enterprise/Edu) → add the URL → sign in.

## About Kyma API

Kyma is an LLM API gateway: open models, one endpoint, pay-per-token, with a
never-die fallback chain and per-model measured uptime published at
[kymaapi.com/models](https://kymaapi.com/models).

- Website: https://kymaapi.com
- Docs: https://docs.kymaapi.com
- This plugin's server: `https://mcp.kymaapi.com/mcp` (Streamable HTTP)

## License

MIT

## Registries

- Official MCP Registry: `com.kymaapi/kyma` (`server.json` in this repo; published with `mcp-publisher`, namespace verified by DNS on kymaapi.com)
- xAI Grok Build marketplace: pull request to `xai-org/plugin-marketplace`
- Cursor Marketplace: application submitted
