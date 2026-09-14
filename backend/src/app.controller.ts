import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { RedisService } from './redis/services/redis.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly redisService: RedisService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('redis-teste')
  async redisTest(): Promise<{
    beforeDelete: string | null;
    afterDelete: string | null;
  }> {
    await this.redisService.set('teste', 'banana');

    const beforeDelete = await this.redisService.get('teste');

    await this.redisService.del('teste');

    const afterDelete = await this.redisService.get('teste');

    return {
      beforeDelete,
      afterDelete,
    };
  }
}
