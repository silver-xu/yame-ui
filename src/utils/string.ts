export const getFirstNLines = (str: string, n: number): string => {
    return str
        .split('\r\n')
        .splice(0, n)
        .join('\r\n');
};

export const containsTokens = (str: string, tokens: string[]): boolean => {
    tokens.forEach(token => {
        if (str.indexOf(token) === -1) {
            return false;
        }
    });

    return true;
};
