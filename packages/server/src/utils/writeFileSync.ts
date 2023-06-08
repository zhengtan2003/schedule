import * as fs from 'fs';
import * as path from 'path';
import type { WriteFileOptions } from 'fs';

export const writeFileSync = (
    filePath: string,
    data: string | NodeJS.ArrayBufferView,
    options?: WriteFileOptions,
) => {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, data, options);
};
