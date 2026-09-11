import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity.js';
import { ExperimentService } from './services/experiment.service.js';
import { ExperimentsController } from './controllers/experiment.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment])],
  providers: [ExperimentService],
  controllers: [ExperimentsController],
})
export class ExperimentsModule {}