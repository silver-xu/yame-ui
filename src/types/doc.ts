import * as showdown from 'showdown';
import { IDocStatistics } from '.';
import { getDocStatistics } from '../services/doc-service';
import { getShortFriendlyDateDifference } from '../utils/time';
// tslint:disable-next-line:no-var-requires
const showdownHighlight = require('showdown-highlight');
// tslint:disable-next-line:no-var-requires
const xss = require('xss');
const xssOptions = {
    whiteList: {
        a: ['href', 'title', 'target'],
        h1: ['id'],
        h2: ['id'],
        h3: ['id'],
        h4: ['id'],
        p: []
    }
};
const converter = new showdown.Converter({
    tables: true,
    smoothLivePreview: true,
    strikethrough: true,
    requireSpaceBeforeHeadingText: true,
    extensions: [showdownHighlight]
});

export class Doc {
    get renderedContent(): string {
        const dangerousHtml = converter.makeHtml(this.content);
        return xss(dangerousHtml, xssOptions);
    }

    get statistics(): IDocStatistics {
        return getDocStatistics(this);
    }

    get friendlyLastModifiedTimespan(): string {
        return `${getShortFriendlyDateDifference(
            new Date(),
            this.lastModified
        )}`;
    }

    public static parseFromResponse(docResponse: any): Doc {
        const { id, docName, content, lastModified } = docResponse.doc;
        return new Doc(id, docName, content, lastModified);
    }

    public id: string;
    public docName: string;
    public content: string;
    public lastModified: Date;

    constructor(
        id: string,
        docName: string,
        content: string,
        lastModified: Date
    ) {
        this.id = id;
        this.docName = docName;
        this.content = content;
        this.lastModified = new Date(lastModified);
    }

    public equals = (comparisonDoc: Doc): boolean => {
        return (
            this.content === comparisonDoc.content &&
            this.docName === comparisonDoc.docName &&
            this.lastModified.toISOString() ===
                comparisonDoc.lastModified.toISOString()
        );
    };
}
