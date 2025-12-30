import fs from 'fs';
import path from 'path';

const CACHE_DIR = 'cache/chats';

if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function getCachePath(id) {
    return path.join(CACHE_DIR, `${id}.json`);
}

export function getChatCache(id) {
    const file = getCachePath(id);
    if (!fs.existsSync(file)) return null;

    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function setChatCache(id, data) {
    const file = getCachePath(id);
    fs.writeFileSync(file, JSON.stringify(data));
}
