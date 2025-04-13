
// Utility functions for calculating similarity between embeddings

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magA === 0 || magB === 0) {
    return 0;
  }
  
  return dotProduct / (magA * magB);
}

/**
 * Find the most similar documents based on embeddings
 */
export function findSimilarDocuments(
  queryEmbedding: number[],
  documentEmbeddings: { id: string; embedding: number[]; content: string }[],
  topK: number = 3
): { id: string; similarity: number; content: string }[] {
  // Calculate similarity scores for each document
  const similarities = documentEmbeddings.map(doc => ({
    id: doc.id,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding),
    content: doc.content
  }));
  
  // Sort by similarity (descending)
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  // Return top K results
  return similarities.slice(0, topK);
}
