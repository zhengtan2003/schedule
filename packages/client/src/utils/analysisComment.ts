export const analysisComment = (code: string) => {
  const userScript: any = {};
  const matchArray = code.match(
    /==UserScript==([\s\S]*?)==\/UserScript==/g,
  );
  if (matchArray) {
    const commentRegex = /#*\s*@(\w+)\s+(.*)/g;
    const commentMatches = matchArray[0].matchAll(commentRegex);
    for (const match of commentMatches) {
      const [, key, value] = match;
      userScript[key] = value.trim();
    }
  }
  return userScript;
};
