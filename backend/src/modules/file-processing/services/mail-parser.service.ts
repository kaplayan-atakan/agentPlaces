import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';

// Email parsing interfaces
interface EmailHeaders {
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
  'message-id'?: string;
  [key: string]: string | undefined;
}

interface ParsedEmail {
  from: string;
  to: string;
  subject: string;
  date: string;
  messageId: string;
  body: string;
  headers: EmailHeaders;
}

interface EmailAnalysis {
  sentiment: string;
  priority: string;
  category: string;
  language: string;
  isReply: boolean;
  hasAttachments: boolean;
  urgency: string;
  wordCount: number;
  readingTime: number;
  extractedInfo: any;
}

interface EmailResult extends ParsedEmail {
  analysis: EmailAnalysis;
  text: string;
}

@Injectable()
export class MailParserService {
  private readonly logger = new Logger(MailParserService.name);

  async parseEmail(filePath: string): Promise<EmailResult> {
    try {
      const emailContent = fs.readFileSync(filePath, 'utf-8');

      const parsedEmail = this.parseEmailContent(emailContent);
      const analysis = this.analyzeEmail(parsedEmail);

      this.logger.log(`Email parsed: ${parsedEmail.subject}`);

      return {
        ...parsedEmail,
        analysis,
        text: parsedEmail.body,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Email parsing error: ${errorMessage}`);
      throw new Error(`Email parsing failed: ${errorMessage}`);
    }
  }

  private parseEmailContent(content: string): ParsedEmail {
    const lines = content.split('\n');
    const headers: EmailHeaders = {};
    let bodyStartIndex = 0;

    // Parse headers
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') {
        bodyStartIndex = i + 1;
        break;
      }

      const headerMatch = line.match(/^([^:]+):\s*(.*)$/);
      if (headerMatch) {
        const [, key, value] = headerMatch;
        headers[key.toLowerCase().trim()] = value.trim();
      }
    }

    // Parse body
    const body = lines.slice(bodyStartIndex).join('\n').trim();

    return {
      from: headers.from || '',
      to: headers.to || '',
      subject: headers.subject || '',
      date: headers.date || '',
      messageId: headers['message-id'] || '',
      body,
      headers,
    };
  }

  private analyzeEmail(email: ParsedEmail): EmailAnalysis {
    const body = email.body || '';
    const subject = email.subject || '';

    return {
      sentiment: this.analyzeSentiment(body),
      priority: this.detectPriority(subject, body),
      category: this.categorizeEmail(subject, body),
      language: this.detectLanguage(body),
      isReply: this.isReplyEmail(subject),
      hasAttachments: this.detectAttachments(body),
      urgency: this.detectUrgency(subject, body),
      wordCount: body.split(/\s+/).filter((word) => word.length > 0).length,
      readingTime: Math.ceil(body.split(/\s+/).length / 200), // minutes
      extractedInfo: this.extractKeyInformation(body),
    };
  }

  private analyzeSentiment(text: string): string {
    // Simple sentiment analysis
    const positiveWords = [
      'teşekkür',
      'memnun',
      'harika',
      'başarılı',
      'mükemmel',
      'thank',
      'great',
      'excellent',
      'amazing',
    ];
    const negativeWords = [
      'sorun',
      'problem',
      'hata',
      'şikayet',
      'kızgın',
      'problem',
      'issue',
      'error',
      'complaint',
      'angry',
    ];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter((word) =>
      lowerText.includes(word),
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerText.includes(word),
    ).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private detectPriority(subject: string, body: string): string {
    const urgentKeywords = [
      'acil',
      'urgent',
      'asap',
      'önemli',
      'important',
      'hemen',
      'immediately',
    ];
    const combined = (subject + ' ' + body).toLowerCase();

    return urgentKeywords.some((keyword) => combined.includes(keyword))
      ? 'high'
      : 'normal';
  }

  private categorizeEmail(subject: string, body: string): string {
    const combined = (subject + ' ' + body).toLowerCase();

    if (combined.includes('meeting') || combined.includes('toplantı'))
      return 'meeting';
    if (combined.includes('invoice') || combined.includes('fatura'))
      return 'billing';
    if (combined.includes('support') || combined.includes('destek'))
      return 'support';
    if (combined.includes('newsletter') || combined.includes('bülten'))
      return 'newsletter';
    if (combined.includes('notification') || combined.includes('bildirim'))
      return 'notification';

    return 'general';
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

  private isReplyEmail(subject: string): boolean {
    return /^(re:|fw:|fwd:)/i.test(subject.trim());
  }

  private detectAttachments(body: string): boolean {
    return /attach|ek|dosya|file/i.test(body);
  }
  private detectUrgency(subject: string, body: string): string {
    const combined = (subject + ' ' + body).toLowerCase();
    let urgencyScore = 0;

    // High urgency indicators
    if (/acil|urgent|asap|hemen|immediately/i.test(combined)) urgencyScore += 3;
    if (/önemli|important|critical|kritik/i.test(combined)) urgencyScore += 2;
    if (/bugün|today|yarın|tomorrow/i.test(combined)) urgencyScore += 1;
    if (/lütfen|please/i.test(combined)) urgencyScore += 1;

    // Reduce urgency for automated emails
    if (/newsletter|bülten|no-reply|noreply/i.test(combined)) urgencyScore -= 2;

    const finalScore = Math.max(0, Math.min(5, urgencyScore));
    
    if (finalScore >= 4) return 'critical';
    if (finalScore >= 2) return 'high';
    if (finalScore >= 1) return 'medium';
    return 'low';
  }

  private extractKeyInformation(body: string): any {
    return {
      dates: this.extractDates(body),
      emails: this.extractEmails(body),
      phones: this.extractPhones(body),
      urls: this.extractUrls(body),
      amounts: this.extractAmounts(body),
    };
  }
  private extractDates(text: string): string[] {
    const datePatterns = [
      /\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}/g, // DD/MM/YYYY
      /\d{4}[/\-.]\d{1,2}[/\-.]\d{1,2}/g, // YYYY/MM/DD
    ];

    const dates: string[] = [];
    datePatterns.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      dates.push(...matches);
    });

    return [...new Set(dates)];
  }

  private extractEmails(text: string): string[] {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return text.match(emailPattern) || [];
  }  private extractPhones(text: string): string[] {
    const phonePatterns = [
      /\+?[\d\s\-()]{10,}/g, // International format
      /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g, // US format
    ];

    const phones: string[] = [];
    phonePatterns.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      phones.push(
        ...matches.filter(
          (match: string) => match.replace(/\D/g, '').length >= 10,
        ),
      );
    });

    return [...new Set(phones)];
  }

  private extractUrls(text: string): string[] {
    const urlPattern = /https?:\/\/[^\s]+/g;
    return text.match(urlPattern) || [];
  }

  private extractAmounts(text: string): string[] {
    const amountPatterns = [
      /\$[\d,]+\.?\d*/g, // Dollar amounts
      /\d+[\s]?TL/g, // Turkish Lira
      /€[\d,]+\.?\d*/g, // Euro amounts
    ];

    const amounts: string[] = [];
    amountPatterns.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      amounts.push(...matches);
    });

    return [...new Set(amounts)];
  }
}
