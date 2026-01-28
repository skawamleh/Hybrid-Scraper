const historicalInput = document.getElementById("historicalData");
const forecastHorizon = document.getElementById("forecastHorizon");
const revenuePerUnit = document.getElementById("revenuePerUnit");
const seasonalityWeight = document.getElementById("seasonalityWeight");
const seasonalityValue = document.getElementById("seasonalityValue");
const trendAdjustment = document.getElementById("trendAdjustment");
const horizonValue = document.getElementById("horizonValue");
const revenueImpact = document.getElementById("revenueImpact");
const mapeValue = document.getElementById("mapeValue");
const biasValue = document.getElementById("biasValue");
const chart = document.getElementById("chart");
const forecastTableBody = document.querySelector("#forecastTable tbody");

const sampleData = [
  1180, 1260, 1325, 1205, 1380, 1465, 1520, 1410, 1585, 1660, 1725, 1605,
];

function parseHistoricalData() {
  const raw = historicalInput.value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map(Number)
    .filter((value) => !Number.isNaN(value));

  return raw.length >= 6 ? raw : sampleData;
}

function calculateSeasonality(data) {
  const mid = Math.max(1, Math.round(data.length / 2));
  const firstHalf = data.slice(0, mid);
  const secondHalf = data.slice(-mid);
  const average = data.reduce((sum, value) => sum + value, 0) / data.length;
  const indices = data.map((value, index) => {
    const baseline = index < mid ? firstHalf : secondHalf;
    const baselineAvg = baseline.reduce((sum, val) => sum + val, 0) / baseline.length;
    return baselineAvg > 0 ? value / baselineAvg : 1;
  });

  return { average, indices };
}

function generateForecast(data, horizon, seasonalityFactor, trendPercent) {
  const { average, indices } = calculateSeasonality(data);
  const latest = data[data.length - 1];
  const trendBase = latest * (1 + trendPercent / 100);

  return Array.from({ length: horizon }, (_, idx) => {
    const seasonalIndex = indices[(data.length + idx) % indices.length] || 1;
    const seasonalBlend = average * seasonalIndex * seasonalityFactor;
    const trendBlend = trendBase * (1 - seasonalityFactor);
    return Math.max(0, Math.round(seasonalBlend + trendBlend));
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function renderChart(actuals, forecast) {
  const width = 560;
  const height = 220;
  const padding = 28;
  const allValues = [...actuals, ...forecast];
  const maxValue = Math.max(...allValues) * 1.1;
  const minValue = Math.min(...allValues) * 0.9;
  const scaleX = (index, total) => padding + (index / (total - 1)) * (width - padding * 2);
  const scaleY = (value) =>
    height - padding - ((value - minValue) / (maxValue - minValue)) * (height - padding * 2);

  const actualPath = actuals
    .map((value, index) => {
      const x = scaleX(index, actuals.length);
      const y = scaleY(value);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const forecastPath = forecast
    .map((value, index) => {
      const x = scaleX(actuals.length - 1 + index, actuals.length + forecast.length - 1);
      const y = scaleY(value);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" aria-label="Demand forecast chart" role="img">
      <defs>
        <linearGradient id="actualGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#2b6ef5" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#2b6ef5" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="transparent" />
      <path d="${actualPath}" fill="none" stroke="#2b6ef5" stroke-width="3" />
      <path d="${forecastPath}" fill="none" stroke="#4db6ac" stroke-width="3" stroke-dasharray="6" />
    </svg>
  `;
}

function calculateAccuracy(actuals) {
  const recent = actuals.slice(-6);
  const average = recent.reduce((sum, value) => sum + value, 0) / recent.length;
  const naive = recent.map((_, idx) => (idx === 0 ? average : recent[idx - 1]));
  const errors = recent.map((value, index) => Math.abs((value - naive[index]) / value));
  const mape = errors.reduce((sum, value) => sum + value, 0) / errors.length;
  const bias =
    (naive.reduce((sum, value) => sum + value, 0) - recent.reduce((sum, value) => sum + value, 0)) /
    recent.length;

  return { mape: mape * 100, bias };
}

function renderTable(actuals, forecast) {
  forecastTableBody.innerHTML = "";
  const totalRows = Math.max(actuals.length, forecast.length);

  for (let i = 0; i < totalRows; i += 1) {
    const actual = actuals[i];
    const prediction = forecast[i];
    const variance = actual && prediction ? prediction - actual : null;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>Month ${i + 1}</td>
      <td>${actual ? actual.toLocaleString() : "-"}</td>
      <td>${prediction ? prediction.toLocaleString() : "-"}</td>
      <td class="variance ${variance >= 0 ? "positive" : "negative"}">
        ${variance !== null ? `${variance >= 0 ? "+" : ""}${variance.toLocaleString()}` : "-"}
      </td>
    `;

    forecastTableBody.appendChild(row);
  }
}

function updateDashboard() {
  const data = parseHistoricalData();
  const horizon = Number(forecastHorizon.value);
  const seasonality = Number(seasonalityWeight.value);
  const trend = Number(trendAdjustment.value);
  const forecast = generateForecast(data, horizon, seasonality, trend);

  renderChart(data, forecast);
  renderTable([...data.slice(-horizon)], forecast);

  const revenue = forecast.reduce((sum, value) => sum + value, 0) * Number(revenuePerUnit.value);
  revenueImpact.textContent = `${formatCurrency(revenue / 1_000_000)}M`;

  const { mape, bias } = calculateAccuracy(data);
  mapeValue.textContent = `${mape.toFixed(1)}%`;
  biasValue.textContent = `${bias >= 0 ? "+" : ""}${bias.toFixed(0)} units`;

  horizonValue.textContent = horizon;
  seasonalityValue.textContent = seasonality.toFixed(2);
}

function loadSample() {
  historicalInput.value = sampleData.join(", ");
  updateDashboard();
}

seasonalityWeight.addEventListener("input", updateDashboard);
forecastHorizon.addEventListener("input", updateDashboard);
trendAdjustment.addEventListener("input", updateDashboard);
revenuePerUnit.addEventListener("input", updateDashboard);

const generateButton = document.getElementById("generateForecast");
const sampleButton = document.getElementById("loadSample");

generateButton.addEventListener("click", updateDashboard);
sampleButton.addEventListener("click", loadSample);

loadSample();
