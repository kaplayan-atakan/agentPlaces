import { Injectable, Logger } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import * as fs from 'fs';

// PDF Parse result interface
interface PdfParseResult {
  text: string;
  numpages: number;
  metadata?: Record<string, any>;
  info?: Record<string, any>;
  version?: string;
}

@Injectable()
export class PdfParserService {
  private readonly logger = new Logger(PdfParserService.name);

  async extractText(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const data = (await (pdfParse as any)(dataBuffer)) as PdfParseResult;

      this.logger.log(`PDF text extracted: ${data.text.length} characters`);
      return data.text;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`PDF parsing error: ${errorMessage}`);
      throw new Error(`PDF parsing failed: ${errorMessage}`);
    }
  }
  async analyzePdf(filePath: string): Promise<any> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const data = (await (pdfParse as any)(dataBuffer)) as PdfParseResult;

      const analysis = {
        pageCount: data.numpages,
        textLength: data.text.length,
        wordCount: data.text.split(/\s+/).filter((word) => word.length > 0)
          .length,
        extractedAt: new Date(),
        metadata: data.metadata || {},

        // Basic text analysis
        hasImages: data.text.includes('[image]') || data.text.includes('[img]'),
        hasTables: this.detectTables(data.text),
        language: this.detectLanguage(data.text),

        // Content structure
        headings: this.extractHeadings(data.text),
        paragraphs: data.text.split('\n\n').filter((p) => p.trim().length > 0)
          .length,

        // Document characteristics
        isEmpty: data.text.trim().length === 0,
        isScanned: this.detectScannedDocument(data.text),
      };

      this.logger.log(
        `PDF analyzed: ${analysis.pageCount} pages, ${analysis.wordCount} words`,
      );
      return analysis;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`PDF analysis error: ${errorMessage}`);
      throw new Error(`PDF analysis failed: ${errorMessage}`);
    }
  }

  private detectTables(text: string): boolean {
    // Simple table detection based on patterns
    const tablePatterns = [
      /\|\s*\w+\s*\|/g, // Pipe-separated
      /\t\w+\t/g, // Tab-separated
      /\s{3,}\w+\s{3,}/g, // Space-separated columns
    ];

    return tablePatterns.some((pattern) => pattern.test(text));
  }

  private detectLanguage(text: string): string {
    // Simple language detection
    const sample = text.substring(0, 500).toLowerCase();

    const turkishChars = /[çğıöşü]/g;
    const englishCommon =
      /\b(the|and|that|have|for|not|with|you|this|but|his|from|they)\b/g;
    const turkishCommon =
      /\b(ve|bir|bu|için|ile|olan|olan|der|gibi|çok|daha)\b/g;

    const turkishCharCount = (sample.match(turkishChars) || []).length;
    const englishWords = (sample.match(englishCommon) || []).length;
    const turkishWords = (sample.match(turkishCommon) || []).length;

    if (turkishCharCount > 0 || turkishWords > englishWords) {
      return 'tr';
    } else if (englishWords > 0) {
      return 'en';
    }

    return 'unknown';
  }

  private extractHeadings(text: string): string[] {
    // Extract potential headings (all caps lines, numbered sections, etc.)
    const lines = text.split('\n');
    const headings: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 0) {
        // All caps lines (potential headings)
        if (trimmed === trimmed.toUpperCase() && trimmed.length < 100) {
          headings.push(trimmed);
        }
        // Numbered sections
        else if (/^\d+\.?\s+[A-Z]/.test(trimmed)) {
          headings.push(trimmed);
        }
        // Lines starting with capital and ending with no punctuation
        else if (/^[A-Z][^.!?]*$/.test(trimmed) && trimmed.length < 80) {
          headings.push(trimmed);
        }
      }
    }

    return headings.slice(0, 20); // Limit to 20 headings
  }

  private detectScannedDocument(text: string): boolean {
    // Heuristics to detect if PDF is from scanned images
    const textLength = text.trim().length;
    if (textLength === 0) return true;

    const wordCount = text.split(/\s+/).length;
    const avgWordLength = textLength / wordCount;

    // Very short average word length might indicate OCR errors
    if (avgWordLength < 3) return true;

    // High ratio of single characters might indicate poor OCR
    const singleChars = text.match(/\s[a-zA-Z]\s/g) || [];
    const singleCharRatio = singleChars.length / wordCount;

    return singleCharRatio > 0.1;
  }
}
