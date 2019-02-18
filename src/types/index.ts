import { Doc } from './doc';
import { addDocToRepo } from '../services/repo-service';
import uuidv4 from 'uuid/v4';

export class DocRepo {
    docs: { [id: string]: Doc };
    lastOpenedDocId: string;
    constructor(docs: { [id: string]: Doc }, lastOpenedDocId: string) {
        this.docs = docs;
        this.lastOpenedDocId = lastOpenedDocId;
    }

    static parseFromJson(jsonString: string) {
        const plainDocRepo = JSON.parse(jsonString) as DocRepo;
        const newDocs: { [id: string]: Doc } = {};
        for (const id in plainDocRepo.docs) {
            newDocs[id] = new Doc(
                plainDocRepo.docs[id].id,
                plainDocRepo.docs[id].docname,
                plainDocRepo.docs[id].content,
                plainDocRepo.docs[id].lastModified
            );
        }

        return new DocRepo(newDocs, plainDocRepo.lastOpenedDocId);
    }

    public newDoc = (): Doc => {
        const newDoc = new Doc(
            uuidv4(),
            'My document 2',
            'hello world',
            new Date()
        );

        addDocToRepo(newDoc, this);
        return newDoc;
    };
}

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

export { Doc };
