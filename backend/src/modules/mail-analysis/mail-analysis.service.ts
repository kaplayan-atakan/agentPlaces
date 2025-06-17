import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailThread, MailThreadDocument } from './schemas/mail-thread.schema';
import {
  MailAnalysis,
  MailAnalysisDocument,
} from './schemas/mail-analysis.schema';
import { ThreadAnalyzerService } from './services/thread-analyzer.service';
import { ResponseGeneratorService } from './services/response-generator.service';
import { SentimentAnalysisService } from './services/sentiment-analysis.service';
import {
  AnalyzeMailDto,
  GenerateResponseDto,
  CreateThreadDto,
  UpdateThreadDto,
} from './dto/mail-analysis.dto';

@Injectable()
export class MailAnalysisService {
  private readonly logger = new Logger(MailAnalysisService.name);

  constructor(
    @InjectModel(MailThread.name)
    private mailThreadModel: Model<MailThreadDocument>,
    @InjectModel(MailAnalysis.name)
    private mailAnalysisModel: Model<MailAnalysisDocument>,
    private threadAnalyzerService: ThreadAnalyzerService,
    private responseGeneratorService: ResponseGeneratorService,
    private sentimentAnalysisService: SentimentAnalysisService,
  ) {}

  async analyzeMail(analyzeMailDto: AnalyzeMailDto): Promise<MailAnalysis> {
    try {
      this.logger.log(`Analyzing mail: ${analyzeMailDto.subject}`);

      // Sentiment analysis
      const sentiment = await this.sentimentAnalysisService.analyzeSentiment(
        analyzeMailDto.body,
      );

      // Classification
      const classification = this.classifyMail(
        analyzeMailDto.subject,
        analyzeMailDto.body,
      );

      // Urgency detection
      const urgency = this.detectUrgency(
        analyzeMailDto.subject,
        analyzeMailDto.body,
      );

      // Entity extraction
      const entities = this.extractEntities(analyzeMailDto.body);

      // Intent detection
      const intent = this.detectIntent(
        analyzeMailDto.subject,
        analyzeMailDto.body,
      );

      // Create analysis record
      const analysis = new this.mailAnalysisModel({
        threadId: analyzeMailDto.threadId || this.generateThreadId(),
        messageId: this.generateMessageId(),
        sentiment,
        classification,
        urgency,
        entities,
        intent,
        language: this.detectLanguage(analyzeMailDto.body),
        suggestedActions: this.generateSuggestedActions(classification, urgency),
        responseRequired: this.isResponseRequired(classification, urgency),
        agentId: analyzeMailDto.agentId,
        processedAt: new Date(),
        metadata: {
          from: analyzeMailDto.from,
          to: analyzeMailDto.to,
          subject: analyzeMailDto.subject,
        },
      });

      await analysis.save();
      this.logger.log(`Mail analysis completed: ${String(analysis._id)}`);

      return analysis;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Mail analysis error: ${errorMessage}`);
      throw new Error(`Mail analysis failed: ${errorMessage}`);
    }
  }

  async generateResponse(
    generateResponseDto: GenerateResponseDto,
  ): Promise<any> {
    try {
      this.logger.log(`Generating response for thread: ${generateResponseDto.threadId}`);

      const thread = await this.mailThreadModel.findOne({
        threadId: generateResponseDto.threadId,
      });

      if (!thread) {
        throw new Error('Thread not found');
      }

      const analysis = await this.mailAnalysisModel.findOne({
        threadId: generateResponseDto.threadId,
      });

      const response = await this.responseGeneratorService.generateResponse({
        thread,
        analysis,
        context: generateResponseDto.context,
        tone: generateResponseDto.tone || 'professional',
        language: generateResponseDto.language || 'en',
      });

      this.logger.log(`Response generated for thread: ${generateResponseDto.threadId}`);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Response generation error: ${errorMessage}`);
      throw new Error(`Response generation failed: ${errorMessage}`);
    }
  }

  async createThread(createThreadDto: CreateThreadDto): Promise<any> {
    try {
      const thread = new this.mailThreadModel({
        subject: createThreadDto.subject,
        participants: createThreadDto.participants,
        messages: [],
        threadId: this.generateThreadId(),
        status: 'active',
        messageCount: 0,
        labels: createThreadDto.labels || [],
        agentId: createThreadDto.agentId,
        metadata: {},
      });

      await thread.save();
      this.logger.log(`Thread created: ${thread.threadId}`);
      return thread;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Thread creation error: ${errorMessage}`);
      throw new Error(`Thread creation failed: ${errorMessage}`);
    }
  }

  async getThreads(agentId?: string): Promise<any[]> {
    try {
      const query = agentId ? { agentId } : {};
      const threads = await this.mailThreadModel
        .find(query)
        .sort({ lastMessageDate: -1 })
        .limit(100);

      return threads;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Get threads error: ${errorMessage}`);
      throw new Error(`Get threads failed: ${errorMessage}`);
    }
  }

  async updateThread(
    threadId: string,
    updateThreadDto: UpdateThreadDto,
  ): Promise<any> {
    try {
      const thread = await this.mailThreadModel.findOneAndUpdate(
        { threadId },
        updateThreadDto,
        { new: true },
      );

      if (!thread) {
        throw new Error('Thread not found');
      }

      this.logger.log(`Thread updated: ${threadId}`);
      return thread;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Thread update error: ${errorMessage}`);
      throw new Error(`Thread update failed: ${errorMessage}`);
    }
  }

  private classifyMail(subject: string, body: string): any {
    const combined = (subject + ' ' + body).toLowerCase();
    let category = 'general';
    let subcategory = 'other';
    let confidence = 0.5;

    // Business categories
    if (combined.includes('meeting') || combined.includes('toplantı')) {
      category = 'meeting';
      subcategory = 'schedule';
      confidence = 0.8;
    } else if (combined.includes('invoice') || combined.includes('fatura')) {
      category = 'billing';
      subcategory = 'invoice';
      confidence = 0.9;
    } else if (combined.includes('support') || combined.includes('destek')) {
      category = 'support';
      subcategory = 'request';
      confidence = 0.7;
    } else if (
      combined.includes('newsletter') ||
      combined.includes('bülten')
    ) {
      category = 'marketing';
      subcategory = 'newsletter';
      confidence = 0.9;
    }

    return { category, subcategory, confidence };
  }

  private detectUrgency(subject: string, body: string): any {
    const combined = (subject + ' ' + body).toLowerCase();
    let level = 'low';
    let score = 0;
    const indicators: string[] = [];

    // High urgency indicators
    if (/acil|urgent|asap|hemen|immediately/i.test(combined)) {
      score += 3;
      indicators.push('urgent_keywords');
    }
    if (/önemli|important|critical|kritik/i.test(combined)) {
      score += 2;
      indicators.push('important_keywords');
    }
    if (/bugün|today|yarın|tomorrow/i.test(combined)) {
      score += 1;
      indicators.push('time_sensitive');
    }

    if (score >= 3) level = 'critical';
    else if (score >= 2) level = 'high';
    else if (score >= 1) level = 'medium';

    return { level, score, indicators };
  }

  private extractEntities(text: string): any {
    return {
      people: this.extractPeople(text),
      organizations: this.extractOrganizations(text),
      dates: this.extractDates(text),
      locations: this.extractLocations(text),
      amounts: this.extractAmounts(text),
    };
  }

  private extractPeople(text: string): string[] {
    // Simple name extraction - could be enhanced with NER
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    return text.match(namePattern) || [];
  }

  private extractOrganizations(text: string): string[] {
    // Simple organization extraction
    const orgPattern = /\b[A-Z][a-z]+ (Inc|Ltd|Corp|Company|Şirketi)\b/g;
    return text.match(orgPattern) || [];
  }

  private extractDates(text: string): string[] {
    const datePatterns = [
      /\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}/g,
      /\d{4}[/\-.]\d{1,2}[/\-.]\d{1,2}/g,
    ];

    const dates: string[] = [];
    datePatterns.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      dates.push(...matches);
    });

    return [...new Set(dates)];
  }

  private extractLocations(text: string): string[] {
    // Simple location extraction - could be enhanced with NER
    const locationPattern = /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*(?:\s(?:City|İl|Province|Country))\b/g;
    return text.match(locationPattern) || [];
  }

  private extractAmounts(text: string): string[] {
    const amountPatterns = [
      /\$[\d,]+\.?\d*/g,
      /\d+[\s]?TL/g,
      /€[\d,]+\.?\d*/g,
    ];

    const amounts: string[] = [];
    amountPatterns.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      amounts.push(...matches);
    });

    return [...new Set(amounts)];
  }

  private detectIntent(subject: string, body: string): any {
    const combined = (subject + ' ' + body).toLowerCase();
    let primary = 'information';
    const secondary: string[] = [];
    let confidence = 0.5;

    if (combined.includes('request') || combined.includes('rica')) {
      primary = 'request';
      confidence = 0.8;
    } else if (combined.includes('question') || combined.includes('soru')) {
      primary = 'question';
      confidence = 0.8;
    } else if (combined.includes('complaint') || combined.includes('şikayet')) {
      primary = 'complaint';
      confidence = 0.9;
    } else if (combined.includes('thank') || combined.includes('teşekkür')) {
      primary = 'appreciation';
      confidence = 0.8;
    }

    return { primary, secondary, confidence };
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

  private generateSuggestedActions(classification: any, urgency: any): string[] {
    const actions: string[] = [];

    if (urgency.level === 'critical') {
      actions.push('immediate_response_required');
    } else if (urgency.level === 'high') {
      actions.push('priority_response');
    }

    if (classification.category === 'support') {
      actions.push('assign_to_support_team');
    } else if (classification.category === 'billing') {
      actions.push('forward_to_finance');
    } else if (classification.category === 'meeting') {
      actions.push('add_to_calendar');
    }

    return actions;
  }

  private isResponseRequired(classification: any, urgency: any): boolean {
    return urgency.level !== 'low' || classification.category === 'support';
  }

  private generateThreadId(): string {
    return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
