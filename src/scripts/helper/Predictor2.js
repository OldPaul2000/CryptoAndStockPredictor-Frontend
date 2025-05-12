import * as tf from "@tensorflow/tfjs";

// 📌 Data Preprocessing with Normalization
function preprocessData(data) {
  const processed = data.map((item) => [
    parseFloat(item.open),
    parseFloat(item.high),
    parseFloat(item.low),
    parseFloat(item.close),
    item.volume === -1 ? 0 : parseFloat(item.volume),
  ]);

  // Calculate min and max values for scaling
  const minValues = processed[0].map((_, i) =>
    Math.min(...processed.map((row) => row[i]))
  );
  const maxValues = processed[0].map((_, i) =>
    Math.max(...processed.map((row) => row[i]))
  );

  // Normalize the data
  const normalized = processed.map((row) =>
    row.map(
      (value, index) =>
        (value - minValues[index]) / (maxValues[index] - minValues[index])
    )
  );

  return { normalized, minValues, maxValues };
}

// 📌 Denormalize Predictions
function denormalize(value, min, max) {
  return value * (max - min) + min;
}

// 📌 Create the TensorFlow.js LSTM Model
function createModel(inputShape) {
  const model = tf.sequential();
  model.add(
    tf.layers.lstm({
      units: 128,
      returnSequences: true,
      inputShape: inputShape,
    })
  );
  model.add(
    tf.layers.lstm({
      units: 64,
      returnSequences: false,
    })
  );
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });
  return model;
}

// 📌 Train the Model
async function trainModel(model, trainX, trainY) {
  const xs = tf.tensor3d(trainX);
  const ys = tf.tensor2d(trainY);
  await model.fit(xs, ys, {
    epochs: 10,
    batchSize: 16,
    shuffle: true,
    verbose: 1,
  });
  xs.dispose();
  ys.dispose();
}

// 📌 Generate Next 10 Predictions
async function generatePredictions(
  model,
  data,
  windowSize,
  minClose,
  maxClose,
  numPredictions = 10
) {
  let lastWindow = data.slice(-windowSize); // Last 50 rows (2D array)
  const predictions = [];

  for (let i = 0; i < numPredictions; i++) {
    // Ensure lastWindow is a 2D array (windowSize x featureCount)
    const input = tf.tensor3d(
      [lastWindow],
      [1, windowSize, lastWindow[0].length]
    );
    const prediction = model.predict(input);
    const predictedValue = prediction.dataSync()[0];
    const denormalized = denormalize(predictedValue, minClose, maxClose);
    predictions.push(denormalized);

    // Update the window with the new prediction (normalized)
    // We add a new row with the predicted value, but keep other values as the last row
    const newRow = [
      lastWindow[windowSize - 1][0], // open (last row)
      lastWindow[windowSize - 1][1], // high (last row)
      lastWindow[windowSize - 1][2], // low (last row)
      predictedValue, // predicted close (normalized)
      lastWindow[windowSize - 1][4], // volume (last row)
    ];
    lastWindow = [...lastWindow.slice(1), newRow]; // Slide window by one step
    prediction.dispose();
    input.dispose();
  }

  // 📌 Main Function to Run the Prediction
  async function runPrediction(data) {
    const { normalized, minValues, maxValues } = preprocessData(data);
    const windowSize = 50;

    // Preparing Training Data
    const trainX = [];
    const trainY = [];

    for (let i = 0; i < normalized.length - windowSize; i++) {
      trainX.push(normalized.slice(i, i + windowSize));
      trainY.push([normalized[i + windowSize][3]]); // Target is normalized 'close' value
    }

    // Create and Train Model
    const model = createModel([windowSize, normalized[0].length]);
    await trainModel(model, trainX, trainY);

    // Generate Predictions (Denormalized)
    const predictions = await generatePredictions(
      model,
      normalized,
      windowSize,
      minValues[3], // Min value for 'close'
      maxValues[3], // Max value for 'close'
      10 // Predict next 10 values
    );

    console.log("Predicted next 10 close values:", predictions);
    return predictions;
  }
}
