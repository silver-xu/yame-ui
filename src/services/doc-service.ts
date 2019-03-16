import { Doc, IDocStatistics } from '../types';

export const getDocStatistics = (doc: Doc): IDocStatistics => {
    const { renderContent } = doc;
    const rawContent = renderContent().replace(/(<([^>]+)>)/gi, '');
    const words = rawContent.split(/[\s,.\r\n]+/);
    const lines = rawContent.split(/[\n\r]+/);

    return {
        charCount: rawContent.length,
        wordCount: words.length,
        lineCount: lines.length
    };
};
