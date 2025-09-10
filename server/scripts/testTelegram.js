// Utility to debug Telegram configuration.
// Usage:
//   node scripts/testTelegram.js            -> prints bot info + recent chat IDs
//   node scripts/testTelegram.js "Test msg" -> sends test msg to all admin chat IDs

import 'dotenv/config';
import fetch from 'node-fetch';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_IDS = (process.env.TELEGRAM_ADMIN_CHAT_IDS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN missing in .env');
  process.exit(1);
}

async function call(method, body) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
  const opts = body ? {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  } : undefined;
  const res = await fetch(url, opts);
  const json = await res.json();
  if (!json.ok) {
    console.error(`Method ${method} failed:`, json);
  }
  return json;
}

async function main() {
  console.log('🔍 Checking bot identity...');
  await call('getMe');

  console.log('\n📥 Fetching updates (chat history)...');
  const updates = await call('getUpdates');
  if (updates.ok) {
    const chats = new Map();
    for (const u of updates.result) {
      const chat = u.message?.chat || u.channel_post?.chat;
      if (chat) chats.set(chat.id, chat);
    }
    if (chats.size === 0) {
      console.log('⚠️ No chats found. Open Telegram, search your bot, press Start, send a message, then rerun.');
    } else {
      console.log('✅ Discovered chat IDs:');
      for (const [id, chat] of chats) {
        console.log(` - ${id} (${chat.type}${chat.title ? ': ' + chat.title : ''}${chat.username ? ' @' + chat.username : ''})`);
      }
    }
  }

  const testMsg = process.argv.slice(2).join(' ');
  if (testMsg) {
    if (ADMIN_CHAT_IDS.length === 0) {
      console.log('⚠️ TELEGRAM_ADMIN_CHAT_IDS empty; set it to comma separated chat IDs.');
    }
    for (const id of ADMIN_CHAT_IDS) {
      console.log(`✉️ Sending test message to ${id}...`);
      await call('sendMessage', { chat_id: id, text: testMsg });
    }
  } else {
    console.log('\n(Provide a message argument to send a test, e.g. node scripts/testTelegram.js "Hello")');
  }
}

main().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
