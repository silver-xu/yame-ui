import { Doc } from './doc';
import { DocRepo } from './doc-repo';

export interface IDocStatistics {
    charCount: number;
    wordCount: number;
    lineCount: number;
}

export interface IUser {
    authToken: string;
    id: string;
    isValid: boolean;
    userName: string;
    userType: UserType;
}

export enum UserType {
    Anonymous = 'Anonymous',
    Facebook = 'Facebook'
}

export interface IDocRepoMutation {
    newDocs: Doc[];
    updatedDocs: Doc[];
    deletedDocIds: string[];
}

export { Doc, DocRepo };
