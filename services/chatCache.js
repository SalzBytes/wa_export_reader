const chatCache = new Map();

export function getChatCache(key) {
    return chatCache.get(key);
}

export function setChatCache(key, data) {
    chatCache.set(key, data);
}
