import { Doc, IDocStatistics } from '../types';

export const getDocStatistics = (content: string): IDocStatistics => {
    const rawContent = content.replace(/(<([^>]+)>)/gi, '');
    const words = rawContent.split(/[\s,.\r\n]+/);
    const lines = rawContent.split(/[\n\r]+/);

    return {
        charCount: rawContent.length,
        wordCount: words.length,
        lineCount: lines.length
    };
};
