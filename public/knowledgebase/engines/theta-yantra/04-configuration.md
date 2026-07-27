# Theta Yantra — Configuration

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Configuration File

`/etc/theta-yantra/config.yaml` or environment variables with `TY_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `TY_PORT` | `3180` | API port |
| `TY_MQ_HOST` | `192.168.190.118` | MQ broker address |
| `TY_DB_HOST` | `localhost` | TimescaleDB host |
| `TY_DB_NAME` | `theta_yantra` | Database name |
| `TY_PRICING_MODEL` | `black_scholes` | Default pricing model |
| `TY_VOL_MODEL` | `sabr` | Volatility surface model (sabr/svi) |
| `TY_GPU_ENABLED` | `true` | Enable GPU acceleration |
| `TY_GPU_DEVICE_ID` | `0` | CUDA device ID |
| `TY_MONTE_CARLO_PATHS` | `100000` | Monte Carlo simulation paths |
| `TY_SURFACE_RESOLUTION` | `50` | Vol surface interpolation grid points |

## Environment-Specific

Production uses NVIDIA A100 GPU on ALGO IQ 6. Staging runs CPU-only mode with reduced Monte Carlo paths (10000).
