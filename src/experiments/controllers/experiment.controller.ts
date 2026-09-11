import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateExperimentDto } from "../dto/create-experiment.dto.js";
import { Experiment } from "../entities/experiment.entity.js";
import { ExperimentService } from "../services/experiment.service.js";

@Controller('experiments')
export class ExperimentsController {
    constructor(private readonly experimentService: ExperimentService) {}

    @Post()
    async create(@Body() createExperimentDto: CreateExperimentDto): Promise<Experiment> {
        return this.experimentService.create(createExperimentDto);
    }

    @Get()
    async findAll(): Promise<Experiment[]> {
        return this.experimentService.findAll();
    }
}