import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity.js';
import { ExperimentService } from './services/experiment.service.js';{ }

@Module({
  imports: [TypeOrmModule.forFeature([Experiment])],
  providers: [ExperimentService],
})
export class ExperimentsModule {}