import { createClient } from "redis";
import { OnModuleInit, OnModuleDestroy, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);

    private client = createClient({
        url: 'redis://redis:6379',
    });

    async onModuleInit() {
        await this.client.connect();
        this.logger.log('Redis conectado!');
    }

    async onModuleDestroy() {
        await this.client.quit();
        this.logger.log('Redis desconectado!');
    }
}