export const getStartCommand = (language: string) => {
  if (language === 'javascript') return 'node';
  if (language === 'python') return 'python';
  if (language === 'ruby') return 'ruby';
  return 'node';
};
