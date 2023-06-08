export const analysisComment = (code: string) => {
    const userScrip: any = {};
    const userScriptMatchArray = code.match(
        /\/\/\s*==UserScript==\s*([\s\S]*?)\/\/\s*==\/UserScript==/i,
    );
    if (userScriptMatchArray) {
        for (const match of userScriptMatchArray[1].matchAll(
            /\/\/\s*@(\w+)\s+(.*)/g,
        )) {
            const [, key, value] = match;
            userScrip[key] = value;
        }
    }
    return userScrip;
};
