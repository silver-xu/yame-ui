export const getFirstNLines = (str: string, n: number): string => {
    return str
        .split('\r\n')
        .splice(0, n)
        .join('\r\n');
};
