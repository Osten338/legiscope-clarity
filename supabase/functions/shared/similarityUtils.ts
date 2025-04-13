
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

/**
 * Find similar documents from a database using vector similarity
 */
export async function findSimilarDocumentsFromDb(
  client: any,
  queryEmbedding: number[],
  topK: number = 3,
  similarityThreshold: number = 0.7
): Promise<{ id: string; similarity: number; content: string }[]> {
  try {
    const { data, error } = await client
      .rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: similarityThreshold,
        match_count: topK
      });

    if (error) {
      console.error('Error finding similar documents:', error);
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      similarity: item.similarity,
      content: item.content
    }));
  } catch (error) {
    console.error('Error in findSimilarDocumentsFromDb:', error);
    return [];
  }
}
