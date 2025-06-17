import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MailThreadDocument = MailThread & Document;

@Schema({ timestamps: true })
export class MailThread {
  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  participants: string[];

  @Prop({ required: true })
  messages: {
    messageId: string;
    from: string;
    to: string;
    date: Date;
    subject: string;
    body: string;
    headers: Record<string, any>;
    isReply: boolean;
  }[];

  @Prop()
  threadId: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  lastMessageDate: Date;

  @Prop({ default: 0 })
  messageCount: number;

  @Prop()
  labels: string[];

  @Prop()
  priority: string;

  @Prop()
  agentId: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const MailThreadSchema = SchemaFactory.createForClass(MailThread);
