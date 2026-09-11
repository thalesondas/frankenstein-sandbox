import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Experiment } from "./experiment.entity.js";
import { v7 as uuidv7 } from "uuid";

@Entity('experiments_log')
export class ExperimentLog {
    @PrimaryColumn({ type: 'uuid' })
    id: string = uuidv7();

    @ManyToOne(() => Experiment)
    @JoinColumn({ name: 'experiment_id' })
    experiment: Experiment;

    @Column()
    message: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
    })
    createdAt: Date;
}