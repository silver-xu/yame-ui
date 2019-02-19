import * as showdown from 'showdown';
import { IDocStatistics } from '.';
import { getDocStatistics } from '../services/doc-service';
import { getShortFriendlyDateDifference } from '../utils/time';
const showdownHighlight = require('showdown-highlight');

const converter = new showdown.Converter({
    tables: true,
    smoothLivePreview: true,
    requireSpaceBeforeHeadingText: true,
    extensions: [showdownHighlight]
});

export class Doc {
    public id: string;
    public docname: string;
    public content: string;
    public lastModified: Date;

    constructor(
        id: string,
        docname: string,
        content: string,
        lastModified: Date
    ) {
        this.id = id;
        this.docname = docname;
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
}
