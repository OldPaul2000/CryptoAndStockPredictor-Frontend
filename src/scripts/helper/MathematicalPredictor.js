function calculateLinearRegression(data) {
  const n = data.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumX2 += i * i;
  }

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  return { m, b };
}

// 📌 Function to Predict Values Using Regression
function predictNextValues(coefficients, startX, numPredictions) {
  const { m, b } = coefficients;
  const predictions = [];

  for (let i = 0; i < numPredictions; i++) {
    const x = startX + i;
    const y = m * x + b;
    predictions.push(y);
  }

  return predictions;
}

// 📌 Main Function for Data Preparation and Prediction
export function runStockCryptoPrediction(data) {
  // Convert data into a weighted average (considering open, high, low, close, volume)
  const prices = data.map((item) => {
    const open = parseFloat(item.open);
    const high = parseFloat(item.high);
    const low = parseFloat(item.low);
    const close = parseFloat(item.close);
    const volume = item.volume === -1 ? 0 : parseFloat(item.volume);

    // Weighted average (more weight on close)
    return open * 0.2 + high * 0.2 + low * 0.2 + close * 0.4;
  });

  // Calculate Linear Regression
  const coefficients = calculateLinearRegression(prices);
  console.log("Linear Regression Coefficients:", coefficients);

  // Predict Next 10 Values
  const startX = prices.length;
  const predictions = predictNextValues(coefficients, startX, 10);
  console.log("Predicted Next 10 Values:", predictions);

  return predictions;
}
