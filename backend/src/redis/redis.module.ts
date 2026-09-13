import { Module } from "@nestjs/common";
import { RedisService } from "./services/redis.service.js";

@Module({
    imports: [],
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}