import { Injectable, Logger } from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as xlsx from 'xlsx';
import * as fs from 'fs';

@Injectable()
export class DocumentAnalyzerService {
  private readonly logger = new Logger(DocumentAnalyzerService.name);

  async extractFromWord(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      this.logger.log(
        `Word document processed: ${result.value.length} characters`,
      );
      return result.value;
    } catch (error) {
      this.logger.error(`Word processing error: ${error.message}`);
      throw new Error(`Word document processing failed: ${error.message}`);
    }
  }

  async extractFromExcel(filePath: string): Promise<any> {
    try {
      const workbook = xlsx.readFile(filePath);
      const result: any = {
        sheets: {},
        summary: {
          sheetCount: workbook.SheetNames.length,
          sheetNames: workbook.SheetNames,
          totalRows: 0,
          totalCells: 0,
        },
      };

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        result.sheets[sheetName] = {
          data: jsonData.slice(0, 100), // Limit to 100 rows for preview
          rowCount: jsonData.length,
          columnCount: Math.max(...jsonData.map((row: any) => row.length)),
          headers: jsonData[0] || [],
        };

        result.summary.totalRows += jsonData.length;
        result.summary.totalCells += jsonData.reduce(
          (sum: number, row: any) => sum + row.length,
          0,
        );
      });

      this.logger.log(
        `Excel processed: ${result.summary.sheetCount} sheets, ${result.summary.totalRows} rows`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Excel processing error: ${error.message}`);
      throw new Error(`Excel processing failed: ${error.message}`);
    }
  }

  async extractFromPowerPoint(filePath: string): Promise<any> {
    // PowerPoint processing would require additional libraries
    // For now, return basic file info
    try {
      const stats = fs.statSync(filePath);
      return {
        message: 'PowerPoint processing not yet implemented',
        fileSize: stats.size,
        lastModified: stats.mtime,
      };
    } catch (error) {
      this.logger.error(`PowerPoint processing error: ${error.message}`);
      throw new Error(`PowerPoint processing failed: ${error.message}`);
    }
  }

  async analyzeTextContent(text: string): Promise<any> {
    return {
      length: text.length,
      wordCount: text.split(/\s+/).filter((word) => word.length > 0).length,
      paragraphs: text.split('\n\n').filter((p) => p.trim().length > 0).length,
      lines: text.split('\n').length,
      language: this.detectLanguage(text),
      readingTime: Math.ceil(text.split(/\s+/).length / 200), // minutes
      structure: this.analyzeStructure(text),
    };
  }

  private detectLanguage(text: string): string {
    const sample = text.substring(0, 500).toLowerCase();
    const turkishChars = /[çğıöşü]/g;
    const englishCommon = /\b(the|and|that|have|for|not|with|you|this|but)\b/g;
    const turkishCommon = /\b(ve|bir|bu|için|ile|olan|der|gibi|çok|daha)\b/g;

    const turkishCharCount = (sample.match(turkishChars) || []).length;
    const englishWords = (sample.match(englishCommon) || []).length;
    const turkishWords = (sample.match(turkishCommon) || []).length;

    if (turkishCharCount > 0 || turkishWords > englishWords) return 'tr';
    if (englishWords > 0) return 'en';
    return 'unknown';
  }

  private analyzeStructure(text: string): any {
    const lines = text.split('\n');

    return {
      hasHeaders: lines.some((line) => /^#{1,6}\s/.test(line.trim())),
      hasBulletPoints: lines.some((line) => /^[\*\-\+]\s/.test(line.trim())),
      hasNumberedList: lines.some((line) => /^\d+\.\s/.test(line.trim())),
      hasEmptyLines: lines.some((line) => line.trim() === ''),
      avgLineLength:
        lines.reduce((sum, line) => sum + line.length, 0) / lines.length,
      maxLineLength: Math.max(...lines.map((line) => line.length)),
    };
  }
}
