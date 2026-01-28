# OnHighway Demand Forecasting Console

A lightweight, single-page forecasting console built for finance controllers to model shipment demand, revenue exposure, and variance risk using quick scenario inputs.

## Features
- Editable historical demand series with automatic fallback to sample data.
- Forecast tuning via seasonality weight, trend adjustment, and horizon length.
- Revenue impact, MAPE, and bias KPIs geared toward controller workflows.
- Inline demand chart and variance table for quick review.

## Usage
Open `index.html` in a browser or serve locally:

```bash
python -m http.server 8000
```

Then navigate to `http://localhost:8000`.
