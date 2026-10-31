# CLAUDE.md (n8n/)

n8n community node `n8n-nodes-feedmarkdown`: one trigger node, "Feedmarkdown Trigger" (event New Article). Independent of `server/`, `dashboard/`, `landing/`. Receives the server's webhook POST (`ArticlePayload` in `server/webhook.go`) and emits the JSON body untouched as one item. No credentials, no API calls, no signature verification, no webhook auto-registration (`webhookMethods` are deliberate no-ops, required by the linter). Zero runtime dependencies (needed for verified-node status); keep it that way.

## Commands

```sh
npm install
npm run lint        # n8n-node lint (also checks community-node rules)
npm run build       # n8n-node build -> dist/
npm run dev         # n8n-node dev: local n8n with the node hot-reloaded
npm pack --dry-run  # should list only dist/ files and package.json
```

Manual test: run n8n (Node 20.19 to 24, not 26) with `N8N_CUSTOM_EXTENSIONS=$PWD/dist`, then POST `test/sample-article.json` to the Test or Production URL. With `N8N_CUSTOM_EXTENSIONS` the node type is `CUSTOM.feedmarkdownTrigger`; installed from npm it is `n8n-nodes-feedmarkdown.feedmarkdownTrigger`.

## Rules

- `test/sample-article.json` mirrors `NewTestPayload` in `server/webhook.go`; update both together.
- Do not rename or drop payload fields; pass the body through.
- Webhook is POST only; `responseData` is `''` so the node's `{ok: true}` response is used.
- Targets `n8nNodesApiVersion` 1.
