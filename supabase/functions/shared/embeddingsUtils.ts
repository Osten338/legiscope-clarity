
// Utility functions for generating and working with OpenAI embeddings

export async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message || 'Failed to generate embedding');
    }

    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export async function batchGenerateEmbeddings(texts: string[], apiKey: string): Promise<number[][]> {
  // Process in batches to avoid rate limits
  const batchSize = 10;
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchPromises = batch.map(text => generateEmbedding(text, apiKey));
    const batchEmbeddings = await Promise.all(batchPromises);
    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}

export async function storeEmbedding(
  client: any,
  content: string,
  embedding: number[],
  metadata: any = {}
): Promise<string | null> {
  try {
    const { data, error } = await client
      .from('document_embeddings')
      .insert({
        content,
        embedding,
        metadata
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error storing embedding:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error in storeEmbedding:', error);
    return null;
  }
}

export async function getDocumentEmbedding(
  client: any,
  documentId: string
): Promise<{ content: string; embedding: number[] } | null> {
  try {
    const { data, error } = await client
      .from('document_embeddings')
      .select('content, embedding')
      .eq('id', documentId)
      .single();

    if (error || !data) {
      console.error('Error retrieving document embedding:', error);
      return null;
    }

    return {
      content: data.content,
      embedding: data.embedding
    };
  } catch (error) {
    console.error('Error in getDocumentEmbedding:', error);
    return null;
  }
}
