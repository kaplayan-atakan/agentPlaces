import { Injectable, Logger } from '@nestjs/common';

interface ResponseGenerationParams {
  thread: any;
  analysis: any;
  context?: string;
  tone?: string;
  language?: string;
}

@Injectable()
export class ResponseGeneratorService {
  private readonly logger = new Logger(ResponseGeneratorService.name);

  async generateResponse(params: ResponseGenerationParams): Promise<{
    subject: string;
    body: string;
    tone: string;
    confidence: number;
    suggestions: string[];
  }> {
    try {
      this.logger.log('Generating response for thread');

      const { thread, analysis, context, tone = 'professional', language = 'en' } = params;

      const subject = this.generateSubject(thread, analysis);
      const body = this.generateBody(thread, analysis, context, tone, language);
      const suggestions = this.generateSuggestions(thread, analysis);

      const response = {
        subject,
        body,
        tone,
        confidence: this.calculateConfidence(thread, analysis),
        suggestions,
      };

      this.logger.log('Response generated successfully');
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Response generation error: ${errorMessage}`);
      throw new Error(`Response generation failed: ${errorMessage}`);
    }
  }

  private generateSubject(thread: any, analysis: any): string {
    const originalSubject = thread?.subject || 'No Subject';
    
    // If it's already a reply, keep the Re: prefix
    if (originalSubject.toLowerCase().startsWith('re:')) {
      return originalSubject;
    }
    
    return `Re: ${originalSubject}`;
  }

  private generateBody(
    thread: any,
    analysis: any,
    context?: string,
    tone = 'professional',
    language = 'en',
  ): string {
    const templates = this.getTemplates(language);
    const lastMessage = this.getLastMessage(thread);
    
    let greeting = templates.greetings[tone] || templates.greetings.professional;
    let closing = templates.closings[tone] || templates.closings.professional;
    
    // Customize greeting based on sender
    if (lastMessage?.from) {
      const senderName = this.extractSenderName(lastMessage.from);
      greeting = greeting.replace('{name}', senderName);
    } else {
      greeting = greeting.replace('{name}', '');
    }

    // Generate main content based on analysis
    let mainContent = this.generateMainContent(analysis, context, language);

    // Add urgency indicator if needed
    if (analysis?.urgency?.level === 'critical' || analysis?.urgency?.level === 'high') {
      const urgencyNote = language === 'tr' 
        ? 'Bu konuya öncelik vererek hızlıca yanıt veriyorum.'
        : 'I am prioritizing this matter and responding promptly.';
      mainContent = urgencyNote + '\n\n' + mainContent;
    }

    return `${greeting}\n\n${mainContent}\n\n${closing}`;
  }

  private generateMainContent(analysis: any, context?: string, language = 'en'): string {
    const templates = this.getContentTemplates(language);
    
    if (context) {
      return context;
    }

    // Generate content based on classification
    const category = analysis?.classification?.category || 'general';
    const sentiment = analysis?.sentiment?.label || 'neutral';
    const urgency = analysis?.urgency?.level || 'low';

    let content = templates[category] || templates.general;

    // Adjust content based on sentiment
    if (sentiment === 'negative') {
      const apology = language === 'tr' 
        ? 'Yaşadığınız sorunu anlıyorum ve size yardımcı olmak istiyorum.'
        : 'I understand your concern and would like to help resolve this matter.';
      content = apology + '\n\n' + content;
    } else if (sentiment === 'positive') {
      const appreciation = language === 'tr'
        ? 'Olumlu geri bildiriminiz için teşekkür ederim.'
        : 'Thank you for your positive feedback.';
      content = appreciation + '\n\n' + content;
    }

    return content;
  }

  private generateSuggestions(thread: any, analysis: any): string[] {
    const suggestions: string[] = [];
    
    const category = analysis?.classification?.category;
    const urgency = analysis?.urgency?.level;
    const sentiment = analysis?.sentiment?.label;

    // Category-based suggestions
    if (category === 'support') {
      suggestions.push('Consider providing a ticket number for tracking');
      suggestions.push('Offer to schedule a call if the issue is complex');
    } else if (category === 'billing') {
      suggestions.push('Include invoice or reference numbers');
      suggestions.push('Suggest contacting finance team if needed');
    } else if (category === 'meeting') {
      suggestions.push('Propose specific time slots');
      suggestions.push('Include calendar invitation');
    }

    // Urgency-based suggestions
    if (urgency === 'critical' || urgency === 'high') {
      suggestions.push('Mark as high priority');
      suggestions.push('Set up auto-follow-up');
    }

    // Sentiment-based suggestions
    if (sentiment === 'negative') {
      suggestions.push('Use empathetic language');
      suggestions.push('Consider escalating to supervisor');
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  private calculateConfidence(thread: any, analysis: any): number {
    let confidence = 0.7; // Base confidence

    // Increase confidence based on available data
    if (analysis?.classification?.confidence) {
      confidence += analysis.classification.confidence * 0.2;
    }

    if (analysis?.sentiment?.confidence) {
      confidence += analysis.sentiment.confidence * 0.1;
    }

    if (thread?.messages?.length > 1) {
      confidence += 0.1; // Higher confidence with more context
    }

    return Math.min(0.95, Math.max(0.3, confidence));
  }

  private getLastMessage(thread: any): any {
    const messages = thread?.messages || [];
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }

  private extractSenderName(email: string): string {
    // Extract name from email or use email as fallback
    const atIndex = email.indexOf('@');
    if (atIndex > 0) {
      const localPart = email.substring(0, atIndex);
      return localPart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return email;
  }

  private getTemplates(language: string): any {
    if (language === 'tr') {
      return {
        greetings: {
          professional: 'Sayın {name},',
          friendly: 'Merhaba {name},',
          formal: 'Sayın {name},',
        },
        closings: {
          professional: 'Saygılarımla,',
          friendly: 'İyi günler,',
          formal: 'Saygılarımla,',
        },
      };
    }

    return {
      greetings: {
        professional: 'Dear {name},',
        friendly: 'Hi {name},',
        formal: 'Dear {name},',
      },
      closings: {
        professional: 'Best regards,',
        friendly: 'Best,',
        formal: 'Sincerely,',
      },
    };
  }

  private getContentTemplates(language: string): any {
    if (language === 'tr') {
      return {
        support: 'Sorununuzu aldık ve en kısa sürede size dönüş yapacağız. Yardımcı olmaktan memnuniyet duyarız.',
        billing: 'Faturalandırma konusundaki talebinizi ilgili departmana ilettik. Size kısa sürede geri dönüş yapılacaktır.',
        meeting: 'Toplantı talebinizi aldık. Müsait olduğunuz zamanları belirtirseniz, size uygun bir randevu ayarlayabiliriz.',
        general: 'Mesajınız için teşekkür ederiz. Size yardımcı olmak için elimizden geleni yapacağız.',
      };
    }

    return {
      support: 'Thank you for contacting our support team. We have received your request and will get back to you shortly.',
      billing: 'We have received your billing inquiry and have forwarded it to our finance team. You will receive a response soon.',
      meeting: 'Thank you for your meeting request. Please let us know your availability so we can schedule a convenient time.',
      general: 'Thank you for your message. We appreciate your communication and will respond as soon as possible.',
    };
  }
}
