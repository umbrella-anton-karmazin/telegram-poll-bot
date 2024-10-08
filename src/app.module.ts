import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { BotService } from './bot.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Этот модуль загружает переменные окружения из .env
  ],
  providers: [
    BotService,
    {
      provide: 'TELEGRAM_BOT',
      useFactory: () => {
        console.log('Init tg bot with token: ' + process.env.TELEGRAM_BOT_TOKEN)
        const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
        return bot;
      },
    },
  ],
})
export class AppModule {}
