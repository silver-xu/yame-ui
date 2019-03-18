import { Doc } from './doc';
import { DocRepo } from './doc-repo';

export interface IDocStatistics {
    charCount: number;
    wordCount: number;
    lineCount: number;
}

export interface IUser {
    authToken: string;
    id?: string;
    isValid: boolean;
    userName?: string;
    userType: UserType;
}

export enum UserType {
    Anonymous = 'Anonymous',
    Facebook = 'Facebook'
}

export interface IDoc {
    id: string;
    docName: string;
    content: string;
    lastModified: Date;
}

export interface IDocRepoMutation {
    newDocs: IDoc[];
    updatedDocs: IDoc[];
    deletedDocIds: string[];
}

export interface IDefaultDoc {
    namePrefix: string;
    defaultContent: string;
}

export interface IPublishResult {
    normalizedUsername: string;
    permalink: string;
}

export { Doc, DocRepo };
