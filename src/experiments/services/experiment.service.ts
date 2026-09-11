import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiment } from '../entities/experiment.entity.js';
import { CreateExperimentDto } from '../dto/create-experiment.dto.js';
import { UpdateExperimentDto } from '../dto/update-experiment.dto.js';

@Injectable()
export class ExperimentService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
  ) {}
  private readonly logger = new Logger(ExperimentService.name);

  async create(createExperimentDto: CreateExperimentDto): Promise<Experiment> {
    const experiment = this.experimentRepository.create(createExperimentDto);
  
    await this.experimentRepository.save(experiment);
    this.logger.log(`Experimento com ID ${experiment.id} foi criado.`);

    return experiment;    
  }

  findAll(): Promise<Experiment[]> {
    return this.experimentRepository.find();
  }

  async findOne(id: string): Promise<Experiment> {
    const experiment = await this.experimentRepository.findOne({ where: { id: id } });

    if (!experiment) {
      throw new NotFoundException(`Experimento com ID ${id} não encontrado.`);
    };

    return experiment;
  }

  async update(
    id: string,
    updateExperimentDto: UpdateExperimentDto
  ): Promise<Experiment> {
    const experiment = await this.experimentRepository.preload({
      id: id,
      ...updateExperimentDto,
    });

    if (!experiment) {
      throw new NotFoundException(`Experimento com ID ${id} não encontrado.`);
    };

    await this.experimentRepository.save(experiment);
    this.logger.log(`Experimento com ID ${experiment.id} foi modificado.`);

    return experiment;
  }

  async delete(id: string): Promise<void> {
    const experiment = await this.experimentRepository.findOne({ where: { id: id } });

    if (!experiment) {
      throw new NotFoundException(`Experimento com ID ${id} não encontrado.`);
    }

    await this.experimentRepository.remove(experiment);
    this.logger.log(`Experimento com ID ${experiment.id} foi deletado.`);

    return;
  }
}