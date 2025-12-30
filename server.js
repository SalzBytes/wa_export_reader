import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { parseChat } from './services/waParser.js';
import { indexMedia } from './services/mediaIndexer.js';

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

    const txt = fs.readdirSync(extractPath).find(f => f.endsWith('.txt'));
    const text = fs.readFileSync(path.join(extractPath, txt), 'utf8');

    const mediaIndex = indexMedia(extractPath);
    const messages = parseChat(text, mediaIndex);

    res.render('chat', {
        messages,
        mediaBase: `/media/${extractId}`,
        yourself: process.env.YOUR_USERNAME_CHAT
    });
});

app.listen(3000, () =>
    console.log('🔥 http://localhost:3000')
);
