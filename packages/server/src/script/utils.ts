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
export const getStartCommand = (language: string) => {
  if (language === 'javascript') return 'node';
  if (language === 'python3') return 'python3';
  if (language === 'ruby') return 'ruby';
  return 'node';
};
