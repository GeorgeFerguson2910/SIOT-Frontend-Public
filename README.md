# Server

The SIoT server is a Node/Express backend responsible for ingesting sensor data, managing the plant history database, validating incoming metrics, and exposing a unified API for the frontend. It handles caching, alert generation, fault detection, and the same message format that the real Raspberry Pi edge nodes would send. This allows the whole stack to operate identically between real and simulated data sources.


