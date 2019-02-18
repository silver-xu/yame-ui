import { Doc } from './doc';
import {
    addDocToRepo,
    openDocInRepo,
    removeDocFromRepo,
    updateDocInRepo
} from '../services/repo-service';
import uuidv4 from 'uuid/v4';

export class DocRepo {
    docs: { [id: string]: Doc };
    currentDocId: string;
    constructor(docs: { [id: string]: Doc }) {
        this.docs = docs;
        this.currentDocId = this.sortedDocs[0].id;
    }

    get sortedDocs(): Doc[] {
        return Object.keys(this.docs)
            .map(id => {
                return this.docs[id];
            })
            .sort((a: Doc, b: Doc) => {
                return (
                    new Date(b.lastModified).getTime() -
                    new Date(a.lastModified).getTime()
                );
            });
    }

    get currentDoc(): Doc {
        return this.docs[this.currentDocId];
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

        return new DocRepo(newDocs);
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

    public openDoc = (id: string) => {
        openDocInRepo(this.docs[id], this);
    };

    public removeDoc = (id: string) => {
        removeDocFromRepo(this.docs[id], this);
    };

    public updateDoc = (doc: Doc) => {
        updateDocInRepo(doc, this);
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
