import dayjs from 'dayjs';
import chatFilters from '../config/chatFilters.js';
import { applyChatFilters } from './chatFilterEngine.js';
import { formatDate } from './dateFormatter.js';

const yourself = (process.env.YOUR_USERNAME_CHAT || 'You').trim();

export function parseChat(text, mediaIndex) {
    const lines = text.split(/\r?\n/);
    const messages = [];

    const regex =
        /^(\d{2}\/\d{2}\/\d{2}) (\d{2}\.\d{2}) - ([^:]+): (.*)$/;

    for (const line of lines) {
        const m = line.match(regex);

        if (m) {
            const ts = dayjs(
                `${m[1]} ${m[2]}`,
                'DD/MM/YY HH.mm'
            ).valueOf();

            const media = mediaIndex.find(
                f => Math.abs(f.ts - ts) < 60000
            );

            const raw_date = m[1];
            const raw_time = m[2];
            const raw_user = m[3].trim();

            const formattedDate = formatDate(raw_date);
            const isYourself = raw_user === yourself;

            const cleanText = m[4]
                .replace('<Media omitted>', '')
                .replace(/\r/g, '')
                .split('\n')
                .map(line => line.trimStart())
                .join('\n');

            const rawText = cleanText.trim();
            const isViewOnce = rawText === '' && media !== null;

            const effects = applyChatFilters({
                text: cleanText
            });

            messages.push({
                rawDate: raw_date,
                date: formattedDate,
                time: raw_time,
                user: raw_user,
                text: cleanText,
                isYourself,
                media,
                isViewOnce,
                effects,
            });
        } else if (messages.length) {
            messages.at(-1).text += '\n' + line;
        }
    }
    return messages;
}
