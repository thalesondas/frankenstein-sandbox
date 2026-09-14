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

    async set(
        key: string,
        value: any,
        ttlInSeconds?: number,
    ): Promise<void> {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

        if (ttlInSeconds !== undefined) {
            await this.client.set(key, stringValue, { EX: ttlInSeconds });
        } else {
            await this.client.set(key, stringValue);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }
}