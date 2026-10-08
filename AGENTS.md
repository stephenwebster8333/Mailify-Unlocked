# Repository findings

- The original project is a Windows .NET Framework 4.7.2 console program with Windows Forms/WPF references, not a browser app. Do not treat the isolated preview as a successful build of the original program.
- `preview/` is a separate mock-only app. Never import or execute original account-checking modules from it. No real account access, external credentials, or network lookups are part of this preview.
- The preview has no package dependencies: its server uses Node built-ins and serves an explicit asset allowlist, not the repository root. Compose mounts source read-only. Browser refresh notifications watch its assets; Node watch mode restarts server changes.
- Run `docker compose -f docker-compose.base44.yml up -d --build`, then check `docker compose -f docker-compose.base44.yml ps` and `curl -fsS http://localhost:3000/`.
- Syntax checks: `docker compose -f docker-compose.base44.yml exec -T preview node --check app.js` (and `server.mjs`). Verify inbox selection/search and domain example/extract/clear through the UI. Inputs and messages live only in browser memory.
- Domain extraction is text normalization only, not domain availability or email validation. URLs containing user information and credential-list lines are skipped. Original code stays unchanged.
