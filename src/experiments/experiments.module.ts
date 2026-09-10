import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment])],
})
export class ExperimentsModule {}