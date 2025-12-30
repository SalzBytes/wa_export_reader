import chatFilters from '../config/chatFilters.js';
import chatKeywords from '../config/chatKeywords.js';

export function applyChatFilters(message) {
    let hasMatchedFilter = false;

    const result = {
        bubbleClass: '',
        textClass: '',
        badge: null,
        matchedFilters: [],
        hasMatchedFilter
    };

    const text = message.text?.toLowerCase() || '';

    for (const rule of chatFilters) {
        let matched = false;

        if (rule.applyTo === 'matched') {
            const keywords = chatKeywords[rule.name] || [];

            matched = keywords.some(kw =>
                text.includes(kw.toLowerCase())
            );

            result.hasMatchedFilter = true;
            if (!matched) continue;
        }

        // collect matched filter names (optional)
        result.matchedFilters.push(rule.name);

        // bubble
        if (rule.effects?.bubble?.background) {
            result.bubbleClass += ` ${rule.effects.bubble.background}`;
        }

        // text
        if (rule.effects?.text) {
            const t = rule.effects.text;
            if (t.color) result.textClass += ` ${t.color}`;
            if (t.weight) result.textClass += ` ${t.weight}`;
            if (t.decoration) result.textClass += ` ${t.decoration}`;
        }

        // badge (last one wins)
        if (rule.effects?.badge) {
            result.badge = rule.effects.badge;
        }
    }

    return result;
}
