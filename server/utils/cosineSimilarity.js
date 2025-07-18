// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  // ✅ If vectors are missing or lengths don't match, return 0 (no similarity)
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dot = 0,      // dot product of vecA and vecB
      normA = 0,    // magnitude (squared) of vecA
      normB = 0;    // magnitude (squared) of vecB

  // ✅ Compute dot product and magnitudes
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];       // sum of element-wise products
    normA += vecA[i] ** 2;          // sum of squares of vecA
    normB += vecB[i] ** 2;          // sum of squares of vecB
  }

  // ✅ Return cosine similarity:
  // Formula: (A · B) / (||A|| * ||B||)
  // If either vector has zero magnitude, return 0 (to avoid division by zero)
  return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}

module.exports = cosineSimilarity;
