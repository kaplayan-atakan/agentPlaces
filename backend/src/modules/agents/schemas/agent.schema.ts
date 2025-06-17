import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgentDocument = Agent & Document;

@Schema({ timestamps: true })
export class Agent {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({
    required: true,
    enum: ['mail-analyst', 'file-processor', 'general-assistant', 'custom'],
    default: 'general-assistant',
  })
  type: string;

  @Prop({ required: true })
  promptTemplate: string;

  @Prop({
    required: true,
    enum: ['openai', 'local', 'groq'],
    default: 'openai',
  })
  llmProvider: string;

  @Prop({
    type: Object,
    default: {
      maxTokens: 2000,
      temperature: 0.7,
      topP: 1,
    },
  })
  llmConfig: {
    maxTokens: number;
    temperature: number;
    topP: number;
    [key: string]: any;
  };

  @Prop([String])
  capabilities: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop()
  userId: string; // Kullanıcı ID'si (auth eklendiğinde kullanılacak)
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
