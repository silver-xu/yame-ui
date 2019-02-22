import { Doc } from './doc';
import { DocRepo } from './doc-repo';

export interface IDocStatistics {
    charCount: number;
    wordCount: number;
    lineCount: number;
}

export interface IUser {
    id: string;
    email?: string;
    isAnonymous: boolean;
}

export interface IDocRepoMutation {
    newDocs: Doc[];
    updatedDocs: Doc[];
    deletedDocIds: string[];
}

export { Doc, DocRepo };
