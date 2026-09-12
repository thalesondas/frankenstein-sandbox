import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Experiment } from '../entities/experiment.entity.js';
import { CreateExperimentDto } from '../dto/create-experiment.dto.js';
import { UpdateExperimentDto } from '../dto/update-experiment.dto.js';
import { ExperimentLog } from '../entities/experiment-log.entity.js';
import { ExperimentStatus } from '../enums/experiment-status.enum.js';

@Injectable()
export class ExperimentService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,

    @InjectRepository(ExperimentLog)
    private readonly experimentLogRepository: Repository<ExperimentLog>,

    private readonly dataSource: DataSource,
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

  async createWithLog(): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const experiment = manager.create(Experiment, {
        name: 'Experimento de transação',
        status: ExperimentStatus.PENDING,
      });

      await manager.save(experiment);

      this.logger.log(`Experiment teste criado: ${experiment.id}`);

      const log = manager.create(ExperimentLog, {
        experiment,
        message: 'Log do experimento',
      });

      // Proposital: simula uma falha para demonstrar o rollback.
      throw new Error('Erro proposital para testar transação');

      await manager.save(log);
    });
  }

  async simulateOptimisticLock(
    id: string,
    status: ExperimentStatus,
    delay: number,
  ): Promise<Experiment> {
    const experiment = await this.experimentRepository.findOne({
      where: { id },
    });

    if (!experiment) {
      throw new NotFoundException(
        `Experimento com ID ${id} não encontrado.`,
      );
    }

    this.logger.log(
      `Experiment ${id}: li status ${experiment.status}. Aguardando ${delay}ms...`,
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    const updateResult = await this.experimentRepository
      .createQueryBuilder()
      .update(Experiment)
      .set({
        status,
        version: () => 'version + 1',
      })
      .where('id = :id AND version = :version', {
        id: experiment.id,
        version: experiment.version,
      })
      .execute();

    if (updateResult.affected === 0) {
      throw new ConflictException(
        `Falha de concorrência: o experimento ${id} foi alterado por outra requisição.`,
      );
    }

    this.logger.log(
      `Experiment ${id}: salvei status ${status}.`,
    );

    return this.findOne(id);
  }

  async simulatePessimisticLock(
    id: string,
    status: ExperimentStatus,
    delay: number,
  ): Promise<Experiment> {
    return this.dataSource.transaction(async (manager) => {
      const experiment = await manager
        .createQueryBuilder(Experiment, 'experiment')
        .setLock('pessimistic_write')
        .where('experiment.id = :id', { id })
        .getOne();

      if (!experiment) {
        throw new NotFoundException(
          `Experimento com ID ${id} não encontrado.`,
        );
      }

      this.logger.log(
        `Experiment ${id}: adquiri o lock. Status atual: ${experiment.status}. Aguardando ${delay}ms...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));

      experiment.status = status;

      await manager.save(experiment);

      this.logger.log(
        `Experiment ${id}: salvei status ${experiment.status}. Liberando lock.`,
      );

      return experiment;
    });
  }
}