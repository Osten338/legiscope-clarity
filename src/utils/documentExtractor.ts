
import mammoth from 'mammoth';

export interface ExtractedContent {
  text: string;
  success: boolean;
  error?: string;
}

export class DocumentExtractor {
  static async extractText(file: File): Promise<ExtractedContent> {
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      switch (fileExtension) {
        case 'docx':
          return await this.extractFromDocx(file);
        case 'txt':
          return await this.extractFromText(file);
        case 'pdf':
          // For now, we'll handle PDF as text - could add pdf-parse later
          return await this.extractFromText(file);
        default:
          // Try to read as text for unknown formats
          return await this.extractFromText(file);
      }
    } catch (error) {
      return {
        text: '',
        success: false,
        error: `Failed to extract text: ${error.message}`
      };
    }
  }

  private static async extractFromDocx(file: File): Promise<ExtractedContent> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      return {
        text: result.value,
        success: true
      };
    } catch (error) {
      return {
        text: '',
        success: false,
        error: `Failed to extract from DOCX: ${error.message}`
      };
    }
  }

  private static async extractFromText(file: File): Promise<ExtractedContent> {
    try {
      const text = await file.text();
      return {
        text,
        success: true
      };
    } catch (error) {
      return {
        text: '',
        success: false,
        error: `Failed to read text file: ${error.message}`
      };
    }
  }

  static validateExtractedContent(content: string): boolean {
    // Check if content looks like binary/corrupted data
    const binaryPattern = /[\x00-\x08\x0E-\x1F\x7F-\xFF]/g;
    const binaryCharCount = (content.match(binaryPattern) || []).length;
    const totalChars = content.length;
    
    // If more than 20% of characters are binary, consider it corrupted
    if (totalChars > 0 && (binaryCharCount / totalChars) > 0.2) {
      return false;
    }
    
    return true;
  }
}
