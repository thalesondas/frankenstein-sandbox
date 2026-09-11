import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiment } from '../entities/experiment.entity.js';
import { CreateExperimentDto } from '../dto/create-experiment.dto.js';

@Injectable()
export class ExperimentService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
  ) {}

  create(createExperimentDto: CreateExperimentDto): Promise<Experiment> {
    const experiment = this.experimentRepository.create(createExperimentDto);
  
    return this.experimentRepository.save(experiment);
  }

  findAll(): Promise<Experiment[]> {
    return this.experimentRepository.find();
  }

  async findOne(id: string): Promise<Experiment | null> {
    const experiment = await this.experimentRepository.findOne({ where: { id: id } });

    return experiment;
  }
}