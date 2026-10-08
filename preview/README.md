# Isolated browser preview

This is a separate, mock-only browser demo. It does **not** compile, import, execute, or modify the original Windows application. No authentication checks or security controls are bypassed. The original credential-checking tools are excluded entirely.

Included features:
- Five synthetic inbox messages, local search, and message selection.
- Offline extraction, deduplication, and alphabetical sorting of domains from standalone domains, email addresses, or HTTP(S) URLs. Unsupported input is skipped. Credential lists and URLs containing credentials are rejected.

All input stays in browser memory. There is no upload, persistent storage, mail connection, DNS lookup, or third-party API. No credentials or dependencies are needed.

Run from the repository root:

```sh
docker compose -f docker-compose.base44.yml up -d
```

Open port 3000. The Node development server serves only the three preview assets, read directly from the mounted source, plus a development refresh stream. Source changes refresh connected browsers; changes to the server restart through `node --watch`.

The compose file is only for this isolated demo, not for the original Windows project. No sandbox-only shared application overrides or environment flags are used. The original application behaves exactly as before regardless of `BASE44_PREVIEW_MODE`.

Verification: open a fictional message, search for `coffee`, then open Domain utilities and extract `a@example.org`, `example.com`, and a repeated domain. Results should be unique and sorted; invalid lines are reported. Check desktop and mobile layouts.
