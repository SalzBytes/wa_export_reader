import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

import { parseChat } from './services/waParser.js';
import { indexMedia } from './services/mediaIndexer.js';
import { getChatCache, setChatCache } from './services/chatCache.js';
import { PAGE_SIZE } from './config/chatView.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/media', express.static('uploads/extracted'));

app.get('/', (_, res) => res.render('upload'));

app.post('/upload', upload.single('zip'), async (req, res) => {
    const extractId = Date.now().toString();
    const extractPath = `uploads/extracted/${extractId}`;

    new AdmZip(req.file.path).extractAllTo(extractPath, true);

    // 👉 redirect ke halaman chat
    res.redirect(`/chat/${extractId}`);
});

app.get('/chat/:id', async (req, res) => {
    const extractId = req.params.id;
    const extractPath = `uploads/extracted/${extractId}`;

    const page = Number(req.query.page || 1);
    const filter = req.query.filter || 'all';

    const txt = fs.readdirSync(extractPath).find(f => f.endsWith('.txt'));
    const text = fs.readFileSync(path.join(extractPath, txt), 'utf8');

    let messages = getChatCache(extractId);

    if (!messages) {
        const mediaIndex = indexMedia(extractPath);
        messages = parseChat(text, mediaIndex);
        setChatCache(extractId, messages);
    }

    // FILTER SERVER-SIDE
    let filtered = messages;
    if (filter === 'matched') {
        filtered = messages.filter(m => m.effects?.hasMatchedFilter);
    }

    // PAGINATION
    const total = filtered.length;
    const start = Math.max(total - page * PAGE_SIZE, 0);
    const end = total - (page - 1) * PAGE_SIZE;
    const pageMessages = filtered.slice(start, end);

    res.render('chat', {
        messages: pageMessages,
        mediaBase: `/media/${extractId}`,
        yourself: process.env.YOUR_USERNAME_CHAT,
        page,
        filter,
        hasMore: start > 0,
        extractId
    });
});


app.listen(3000, () =>
    console.log('🔥 http://localhost:3000')
);
