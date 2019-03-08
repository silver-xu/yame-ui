import * as showdown from 'showdown';
import { IDocStatistics } from '.';
import { getDocStatistics } from '../services/doc-service';
import { getShortFriendlyDateDifference } from '../utils/time';
// tslint:disable-next-line:no-var-requires
const showdownHighlight = require('showdown-highlight');
// tslint:disable-next-line:no-var-requires
const xssFilter = require('showdown-xss-filter');

const converter = new showdown.Converter({
    tables: true,
    smoothLivePreview: true,
    strikethrough: true,
    requireSpaceBeforeHeadingText: true,
    extensions: [showdownHighlight, xssFilter]
});

export class Doc {
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

    get renderedContent(): string {
        return converter.makeHtml(this.content);
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

    public equals = (comparisonDoc: Doc): boolean => {
        return (
            this.content === comparisonDoc.content &&
            this.docName === comparisonDoc.docName &&
            this.lastModified.toISOString() ===
                comparisonDoc.lastModified.toISOString()
        );
    };
}
