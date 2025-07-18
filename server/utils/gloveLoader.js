const path = require("path");
const fs = require("fs");
const readline = require("readline");

// Map to store all loaded word vectors
const wordVectors = new Map();

// Default GloVe file path
const DEFAULT_GLOVE_PATH = path.join(__dirname, "../data/glove.6B.300d.txt");

// Load GloVe word vectors into memory (runs only once)
async function loadGlove(glovePath = DEFAULT_GLOVE_PATH) {
  // Skip if already loaded
  if (wordVectors.size > 0) {
    return;
  }

  // Read the GloVe file line by line for efficiency
  const rl = readline.createInterface({
    input: fs.createReadStream(glovePath),
    crlfDelay: Infinity,
  });

  // Parse each line: first token = word, rest = vector values
  for await (const line of rl) {
    const [word, ...values] = line.split(" ");
    wordVectors.set(word, values.map(Number));
  }
}

// Get the vector for a single word
function getWordVector(word) {
  if (!word) return null;
  return wordVectors.get(word.toLowerCase()) || null;
}

// Compute the average vector for an array of words
function getAverageVector(words) {
  // If no words provided, return a zero vector of correct dimension
  if (!words || !Array.isArray(words) || words.length === 0) {
    return Array(
      wordVectors.size > 0
        ? wordVectors.get(wordVectors.keys().next().value).length
        : 300
    ).fill(0);
  }

  // Get vector size from the first word in the loaded map
  const vectorSize =
    wordVectors.size > 0
      ? wordVectors.get(wordVectors.keys().next().value).length
      : 300;

  const result = Array(vectorSize).fill(0);
  let count = 0;

  // Sum all valid word vectors
  for (const word of words) {
    if (!word) continue;
    const vector = getWordVector(word);
    if (vector) {
      for (let i = 0; i < vector.length; i++) {
        result[i] += vector[i];
      }
      count++;
    }
  }

  // Normalize by dividing by the number of valid words
  if (count > 0) {
    for (let i = 0; i < result.length; i++) {
      result[i] /= count;
    }
  }

  return result;
}

// Convert a sentence into a vector by averaging word vectors
function getSentenceVector(sentence) {
  if (!sentence) return null;
  const words = sentence.toLowerCase().split(/\s+/);
  return getAverageVector(words);
}

module.exports = { loadGlove, getWordVector, getAverageVector, getSentenceVector };
