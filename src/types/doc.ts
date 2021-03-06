import { IDoc } from '.';

import { getMatches } from '../utils/regex';
import { getFirstNLines } from '../utils/string';
import { getShortFriendlyDateDifference } from '../utils/time';

// tslint:disable-next-line: no-var-requires
const worker = require('../convert.worker');
// tslint:disable-next-line: no-var-requires
const WebworkerPromise = require('webworker-promise');
const convertWorker = new WebworkerPromise(new worker());

const nodeRegex = new RegExp(/<h[1-3] id=".*">.*<\/h[1-3]>/gm);
const nodeTextRegex = new RegExp(/<h[1-3] id=".*">(.*?)<\/h[1-3]>/gm);
const nodeIdRegex = new RegExp(/id="(.*?)"/gm);

export interface IContentNode {
    level: number;
    text: string;
    id: string;
    parentNode?: IContentNode;
    nodes: IContentNode[];
}

export class Doc implements IDoc {
    public static parseFromResponse(docResponse: any): Doc {
        const {
            id,
            docName,
            content,
            lastModified,
            removed,
            generatePdf,
            generateWord,
            secretPhrase,
            protectWholeDoc
        } = docResponse;
        return new Doc(
            id,
            docName,
            content,
            lastModified,
            removed,
            generatePdf,
            generateWord,
            secretPhrase,
            protectWholeDoc
        );
    }

    public id: string;
    public docName: string;
    public content: string;
    public lastModified: Date;
    public published: boolean;
    public removed: boolean;
    public generatePdf: boolean;
    public generateWord: boolean;
    public protectDoc: boolean;
    public secretPhrase?: string;
    public protectWholeDoc?: boolean;

    private renderedContentCached?: string;
    private contentTreeCached?: IContentNode;
    private flatContentTreeCached?: IContentNode[];
    private unchangedContent: string;

    constructor(
        id: string,
        docName: string,
        content: string,
        lastModified: Date,
        removed: boolean,
        generatePdf: boolean,
        generateWord: boolean,
        protectDoc: boolean,
        secretPhrase?: string,
        protectWholdDoc?: boolean
    ) {
        this.id = id;
        this.docName = docName;
        this.content = content;
        this.unchangedContent = content;
        this.lastModified = new Date(lastModified);
        this.published = false;
        this.removed = removed;

        this.generatePdf = generatePdf;
        this.generateWord = generateWord;
        this.protectDoc = protectDoc;
        this.secretPhrase = secretPhrase;
        this.protectWholeDoc = protectWholdDoc;
    }

    public equals = (comparisonDoc: Doc): boolean => {
        return (
            this.content === comparisonDoc.content &&
            this.docName === comparisonDoc.docName &&
            this.lastModified.toISOString() ===
                comparisonDoc.lastModified.toISOString()
        );
    };

    // using cached rendered content to boost performance of rendering
    public renderContent = async (): Promise<string> => {
        if (
            this.content !== this.unchangedContent ||
            !this.renderedContentCached
        ) {
            const message = await convertWorker.postMessage(this.content);
            this.renderedContentCached = String(message);

            this.unchangedContent = this.content;
            return this.renderedContentCached;
        }

        // it will never be undefined
        return Promise.resolve(this.renderedContentCached as string);
    };

    // using cached rendered content to boost performance of rendering
    public renderBriefContent = async (): Promise<string> => {
        const message = await convertWorker.postMessage(
            getFirstNLines(this.content, 50)
        );
        return message;
    };

    public getFriendlyLastModifiedTimespan = (): string => {
        return `${getShortFriendlyDateDifference(
            new Date(),
            this.lastModified
        )}`;
    };

    public buildContentNodeTree = async (): Promise<IContentNode> => {
        if (this.content !== this.unchangedContent || !this.contentTreeCached) {
            const flatContentNodeTree = await this.getFlatContentNodeTree();
            const rootNode = {
                id: 'root',
                text: 'root',
                level: 0,
                nodes: []
            };

            this.recursivelyBuildContentNodeTree(
                flatContentNodeTree,
                0,
                rootNode
            );
            this.contentTreeCached = rootNode;
        }
        return this.contentTreeCached;
    };

    private getFlatContentNodeTree = async (): Promise<IContentNode[]> => {
        if (
            this.content !== this.unchangedContent ||
            !this.flatContentTreeCached
        ) {
            // using cached rendered content so the following statement has minimum performance penalty
            const matches = getMatches(
                await this.renderContent(),
                nodeRegex,
                0
            );
            this.flatContentTreeCached = matches.map(match => {
                const node = match;
                const textMatch = getMatches(node, nodeTextRegex, 1);
                const text = textMatch ? textMatch[0] : '';
                const idMatch = getMatches(node, nodeIdRegex, 1);
                const id = idMatch ? idMatch[0] : '';
                const level = parseInt(node.substring(2, 3), 10);
                return {
                    id,
                    text,
                    level,
                    nodes: []
                };
            });
        }
        return this.flatContentTreeCached;
    };

    private recursivelyBuildContentNodeTree = (
        flatContentNodeTree: IContentNode[],
        currentIndex: number,
        lastNode: IContentNode
    ) => {
        if (currentIndex >= flatContentNodeTree.length) {
            return;
        } else if (flatContentNodeTree[currentIndex].level < lastNode.level) {
            if (lastNode.parentNode) {
                this.recursivelyBuildContentNodeTree(
                    flatContentNodeTree,
                    currentIndex,
                    lastNode.parentNode
                );
            }
            return;
        } else if (flatContentNodeTree[currentIndex].level === lastNode.level) {
            if (lastNode.parentNode) {
                flatContentNodeTree[currentIndex].parentNode =
                    lastNode.parentNode;
                lastNode.parentNode.nodes.push(
                    flatContentNodeTree[currentIndex]
                );
            }
        } else if (flatContentNodeTree[currentIndex].level > lastNode.level) {
            flatContentNodeTree[currentIndex].parentNode = lastNode;
            lastNode.nodes.push(flatContentNodeTree[currentIndex]);
        }

        this.recursivelyBuildContentNodeTree(
            flatContentNodeTree,
            currentIndex + 1,
            flatContentNodeTree[currentIndex]
        );
    };
}
