
// Utility functions for calculating similarity between embeddings

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: any): number {
  try {
    // Convert vecB to array if it's not already one
    const vecBArray = Array.isArray(vecB) ? vecB : Object.values(vecB || {});
    
    if (!Array.isArray(vecA) || vecBArray.length === 0 || vecA.length !== vecBArray.length) {
      console.log(`Vector format issue: vecA is array: ${Array.isArray(vecA)}, vecA length: ${vecA?.length}, vecB length: ${vecBArray?.length}`);
      return 0;
    }
    
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecBArray[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecBArray.reduce((sum, b) => sum + b * b, 0));
    
    if (magA === 0 || magB === 0) {
      return 0;
    }
    
    return dotProduct / (magA * magB);
  } catch (error) {
    console.error("Error in cosineSimilarity:", error);
    return 0;
  }
}

/**
 * Find the most similar documents based on embeddings
 */
export function findSimilarDocuments(
  queryEmbedding: number[],
  documentEmbeddings: { id: string; embedding: any; content: string }[],
  topK: number = 3
): { id: string; similarity: number; content: string }[] {
  // Calculate similarity scores for each document
  const similarities = documentEmbeddings.map(doc => {
    try {
      return {
        id: doc.id,
        similarity: cosineSimilarity(queryEmbedding, doc.embedding),
        content: doc.content
      };
    } catch (err) {
      console.error(`Error processing document ${doc.id}:`, err);
      return {
        id: doc.id,
        similarity: 0,
        content: doc.content
      };
    }
  });
  
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
