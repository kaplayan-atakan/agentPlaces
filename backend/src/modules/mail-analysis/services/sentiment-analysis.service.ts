import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SentimentAnalysisService {
  private readonly logger = new Logger(SentimentAnalysisService.name);

  async analyzeSentiment(text: string): Promise<{
    score: number;
    label: string;
    confidence: number;
  }> {
    try {
      // Simple sentiment analysis implementation
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
        'wonderful',
        'happy',
        'pleased',
        'satisfied',
        'good',
        'fantastic',
      ];

      const negativeWords = [
        'sorun',
        'problem',
        'hata',
        'şikayet',
        'kızgın',
        'üzgün',
        'problem',
        'issue',
        'error',
        'complaint',
        'angry',
        'sad',
        'disappointed',
        'frustrated',
        'bad',
        'terrible',
        'awful',
      ];

      const neutralWords = [
        'bilgi',
        'soru',
        'information',
        'question',
        'request',
        'update',
        'meeting',
        'schedule',
      ];

      const lowerText = text.toLowerCase();
      let positiveCount = 0;
      let negativeCount = 0;
      let neutralCount = 0;

      positiveWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        positiveCount += matches ? matches.length : 0;
      });

      negativeWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        negativeCount += matches ? matches.length : 0;
      });

      neutralWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        neutralCount += matches ? matches.length : 0;
      });

      const totalWords = text.split(/\s+/).length;
      const totalSentimentWords = positiveCount + negativeCount + neutralCount;

      let score = 0;
      let label = 'neutral';
      let confidence = 0.5;

      if (totalSentimentWords > 0) {
        score = (positiveCount - negativeCount) / totalSentimentWords;
        confidence = Math.min(0.9, totalSentimentWords / totalWords + 0.3);

        if (score > 0.1) {
          label = 'positive';
        } else if (score < -0.1) {
          label = 'negative';
        } else {
          label = 'neutral';
        }
      }

      this.logger.log(`Sentiment analyzed: ${label} (score: ${score.toFixed(2)})`);

      return {
        score: Math.round(score * 100) / 100,
        label,
        confidence: Math.round(confidence * 100) / 100,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Sentiment analysis error: ${errorMessage}`);
      
      // Return neutral sentiment on error
      return {
        score: 0,
        label: 'neutral',
        confidence: 0.5,
      };
    }
  }

  async batchAnalyzeSentiment(texts: string[]): Promise<Array<{
    score: number;
    label: string;
    confidence: number;
  }>> {
    try {
      const results = await Promise.all(
        texts.map((text) => this.analyzeSentiment(text)),
      );
      
      this.logger.log(`Batch sentiment analysis completed for ${texts.length} texts`);
      return results;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Batch sentiment analysis error: ${errorMessage}`);
      throw new Error(`Batch sentiment analysis failed: ${errorMessage}`);
    }
  }

  getSentimentStatistics(sentiments: Array<{ score: number; label: string }>): {
    positive: number;
    negative: number;
    neutral: number;
    averageScore: number;
  } {
    const positive = sentiments.filter((s) => s.label === 'positive').length;
    const negative = sentiments.filter((s) => s.label === 'negative').length;
    const neutral = sentiments.filter((s) => s.label === 'neutral').length;
    
    const averageScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;

    return {
      positive,
      negative,
      neutral,
      averageScore: Math.round(averageScore * 100) / 100,
    };
  }
}
