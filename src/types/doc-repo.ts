import uuidv4 from 'uuid/v4';
import { IDefaultDoc } from '.';
import {
    addDocToRepo,
    openDocInRepo,
    removeDocFromRepo,
    updateDocInRepo
} from '../services/repo-service';
import { Doc } from './doc';

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

        return new DocRepo(newDocs, plainDocRepo.publishedDocIds);
    }

    public static parseFromResponse(docRepoResponse: any): DocRepo {
        const newDocs: { [id: string]: Doc } = {};
        const newPublishedDocs: { [id: string]: Doc } = {};

        docRepoResponse.docs.map((doc: any) => {
            newDocs[doc.id] = new Doc(
                doc.id,
                doc.docName,
                doc.content,
                doc.lastModified
            );
        });

        return new DocRepo(newDocs, docRepoResponse.publishedDocIds);
    }

    public docs: { [id: string]: Doc };
    public publishedDocIds: string[];
    public currentDocId: string;

    constructor(docs: { [id: string]: Doc }, publishedDocs: string[]) {
        this.docs = docs;
        this.publishedDocIds = publishedDocs;
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

        return new DocRepo(newDocs, plainDocRepo.publishedDocIds);
    }

    public newDoc = (defaultDoc: IDefaultDoc): Doc => {
        const newDoc = new Doc(
            uuidv4(),
            this.getUniqueDocName(defaultDoc.namePrefix),
            defaultDoc.defaultContent,
            new Date()
        );

        addDocToRepo(newDoc, this);
        return newDoc;
    };

    public openDoc = (id: string) => {
        openDocInRepo(this.docs[id], this);
    };

    public removeDoc = (id: string, defaultDoc: IDefaultDoc) => {
        removeDocFromRepo(this.docs[id], this);

        if (this.sortedDocs.length === 0) {
            this.newDoc(defaultDoc);
        }
        this.currentDocId = this.sortedDocs[0].id;
    };

    public updateDocName = (doc: Doc, newDocName: string) => {
        doc.docName = newDocName;
        this.updateDoc(doc);
    };

    public updateDoc = (doc: Doc) => {
        updateDocInRepo(doc, this);
    };

    private getUniqueDocName = (defaultPrefix: string) => {
        let i = 1;

        while (
            this.enumerableDocs.find(
                doc => doc.docName === `${defaultPrefix} ${i}`
            )
        ) {
            i++;
        }

        return `${defaultPrefix} ${i}`;
    };
}
