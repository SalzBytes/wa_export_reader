import { parseWhatsAppZip } from '../services/waParser.js';
import { applyChatFilters } from '../services/chatFilterEngine.js';
import { PAGE_SIZE } from '../config/chatView.js';
import { getCachedChat, setCachedChat } from '../services/chatCache.js';
import crypto from 'crypto';

export async function openChat(req, res) {
  const { filter = 'all', page = 1 } = req.query;
  const pageNum = Number(page);

  // 🔑 buat key cache (berdasarkan file)
  const zipBuffer = req.file.buffer;
  const hash = crypto.createHash('md5').update(zipBuffer).digest('hex');

  let messages = getCachedChat(hash);

  if (!messages) {
    const parsed = await parseWhatsAppZip(zipBuffer);

    messages = parsed.map(m => ({
      ...m,
      effects: applyChatFilters(m)
    }));

    setCachedChat(hash, messages);
  }

  // 2️⃣ FILTER DATA (BUKAN UI)
  let filtered = messages;

  if (filter === 'matched') {
    filtered = messages.filter(m => m.effects.hasMatchedFilter);
  }

  // 4️⃣ PAGINATION (AMBIL DARI BAWAH)
  const total = filtered.length;
  const start = Math.max(total - pageNum * PAGE_SIZE, 0);
  const end = total - (pageNum - 1) * PAGE_SIZE;

  const pageMessages = filtered.slice(start, end);

  res.render('chat', {
    messages: pageMessages,
    page: pageNum,
    hasMore: start > 0,
    filter
  });
}
