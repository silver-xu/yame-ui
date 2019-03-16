export const getMatches = (
    str: string,
    regex: RegExp,
    groupIndex: number
): string[] => {
    const groups = [];
    let matches = regex.exec(str);
    while (matches !== null) {
        groups.push(matches[groupIndex]);
        matches = regex.exec(str);
    }

    return groups;
};
