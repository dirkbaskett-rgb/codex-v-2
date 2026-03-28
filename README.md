# Powder Passport

Small static progressive web app for tracking Mountain Collective ski resorts while the product is still taking shape.

## Current scope

- 2026/2027 Mountain Collective resorts in Western North America
- Local tracking for favorite, wishlist, planned, and visited status
- Freeform trip notes per resort
- Offline-friendly shell via service worker and manifest

## Run locally

Because this app registers a service worker, use a local server instead of opening `index.html` directly.

```powershell
node server.js
```

Then open [http://localhost:4173](http://localhost:4173).
