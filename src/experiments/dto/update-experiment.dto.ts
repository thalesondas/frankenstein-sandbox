import { PartialType } from '@nestjs/mapped-types';
import { CreateExperimentDto } from './create-experiment.dto.js';

export class UpdateExperimentDto extends PartialType(CreateExperimentDto) {}