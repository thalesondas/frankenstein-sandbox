import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity.js';
import { ExperimentService } from './services/experiment.service.js';
import { ExperimentsController } from './controllers/experiment.controller.js';
import { ExperimentLog } from './entities/experiment-log.entity.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Experiment,
      ExperimentLog
    ]),
    RedisModule
  ],
  providers: [ExperimentService],
  controllers: [ExperimentsController],
})
export class ExperimentsModule {}