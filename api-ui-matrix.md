# API to UI Matrix

- Root: `C:\Users\hp\.gemini\antigravity\scratch\china-services-portal`
- Backend routes: `0`
- UI triggers: `2`

## Backend Coverage

| Method | Endpoint | Backend File:Line | UI Triggers | Status |
|---|---|---|---|---|

## Unmapped Frontend Calls

| Method | Path | Frontend File:Line | Evidence |
|---|---|---|---|
| GET | /${apiBase}/currencies | transfert.html:268 | const res = await fetch(`${apiBase}/currencies`); |
| GET | /${apiBase}/latest | transfert.html:285 | const res = await fetch(`${apiBase}/latest?amount=${amount}&base=${from}&symbols=CNY`); |
