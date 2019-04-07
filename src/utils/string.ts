export const getFirstNLines = (str: string, n: number): string => {
    return str
        .split('\r\n')
        .splice(0, n)
        .join('\r\n');
};

export const containsAllTokens = (str: string, tokens: string[]): boolean => {
    let contains = true;
    tokens.forEach(token => {
        if (str.toLowerCase().indexOf(token.toLowerCase()) === -1) {
            contains = false;
        }
    });

    return contains;
};

export const normalizeToUrl = (str: string) => {
    return str
        .split(' ')
        .join('-')
        .toLowerCase();
};
