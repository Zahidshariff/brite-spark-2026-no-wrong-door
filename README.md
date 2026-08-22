# Brite Spark 2026 — No Wrong Door

A Node.js unified resident API that aggregates information from two independent legacy mock services:

- Resident Index — paginated REST/JSON service
- Benefits Register — slow and unreliable XML service

The API is designed to provide partial data instead of failing completely when one source is unavailable.

## Architecture

```text
Client
  |
  v
Node.js API :8000
  |
  v
Aggregator
  |
  +--------------------+
  |                    |
  v                    v
REST Adapter        XML Adapter
  |                    |
  v                    v
REST :8081          XML :8082
