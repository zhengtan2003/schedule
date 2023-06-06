import * as fs from 'fs';
import type { PathLike } from 'fs';

export const unlinkSync = (path: PathLike) => {
    if (fs.existsSync(path)) fs.unlinkSync(path);
};
