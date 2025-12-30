import { parseChat } from '../services/waParser.js';
import { applyChatFilters } from '../services/chatFilterEngine.js';
import { PAGE_SIZE } from '../config/chatView.js';
import { getChatCache, setChatCache } from '../services/chatCache.js';

export async function openChat(req, res) {
    const { filter = 'all', page = 1 } = req.query;
    const pageNum = Number(page);

    let messages = getChatCache(extractId);

    if (!messages) {
        const mediaIndex = indexMedia(extractPath);
        messages = parseChat(text, mediaIndex);

        messages = parsed.map(m => ({
            ...m,
            effects: applyChatFilters(m)
        }));

        setChatCache(extractId, messages);
    }

    // FILTER DATA (BUKAN UI)
    let filtered = messages;

    if (filter === 'matched') {
        filtered = messages.filter(m => m.effects.hasMatchedFilter);
    }

    // PAGINATION (AMBIL DARI BAWAH)
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
