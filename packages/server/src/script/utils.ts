import { fileSuffixMap } from '@/script/constants';
import * as path from 'path';

export const getFilePath = (language = 'javascript', userId) => {
  return path.join(
    'data',
    'files',
    `${userId}`,
    language,
    `${Date.now()}`,
    `index.${fileSuffixMap[language]}`,
  );
};
