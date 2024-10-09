import { Injectable, Inject } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as cron from 'node-cron';
import * as cronParser from 'cron-parser';

@Injectable()
export class BotService {
  private cronJobs = new Map<string, any>();

  constructor(@Inject('TELEGRAM_BOT') private bot: TelegramBot) {
    console.log('Init bot service')

    this.bot.sendPoll(-1002255381974, '1', ['2', '3'], {
      is_anonymous: false,  // Указываем, что опрос неанонимный
    });
/*
    // Обрабатываем команду /create_poll
    this.bot.onText(/\/create_poll (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const commandArgs = match[1].split(';');

      if (commandArgs.length < 3) {
        this.bot.sendMessage(chatId, 'Формат команды неверен. Используйте: /create_poll Заголовок;Вариант1,Вариант2,Вариант3;Расписание');
        return;
      }

      const title = commandArgs[0].trim();
      const options = commandArgs[1].split(',').map(option => option.trim());
      const schedule = commandArgs[2].trim();

      try {
        // Парсим расписание и устанавливаем cron-задачу
        this.schedulePoll(String(chatId), title, options, schedule);
        this.bot.sendMessage(chatId, `Опрос "${title}" будет публиковаться по расписанию: ${schedule}`);
        console.log('Создан опрос для chat id:' + chatId)
      } catch (error) {
        this.bot.sendMessage(chatId, 'Ошибка в расписании. Пожалуйста, используйте корректное cron-расписание.');
      }
    });
 */
  }

  // Метод для планирования опроса по расписанию
  schedulePoll(chatId: string, question: string, options: string[], cronTime: string) {
    if (this.cronJobs.has(chatId)) {
      const existingJob = this.cronJobs.get(chatId);
      existingJob.stop(); // Останавливаем старую задачу, если есть
    }

    // Устанавливаем новую cron-задачу
    const job = cron.schedule(cronTime, () => {
      try {
        console.log('Отправлен опрос для chat id:' + chatId)
        this.bot.sendPoll(-1002255381974, '1', ['2', '3'], {
          is_anonymous: false,  // Указываем, что опрос неанонимный
        });
      } catch (e) {
        console.log('Ошибка отправки опроса для chat id:' + chatId + '. Ошибка: ' + e)
      }

    });

    this.cronJobs.set(chatId, job); // Сохраняем задачу для чата
  }
}
