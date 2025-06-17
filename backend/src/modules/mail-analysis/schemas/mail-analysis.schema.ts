import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MailAnalysisDocument = MailAnalysis & Document;

@Schema({ timestamps: true })
export class MailAnalysis {
  @Prop({ required: true })
  threadId: string;

  @Prop({ required: true })
  messageId: string;
  @Prop({
    required: true,
    type: {
      score: { type: Number, required: true },
      label: { type: String, required: true },
      confidence: { type: Number, required: true },
    },
  })
  sentiment: {
    score: number;
    label: string;
    confidence: number;
  };

  @Prop({
    required: true,
    type: {
      category: { type: String, required: true },
      subcategory: { type: String, required: true },
      confidence: { type: Number, required: true },
    },
  })
  classification: {
    category: string;
    subcategory: string;
    confidence: number;
  };

  @Prop({
    required: true,
    type: {
      level: { type: String, required: true },
      score: { type: Number, required: true },
      indicators: [{ type: String }],
    },
  })
  urgency: {
    level: string;
    score: number;
    indicators: string[];
  };
  @Prop([String])
  keyTopics: string[];

  @Prop({
    type: {
      people: [{ type: String }],
      organizations: [{ type: String }],
      dates: [{ type: String }],
      locations: [{ type: String }],
      amounts: [{ type: String }],
    },
  })
  entities: {
    people: string[];
    organizations: string[];
    dates: string[];
    locations: string[];
    amounts: string[];
  };

  @Prop({
    type: {
      primary: { type: String, required: true },
      secondary: [{ type: String }],
      confidence: { type: Number, required: true },
    },
  })
  intent: {
    primary: string;
    secondary: string[];
    confidence: number;
  };

  @Prop()
  language: string;
  @Prop([String])
  suggestedActions: string[];

  @Prop()
  responseRequired: boolean;

  @Prop()
  responseTemplate: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  agentId: string;

  @Prop()
  processedAt: Date;
}

export const MailAnalysisSchema = SchemaFactory.createForClass(MailAnalysis);
