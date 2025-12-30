import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export function indexMedia(dir) {
  const files = fs.readdirSync(dir);

  return files
    .filter(f => mime.lookup(f))
    .map(f => ({
      name: f,
      type: mime.lookup(f),
      ts: fs.statSync(path.join(dir, f)).mtimeMs
    }))
    .sort((a, b) => a.ts - b.ts);
}
