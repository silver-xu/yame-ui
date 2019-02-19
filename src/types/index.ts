import { Doc } from './doc';
import { DocRepo } from './doc-repo';

export interface IDocStatistics {
    charCount: number;
    wordCount: number;
    lineCount: number;
}

export interface IUser {
    id: string;
    email: string;
    repo: DocRepo;
}

export { Doc, DocRepo };
