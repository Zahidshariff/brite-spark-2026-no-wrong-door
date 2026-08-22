# AI Usage

AI tools were used as a development aid during the implementation of this project.

## AI Assistance

AI was used for:

- Understanding the problem requirements and constraints.
- Discussing possible Node.js project architecture.
- Reviewing error-handling and graceful-degradation approaches.
- Helping identify relevant test scenarios.
- Reviewing documentation and implementation details.

## Implementation

The project was implemented, configured, and tested locally against the supplied mock services.

Key implementation decisions included:

- Independent REST and XML source adapters.
- REST pagination deduplication using resident IDs.
- Bounded retries for the unreliable XML service.
- Graceful degradation when a source is unavailable.
- Explicit reporting of source availability and failure reasons.
- No identity matching without a reliable shared identifier.
- Read-only API design.

## Verification

The implementation was tested locally for:

- REST source retrieval.
- Duplicate pagination handling.
- XML parsing.
- XML HTTP 500 failures.
- Retry behaviour.
- Graceful degradation.
- Unified resident API responses.
- API health checks.