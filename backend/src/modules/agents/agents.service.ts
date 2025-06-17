import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent, AgentDocument } from './schemas/agent.schema';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
  ) {}

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    const agent = new this.agentModel(createAgentDto);
    return agent.save();
  }

  async findAll(userId?: string): Promise<Agent[]> {
    const filter = userId ? { userId } : {};
    return this.agentModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentModel.findById(id).exec();
    if (!agent) {
      throw new NotFoundException(`Agent with ID "${id}" not found`);
    }
    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.agentModel
      .findByIdAndUpdate(id, updateAgentDto, { new: true })
      .exec();
    
    if (!agent) {
      throw new NotFoundException(`Agent with ID "${id}" not found`);
    }
    return agent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.agentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Agent with ID "${id}" not found`);
    }
  }

  async findByType(type: string): Promise<Agent[]> {
    return this.agentModel.find({ type, isActive: true }).exec();
  }
  async incrementUsage(id: string): Promise<Agent | null> {
    return this.agentModel
      .findByIdAndUpdate(id, { $inc: { usageCount: 1 } }, { new: true })
      .exec();
  }
}
