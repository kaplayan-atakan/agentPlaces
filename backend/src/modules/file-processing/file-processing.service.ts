import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

import { File, FileDocument } from './schemas/file.schema';
import { FileQueryDto, ProcessFileDto } from './dto/file.dto';
import { PdfParserService } from './services/pdf-parser.service';
import { MailParserService } from './services/mail-parser.service';
import { DocumentAnalyzerService } from './services/document-analyzer.service';
import { FileQueueService } from './services/file-queue.service';

@Injectable()
export class FileProcessingService {
  private readonly logger = new Logger(FileProcessingService.name);
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private pdfParser: PdfParserService,
    private mailParser: MailParserService,
    private docAnalyzer: DocumentAnalyzerService,
    // private queueService: FileQueueService, // Temporarily disabled
  ) {}

  async uploadFile(file: Express.Multer.File, metadata: any) {
    try {
      const fileDoc = new this.fileModel({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        uploadedBy: metadata.uploadedBy || 'anonymous',
        status: 'pending',
        metadata: metadata,
      });

      const savedFile = await fileDoc.save();
      this.logger.log(`File uploaded: ${file.originalname} (${savedFile._id})`); // Add to processing queue - Temporarily disabled
      // await this.queueService.addFileToQueue(String(savedFile._id));

      return savedFile;
    } catch (error) {
      this.logger.error(`File upload error: ${error.message}`);
      throw error;
    }
  }

  async getFiles(query: FileQueryDto) {
    const { page = 1, limit = 10, status, mimetype, search } = query;

    const filter: any = { isActive: true };

    if (status) filter.status = status;
    if (mimetype) filter.mimetype = { $regex: mimetype, $options: 'i' };
    if (search) {
      filter.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { filename: { $regex: search, $options: 'i' } },
        { extractedText: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      this.fileModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.fileModel.countDocuments(filter).exec(),
    ]);

    return {
      files,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: files.length,
        totalFiles: total,
      },
    };
  }

  async getFileById(id: string) {
    const file = await this.fileModel.findById(id).exec();
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return file;
  }

  async processFile(id: string, options: ProcessFileDto) {
    const file = await this.getFileById(id);

    try {
      file.status = 'processing';
      await file.save();

      let extractedText = '';
      let analysisResult = {};

      // Process based on file type
      switch (file.mimetype) {
        case 'application/pdf':
          extractedText = await this.pdfParser.extractText(file.path);
          if (options.analyzeContent) {
            analysisResult = await this.pdfParser.analyzePdf(file.path);
          }
          break;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          extractedText = await this.docAnalyzer.extractFromWord(file.path);
          break;

        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          analysisResult = await this.docAnalyzer.extractFromExcel(file.path);
          break;

        case 'message/rfc822':
          const mailResult = await this.mailParser.parseEmail(file.path);
          extractedText = mailResult.text;
          analysisResult = mailResult.analysis;
          break;

        case 'text/plain':
          extractedText = fs.readFileSync(file.path, 'utf-8');
          break;

        default:
          throw new Error(`Unsupported file type: ${file.mimetype}`);
      }

      // Update file document
      file.extractedText = extractedText;
      file.analysisResult = analysisResult;
      file.status = 'completed';
      file.processedAt = new Date();

      await file.save();

      this.logger.log(`File processed successfully: ${file.filename}`);
      return file;
    } catch (error) {
      file.status = 'failed';
      file.errorMessage = error.message;
      await file.save();

      this.logger.error(`File processing failed: ${error.message}`);
      throw error;
    }
  }

  async getFileAnalysis(id: string) {
    const file = await this.getFileById(id);

    if (file.status !== 'completed') {
      return { message: 'File not yet processed or processing failed' };
    }

    return {
      fileInfo: {
        name: file.originalName,
        size: file.size,
        type: file.mimetype,
        processedAt: file.processedAt,
      },
      extractedText: file.extractedText?.substring(0, 1000) + '...', // Preview
      analysisResult: file.analysisResult,
      textLength: file.extractedText?.length || 0,
    };
  }

  async updateFile(id: string, updateData: any) {
    const file = await this.fileModel
      .findByIdAndUpdate(
        id,
        { $set: updateData, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file;
  }

  async deleteFile(id: string) {
    const file = await this.getFileById(id);

    try {
      // Delete physical file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      // Mark as deleted
      file.isActive = false;
      await file.save();

      this.logger.log(`File deleted: ${file.filename}`);
      return { message: 'File deleted successfully' };
    } catch (error) {
      this.logger.error(`File deletion error: ${error.message}`);
      throw error;
    }
  }

  async getFileStats() {
    const stats = await this.fileModel
      .aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalSize: { $sum: '$size' },
          },
        },
      ])
      .exec();

    const fileTypeStats = await this.fileModel
      .aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$mimetype',
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    return {
      statusStats: stats,
      fileTypeStats,
      totalFiles: await this.fileModel
        .countDocuments({ isActive: true })
        .exec(),
    };
  }
}
