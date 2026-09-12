import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity.js';
import { ExperimentService } from './services/experiment.service.js';
import { ExperimentsController } from './controllers/experiment.controller.js';
import { ExperimentLog } from './entities/experiment-log.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment, ExperimentLog])],
  providers: [ExperimentService],
  controllers: [ExperimentsController],
})
export class ExperimentsModule {}