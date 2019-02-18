import * as showdown from 'showdown';
import { IDocStatistics } from '.';
import { getDocStatistics } from '../services/doc-service';
const showdownHighlight = require('showdown-highlight');

const converter = new showdown.Converter({
    tables: true,
    smoothLivePreview: true,
    requireSpaceBeforeHeadingText: true,
    extensions: [showdownHighlight]
});

export class Doc {
    id: string;
    docname: string;
    content: string;
    lastModified: Date;

    constructor(
        id: string,
        docname: string,
        content: string,
        lastModified: Date
    ) {
        this.id = id;
        this.docname = docname;
        this.content = content;
        this.lastModified = lastModified;
    }

    get renderedContent(): string {
        return converter.makeHtml(this.content);
    }

    get statistics(): IDocStatistics {
        return getDocStatistics(this);
    }
}
