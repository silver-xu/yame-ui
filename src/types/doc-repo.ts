import uuidv4 from 'uuid/v4';
import {
    addDocToRepo,
    openDocInRepo,
    removeDocFromRepo,
    updateDocInRepo
} from '../services/repo-service';
import { Doc } from './doc';

const newDocNamePrefix = 'My document';

export class DocRepo {
    get sortedDocs(): Doc[] {
        return this.enumerableDocs.sort((a: Doc, b: Doc) => {
            return (
                new Date(b.lastModified).getTime() -
                new Date(a.lastModified).getTime()
            );
        });
    }

    get enumerableDocs(): Doc[] {
        return Object.entries(this.docs).map(([_, doc]) => {
            return doc;
        });
    }

    get currentDoc(): Doc {
        return this.docs[this.currentDocId];
    }

    public static parseFromJson(jsonString: string): DocRepo {
        const plainDocRepo = JSON.parse(jsonString) as DocRepo;
        const newDocs: { [id: string]: Doc } = {};

        Object.entries(plainDocRepo.docs).forEach(([id, doc]) => {
            newDocs[id] = new Doc(
                doc.id,
                doc.docName,
                doc.content,
                doc.lastModified
            );
        });

        return new DocRepo(newDocs);
    }

    public static parseFromResponse(docRepoResponse: any): DocRepo {
        const newDocs: { [id: string]: Doc } = {};
        docRepoResponse.docs.forEach((doc: any) => {
            newDocs[doc.id] = new Doc(
                doc.id,
                doc.docName,
                doc.content,
                doc.lastModified
            );
        });

        return new DocRepo(newDocs);
    }

    public docs: { [id: string]: Doc };
    public currentDocId: string;

    constructor(docs: { [id: string]: Doc }) {
        this.docs = docs;
        this.currentDocId = this.sortedDocs[0].id;
    }

    public clone(): DocRepo {
        const plainDocRepo = { ...this } as DocRepo;
        const newDocs: { [id: string]: Doc } = {};

        Object.entries(plainDocRepo.docs).forEach(([id, doc]) => {
            newDocs[id] = new Doc(
                doc.id,
                doc.docName,
                doc.content,
                doc.lastModified
            );
        });

        return new DocRepo(newDocs);
    }

    public newDoc = (): Doc => {
        const newDoc = new Doc(
            uuidv4(),
            this.getUniqueDocName(),
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

    public updateDocName = (doc: Doc, newDocName: string) => {
        doc.docName = newDocName;
        this.updateDoc(doc);
    };

    public updateDoc = (doc: Doc) => {
        updateDocInRepo(doc, this);
    };

    private getUniqueDocName = () => {
        let i = 1;

        while (
            this.enumerableDocs.find(
                doc => doc.docName === `${newDocNamePrefix} ${i}`
            )
        ) {
            i++;
        }

        return `${newDocNamePrefix} ${i}`;
    };
}
