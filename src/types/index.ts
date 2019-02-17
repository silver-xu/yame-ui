import { string } from 'prop-types';

export interface IDoc {
    id: string;
    docname: string;
    content: string;
    lastModified: Date;
}

export interface IDocStatistics {
    byteCount: number;
    wordCount: number;
    lineCount: number;
}

export interface IDocRepo {
    docs: { [id: string]: IDoc };
    lastOpenedDocId: string;
}

export interface IUser {
    id: string;
    email: string;
    repo: IDocRepo;
}
