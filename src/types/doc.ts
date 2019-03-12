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

const nodeRegex = new RegExp(/<h[1-3] id="[0-9a-zA-Z]*">.*<\/h[1-3]>/g);
const nodeTextRegex = new RegExp(/<h[1-3] id=".*">(.*?)<\/h[1-3]>/g);

const converter = new showdown.Converter({
    tables: true,
    smoothLivePreview: true,
    strikethrough: true,
    requireSpaceBeforeHeadingText: true,
    extensions: [showdownHighlight]
});

export interface IContentNode {
    text: string;
    dom: HTMLElement;
    docNodes?: IContentNode[];
}

export class Doc {
    // using cached rendered content to boost performance of rendering
    get renderedContent(): string {
        if (
            this.content !== this.unchangedContent ||
            !this.renderedContentCached
        ) {
            const dangerousHtml = converter.makeHtml(this.content);
            this.renderedContentCached = xss(dangerousHtml, xssOptions);
            this.unchangedContent = this.content;
        }

        // it will never be undefined
        return this.renderedContentCached as string;
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

    private renderedContentCached?: string;
    private unchangedContent: string;

    constructor(
        id: string,
        docName: string,
        content: string,
        lastModified: Date
    ) {
        this.id = id;
        this.docName = docName;
        this.content = content;
        this.unchangedContent = content;
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

    public buildContentNodeTree(): IContentNode[] | undefined {
        // using cached rendered content so the following statement has minimum performance penalty
        let matches = nodeRegex.exec(this.renderedContent);
        const flatContentNodeTree: IContentNode = [];
        while (matches !== null) {
            const match = matches[0];
            flatContentNodeTree.push({});
            matches = nodeRegex.exec(this.renderedContent);
        }

        return undefined;
    }
}
