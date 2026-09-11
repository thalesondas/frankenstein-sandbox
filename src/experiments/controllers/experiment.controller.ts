import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CreateExperimentDto } from "../dto/create-experiment.dto.js";
import { Experiment } from "../entities/experiment.entity.js";
import { ExperimentService } from "../services/experiment.service.js";
import { UpdateExperimentDto } from "../dto/update-experiment.dto.js";

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

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Experiment> {
        return this.experimentService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateExperimentDto: UpdateExperimentDto,
    ): Promise<Experiment> {
        return this.experimentService.update(id, updateExperimentDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void> {
        return this.experimentService.delete(id);
    }
}