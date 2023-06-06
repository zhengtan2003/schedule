import * as fs from 'fs';

export const readFileSync = (path: string) => {
    if (fs.existsSync(path)) return fs.readFileSync(path).toString();
};
