import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator"
import { ExperimentStatus } from "../enums/experiment-status.enum.js";

export class CreateExperimentDto {
    @IsNotEmpty({ message: 'O nome não deve estar vazio.' })
    @IsString({ message: 'O nome deve ser um texto.' })
    @MaxLength(32, { message: 'O nome deve ter no máximo 32 caracteres.' })
    name: string;
    
    @IsNotEmpty({ message: 'O status não deve estar vazio.' })
    @IsEnum(
        ExperimentStatus,
        { message: `O status deve ser pending, running, completed ou failed.` }
    )
    status: ExperimentStatus;
}