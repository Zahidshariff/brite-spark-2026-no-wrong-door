# Technical Decisions — No Wrong Door

## 1. Architecture

The solution uses independent source adapters and a separate aggregation layer.

```text
Client
  |
  v
Node.js API
  |
  v
Aggregator
  |
  +--------------------+
  |                    |
  v                    v
REST Adapter       XML Adapter
  |                    |
  v                    v
Resident Index     Benefits Register