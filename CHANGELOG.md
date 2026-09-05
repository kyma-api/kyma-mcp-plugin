# Changelog

## 1.0.3 (2026-09-04)
- Three new read tools: `get_usage` (billed usage by model over a window), `get_request` (one request by id: model served, tokens, cost, routes tried), `estimate_cost` (price a call before sending it). All auto-approved, read-only.
- `send_message` gains `max_tokens` and `max_cost_usd`: the spend ceiling is enforced by deriving a `max_tokens` that fits it from the catalog price, so a call above it is refused before anything is charged.
- `send_message` returns `structuredContent` (generation id, model requested, model served, routes tried, cost, cap remaining) alongside the text reply.
- 18 tools total, 16 on a default connection; all manifests and the npm bridge move to 1.0.3 together.

## 1.0.2 (2026-09-04)
- Read-only endpoint `/mcp/readonly` and the page kymaapi.com/mcp documented.
- Three skills (`pick-a-model`, `check-spend-and-credits`, `send-a-test-completion`) and host manifests for Codex, Cursor and Grok, from the unmerged skills branch.
- npm bridge declares `mcpName` so the Official MCP Registry can list it as a package; all manifests move to 1.0.2 together.

## 1.0.1 (2026-09-04)
- One version across the plugin manifests, the Official MCP Registry entry and the npm stdio bridge (they were 0.1.0 / 1.0.0 / 0.1.1).
- Registry entry gains `icons` and the npm bridge as a `packages` entry.
- README rewritten: security and spend section, per-client install with one-click Cursor and VS Code, examples, troubleshooting; tool table gains a scope column and states that 13 of 15 tools show on a default connection.
- Wording: "automatic failover across providers" replaces "never-die fallback chain"; the spend cap is stated with its numbers everywhere ($10 per 30 days, adjustable $1 to $500).
- Stdio bridge moved into this repository (`bridge/`); REST keys are `kyma-…`, MCP keys are `km-…`.

## 1.0.0 (2026-09-04)
- First entry in the Official MCP Registry (`com.kymaapi/kyma`).

## 0.1.0 (2026-09-03)
- Plugin manifests for Cursor, Claude Code, Grok Build and Gemini CLI.
