import * as tf from "@tensorflow/tfjs";

const preprocessData = function (data) {
  const processed = data.map((item) => {
    return [
      item.open,
      item.high,
      item.low,
      item.close,
      item.volume === -1 ? 0 : item.volume,
    ];
  });

  console.log(processed);

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
};

const denormalize = function (value, min, max) {
  return value * (max - min) + min;
};

const createModel = function (inputShape) {
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
    loss: "meanAbsoluteError",
  });
  return model;
};

const trainModel = async function (model, trainX, trainY) {
  const xs = tf.tensor3d(trainX);
  const ys = tf.tensor2d(trainY);
  await model.fit(xs, ys, {
    epochs: 100,
    batchSize: 16,
    shuffle: true,
    verbose: 1,
  });
  xs.dispose();
  ys.dispose();
};

const makePrediction = async function (
  model,
  data,
  windowSize,
  minClose,
  maxClose,
  numPredictions = 10
) {
  let lastWindow = data.slice(-windowSize);
  const predictions = [];

  for (let i = 0; i < numPredictions; i++) {
    const input = tf.tensor3d(
      [lastWindow],
      [1, windowSize, lastWindow[0].length]
    );
    const prediction = model.predict(input);
    const predictedValue = prediction.dataSync()[0];
    const denormalized = denormalize(predictedValue, minClose, maxClose);
    predictions.push(denormalized);

    lastWindow = [...lastWindow.slice(1), [0, 0, 0, predictedValue, 0]];
    prediction.dispose();
    input.dispose();
  }

  return predictions;
};

export const predictData = async function (data) {
  console.log(data);
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
    minValues[3],
    maxValues[3],
    10
  );
  console.log("Predicted next 10 values:", predictions);
  return predictions;
};
