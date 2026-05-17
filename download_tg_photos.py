"""
Скачивает все фото из Telegram-канала @nordicair.

Перед запуском:
1. Зайди на https://my.telegram.org
2. Войди своим аккаунтом → "API development tools"
3. Создай приложение, получи api_id и api_hash
4. Вставь их ниже

Запуск:  python download_tg_photos.py
При первом запуске попросит номер телефона и код из Telegram.
"""

import asyncio
import os
from telethon import TelegramClient
from telethon.tl.types import InputMessagesFilterPhotos

# ===== ВСТАВЬ СВОИ ДАННЫЕ =====
API_ID   = 0           # число, например: 12345678
API_HASH = ''          # строка, например: 'abcdef1234567890abcdef1234567890'
CHANNEL  = 'nordicair' # username канала без @
# ==============================

SAVE_DIR = 'images/tg_all'

async def main():
    if not API_ID or not API_HASH:
        print("Сначала заполни API_ID и API_HASH — получи на https://my.telegram.org")
        return

    os.makedirs(SAVE_DIR, exist_ok=True)

    async with TelegramClient('tg_session', API_ID, API_HASH) as client:
        print(f"Подключились. Скачиваем фото из @{CHANNEL}...")
        count = 0
        async for msg in client.iter_messages(CHANNEL, filter=InputMessagesFilterPhotos):
            filename = os.path.join(SAVE_DIR, f'photo_{msg.id}.jpg')
            if os.path.exists(filename):
                continue  # уже скачано, пропускаем
            try:
                await client.download_media(msg, filename)
                count += 1
                if count % 50 == 0:
                    print(f'  Скачано: {count} фото...')
            except Exception as e:
                print(f'  Ошибка {msg.id}: {e}')

        print(f'\nГотово! Всего скачано: {count} фото')
        print(f'Папка: {os.path.abspath(SAVE_DIR)}')

asyncio.run(main())
