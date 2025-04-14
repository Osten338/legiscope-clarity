
// Utility functions for calculating similarity between embeddings

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: any): number {
  try {
    // Handle PostgreSQL vector format which might be stored as a string
    if (typeof vecB === 'string') {
      try {
        // Try to parse if it's a JSON string
        vecB = JSON.parse(vecB);
      } catch {
        // If not a valid JSON, try to parse vector format from string
        // Expecting format like "[0.1, 0.2, 0.3, ...]" or "{0.1, 0.2, 0.3, ...}"
        const vectorStr = vecB.replace(/[\[\]{}]/g, '').trim();
        const values = vectorStr.split(',').map(v => parseFloat(v.trim()));
        
        if (Array.isArray(values) && !isNaN(values[0])) {
          vecB = values;
        } else {
          console.error("Could not parse vector from string:", vecB.substring(0, 100) + "...");
          return 0;
        }
      }
    }
    
    // Convert vecB to array if it's not already one
    const vecBArray = Array.isArray(vecB) ? vecB : Object.values(vecB || {});
    
    // Ideally vectors should be the same length for proper comparison
    // If they're not, we'll use the smaller length to avoid errors
    if (!Array.isArray(vecA) || vecBArray.length === 0) {
      console.log(`Vector format issue: vecA is array: ${Array.isArray(vecA)}, vecA length: ${vecA?.length}, vecB length: ${vecBArray?.length}`);
      return 0;
    }
    
    // If vector lengths don't match, use the shorter length
    const minLength = Math.min(vecA.length, vecBArray.length);
    
    // Calculate cosine similarity using the first minLength dimensions
    const dotProduct = Array.from({length: minLength}, (_, i) => vecA[i] * vecBArray[i])
      .reduce((sum, val) => sum + val, 0);
      
    const magA = Math.sqrt(Array.from({length: minLength}, (_, i) => vecA[i] * vecA[i])
      .reduce((sum, val) => sum + val, 0));
      
    const magB = Math.sqrt(Array.from({length: minLength}, (_, i) => vecBArray[i] * vecBArray[i])
      .reduce((sum, val) => sum + val, 0));
    
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
