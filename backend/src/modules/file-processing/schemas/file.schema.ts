import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  path: string;

  @Prop()
  uploadedBy: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @Prop()
  processedAt: Date;

  @Prop()
  extractedText: string;
  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ type: Object })
  analysisResult: Record<string, any>;

  @Prop()
  errorMessage: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const FileSchema = SchemaFactory.createForClass(File);
