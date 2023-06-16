export const analysisComment = (code: string) => {
  const userScript: any = {};
  const userScriptMatchArray = code.match(
    /.*==UserScript==([\s\S]*)==\/UserScript==/,
  );
  if (userScriptMatchArray) {
    const commentRegex = /#*\s*@(\w+)\s+(.*)/g;
    const commentMatches = userScriptMatchArray[1].matchAll(commentRegex);
    for (const match of commentMatches) {
      const [, key, value] = match;
      userScript[key] = value.trim();
    }
  }
  return userScript;
};
