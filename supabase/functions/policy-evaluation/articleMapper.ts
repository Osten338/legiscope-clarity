
// Article Reference Mapping and Enhancement System

export interface ArticleReference {
  article_id: string
  section: string
  subsection?: string
  paragraph?: string
  full_reference: string
  excerpt: string
  relevance_score: number
}

export class ArticleReferenceMapper {
  // Common regulation patterns for better article extraction
  private readonly patterns = {
    gdpr: {
      articles: /Article\s+(\d+)/gi,
      sections: /\((\d+)\)/g,
      recitals: /Recital\s+(\d+)/gi
    },
    ccpa: {
      sections: /Section\s+(\d+(?:\.\d+)*)/gi,
      subsections: /\(([a-z])\)/g
    },
    sox: {
      sections: /Section\s+(\d+)/gi,
      rules: /Rule\s+(\d+[a-z]?-\d+)/gi
    },
    generic: {
      sections: /(?:Section|Sec\.?|§)\s*(\d+(?:\.\d+)*)/gi,
      paragraphs: /(?:Paragraph|Para\.?|¶)\s*(\d+(?:\.\d+)*)/gi,
      articles: /(?:Article|Art\.?)\s*(\d+(?:\.\d+)*)/gi
    }
  };

  extractArticleReferences(text: string, regulationType?: string): ArticleReference[] {
    const references: ArticleReference[] = [];
    const patternSet = this.patterns[regulationType as keyof typeof this.patterns] || this.patterns.generic;

    // Extract different types of references based on regulation type
    Object.entries(patternSet).forEach(([type, pattern]) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        const reference: ArticleReference = {
          article_id: match[1],
          section: type,
          full_reference: match[0],
          excerpt: this.extractSurroundingContext(text, match.index || 0),
          relevance_score: this.calculateRelevanceScore(match[0], text)
        };
        references.push(reference);
      });
    });

    // Remove duplicates and sort by relevance
    return this.deduplicateAndSort(references);
  }

  private extractSurroundingContext(text: string, index: number, contextLength = 200): string {
    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + contextLength);
    return text.substring(start, end).trim();
  }

  private calculateRelevanceScore(reference: string, fullText: string): number {
    // Simple relevance scoring based on frequency and position
    const frequency = (fullText.match(new RegExp(reference.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
    const position = fullText.indexOf(reference) / fullText.length;
    
    // Higher score for more frequent references appearing earlier in text
    return Math.min(1.0, (frequency * 0.3) + ((1 - position) * 0.7));
  }

  private deduplicateAndSort(references: ArticleReference[]): ArticleReference[] {
    const unique = references.filter((ref, index, self) => 
      index === self.findIndex(r => r.full_reference === ref.full_reference)
    );
    
    return unique.sort((a, b) => b.relevance_score - a.relevance_score);
  }

  enhanceReferences(references: string[], regulationText: string): ArticleReference[] {
    const enhanced: ArticleReference[] = [];

    references.forEach(ref => {
      const extracted = this.extractArticleReferences(regulationText);
      const matching = extracted.find(e => 
        e.full_reference.toLowerCase().includes(ref.toLowerCase()) ||
        ref.toLowerCase().includes(e.article_id)
      );

      if (matching) {
        enhanced.push(matching);
      } else {
        // Create basic reference if no match found
        enhanced.push({
          article_id: ref,
          section: 'unknown',
          full_reference: ref,
          excerpt: '',
          relevance_score: 0.5
        });
      }
    });

    return enhanced;
  }
}
