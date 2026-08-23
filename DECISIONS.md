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




## Day 2 — Benefits Register degradation to 40%

### What changed

The Benefits Register is now configured to fail on approximately 40% of
requests:

python services/xml_service.py --port 8082 --failure-rate 0.40

The service is treated as a permanently unreliable dependency.

### What we changed

The existing XML adapter was retained with retry handling.

A failed Benefits Register request can be retried up to three attempts.
If all three attempts fail, the adapter reports the source as unavailable
instead of causing the complete resident request to fail.

The aggregator continues returning Resident Index data when the Benefits
Register is unavailable.

### What we chose not to change

We did not make the Benefits Register a required dependency.

We did not add a database or cache.

We did not change the legacy source services.

We did not fail the complete API response when the XML source is unavailable.

### Verification

The API was tested repeatedly with the Benefits Register running at a 40%
failure rate.

During testing, requests reached:

Found: True
Benefits status: unavailable
Attempts: 3

The resident information remained available even when all XML attempts
failed.

### What we would do differently

For a production system, additional observability such as structured
logging, metrics, timeouts and circuit-breaking could be considered.