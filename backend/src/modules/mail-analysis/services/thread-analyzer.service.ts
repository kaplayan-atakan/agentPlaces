import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ThreadAnalyzerService {
  private readonly logger = new Logger(ThreadAnalyzerService.name);

  async analyzeThread(thread: any): Promise<{
    threadSummary: string;
    keyTopics: string[];
    participantAnalysis: any;
    timelineAnalysis: any;
    actionItems: string[];
  }> {
    try {
      this.logger.log(`Analyzing thread: ${thread.threadId}`);

      const threadSummary = this.generateThreadSummary(thread);
      const keyTopics = this.extractKeyTopics(thread);
      const participantAnalysis = this.analyzeParticipants(thread);
      const timelineAnalysis = this.analyzeTimeline(thread);
      const actionItems = this.extractActionItems(thread);

      return {
        threadSummary,
        keyTopics,
        participantAnalysis,
        timelineAnalysis,
        actionItems,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Thread analysis error: ${errorMessage}`);
      throw new Error(`Thread analysis failed: ${errorMessage}`);
    }
  }

  private generateThreadSummary(thread: any): string {
    const messages = thread.messages || [];
    const messageCount = messages.length;
    const participantCount = thread.participants?.length || 0;
    
    if (messageCount === 0) {
      return 'Empty thread with no messages';
    }

    const firstMessage = messages[0];
    const lastMessage = messages[messageCount - 1];
    
    const duration = this.calculateDuration(
      new Date(firstMessage.date),
      new Date(lastMessage.date),
    );

    return `Thread with ${messageCount} messages from ${participantCount} participants. ` +
           `Started: ${firstMessage.date}. Duration: ${duration}. ` +
           `Subject: ${thread.subject}`;
  }

  private extractKeyTopics(thread: any): string[] {
    const messages = thread.messages || [];
    const allText = messages
      .map((msg: any) => msg.body + ' ' + msg.subject)
      .join(' ')
      .toLowerCase();

    // Simple keyword extraction
    const keywords = [
      'meeting', 'toplantı', 'project', 'proje', 'deadline', 'termin',
      'budget', 'bütçe', 'client', 'müşteri', 'team', 'takım',
      'delivery', 'teslimat', 'requirement', 'gereksinim',
      'issue', 'sorun', 'solution', 'çözüm', 'proposal', 'teklif',
    ];

    const foundTopics = keywords.filter((keyword) =>
      allText.includes(keyword),
    );

    return foundTopics.slice(0, 10); // Limit to top 10 topics
  }

  private analyzeParticipants(thread: any): any {
    const messages = thread.messages || [];
    const participants = thread.participants || [];

    const participantStats = participants.map((participant: string) => {
      const participantMessages = messages.filter(
        (msg: any) => msg.from === participant,
      );
      
      return {
        email: participant,
        messageCount: participantMessages.length,
        wordCount: participantMessages.reduce(
          (total: number, msg: any) => total + (msg.body?.split(' ').length || 0),
          0,
        ),
        firstMessage: participantMessages[0]?.date,
        lastMessage: participantMessages[participantMessages.length - 1]?.date,
        averageResponseTime: this.calculateAverageResponseTime(
          participantMessages,
        ),
      };
    });

    return {
      totalParticipants: participants.length,
      activeParticipants: participantStats.filter(
        (p: any) => p.messageCount > 0,
      ).length,
      stats: participantStats,
    };
  }

  private analyzeTimeline(thread: any): any {
    const messages = thread.messages || [];
    
    if (messages.length === 0) {
      return { pattern: 'no_messages', peaks: [], quietPeriods: [] };
    }

    const sortedMessages = messages.sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const timeDistribution = this.analyzeTimeDistribution(sortedMessages);
    const responseTimes = this.calculateResponseTimes(sortedMessages);
    
    return {
      pattern: this.identifyPattern(timeDistribution),
      timeDistribution,
      averageResponseTime: responseTimes.average,
      fastestResponse: responseTimes.fastest,
      slowestResponse: responseTimes.slowest,
      messageFrequency: this.calculateMessageFrequency(sortedMessages),
    };
  }

  private extractActionItems(thread: any): string[] {
    const messages = thread.messages || [];
    const actionKeywords = [
      'todo', 'action', 'task', 'deadline', 'deliver', 'complete',
      'follow up', 'schedule', 'meet', 'call', 'send', 'review',
      'yapılacak', 'görev', 'tamamla', 'gönder', 'ara', 'toplantı',
    ];

    const actionItems: string[] = [];

    messages.forEach((message: any) => {
      const body = message.body?.toLowerCase() || '';
      actionKeywords.forEach((keyword) => {
        if (body.includes(keyword)) {
          // Extract sentence containing the action keyword
          const sentences = body.split(/[.!?]+/);
          const actionSentence = sentences.find((sentence) =>
            sentence.includes(keyword),
          );
          if (actionSentence && actionSentence.trim().length > 10) {
            actionItems.push(actionSentence.trim());
          }
        }
      });
    });

    return [...new Set(actionItems)].slice(0, 20); // Remove duplicates, limit to 20
  }

  private calculateDuration(startDate: Date, endDate: Date): string {
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} days, ${diffHours} hours`;
    } else if (diffHours > 0) {
      return `${diffHours} hours`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffMinutes} minutes`;
    }
  }

  private calculateAverageResponseTime(messages: any[]): number {
    if (messages.length < 2) return 0;

    const sortedMessages = messages.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let totalResponseTime = 0;
    let responseCount = 0;

    for (let i = 1; i < sortedMessages.length; i++) {
      const currentTime = new Date(sortedMessages[i].date).getTime();
      const previousTime = new Date(sortedMessages[i - 1].date).getTime();
      const responseTime = currentTime - previousTime;

      // Only count reasonable response times (less than 1 week)
      if (responseTime < 7 * 24 * 60 * 60 * 1000) {
        totalResponseTime += responseTime;
        responseCount++;
      }
    }

    return responseCount > 0 ? totalResponseTime / responseCount : 0;
  }

  private analyzeTimeDistribution(messages: any[]): any {
    const hourCounts = new Array(24).fill(0);
    const dayCounts = new Array(7).fill(0);

    messages.forEach((message) => {
      const date = new Date(message.date);
      const hour = date.getHours();
      const day = date.getDay();
      
      hourCounts[hour]++;
      dayCounts[day]++;
    });

    return {
      hourlyDistribution: hourCounts,
      dailyDistribution: dayCounts,
      peakHour: hourCounts.indexOf(Math.max(...hourCounts)),
      peakDay: dayCounts.indexOf(Math.max(...dayCounts)),
    };
  }

  private identifyPattern(timeDistribution: any): string {
    const hourlyDist = timeDistribution.hourlyDistribution;
    const peakHour = timeDistribution.peakHour;

    if (peakHour >= 9 && peakHour <= 17) {
      return 'business_hours';
    } else if (peakHour >= 18 && peakHour <= 22) {
      return 'evening';
    } else if (peakHour >= 22 || peakHour <= 6) {
      return 'late_night';
    } else {
      return 'morning';
    }
  }

  private calculateResponseTimes(messages: any[]): any {
    const responseTimes: number[] = [];

    for (let i = 1; i < messages.length; i++) {
      const currentTime = new Date(messages[i].date).getTime();
      const previousTime = new Date(messages[i - 1].date).getTime();
      const responseTime = currentTime - previousTime;
      
      if (responseTime > 0 && responseTime < 7 * 24 * 60 * 60 * 1000) {
        responseTimes.push(responseTime);
      }
    }

    if (responseTimes.length === 0) {
      return { average: 0, fastest: 0, slowest: 0 };
    }

    return {
      average: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
      fastest: Math.min(...responseTimes),
      slowest: Math.max(...responseTimes),
    };
  }

  private calculateMessageFrequency(messages: any[]): any {
    if (messages.length < 2) {
      return { messagesPerDay: 0, messagesPerHour: 0 };
    }

    const firstMessage = new Date(messages[0].date);
    const lastMessage = new Date(messages[messages.length - 1].date);
    const durationMs = lastMessage.getTime() - firstMessage.getTime();
    const durationDays = durationMs / (1000 * 60 * 60 * 24);
    const durationHours = durationMs / (1000 * 60 * 60);

    return {
      messagesPerDay: durationDays > 0 ? messages.length / durationDays : 0,
      messagesPerHour: durationHours > 0 ? messages.length / durationHours : 0,
    };
  }
}
