import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { ExperimentStatus } from '../enums/experiment-status.enum.js';

@Entity('experiments')
export class Experiment {
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ExperimentStatus,
  })
  status: ExperimentStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @VersionColumn()
  version: number;
}