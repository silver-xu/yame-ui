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

    get availableDocs(): Doc[] {
        return this.enumerableDocs.filter(doc => !doc.removed);
    }

    get publishedDocs(): Doc[] {
        return this.availableDocs.filter(doc => doc.published);
    }

    get draftDocs(): Doc[] {
        return this.availableDocs.filter(doc => !doc.published);
    }

    get removedDocs(): Doc[] {
        return this.availableDocs.filter(doc => doc.removed);
    }

    get currentDoc(): Doc | undefined {
        return this.currentDocId ? this.docs[this.currentDocId] : undefined;
    }

    public static parseFromJson(jsonString: string): DocRepo {
        const plainDocRepo = JSON.parse(jsonString) as DocRepo;
        const newDocs: { [id: string]: Doc } = {};

        Object.entries(plainDocRepo.docs).forEach(([id, doc]) => {
            newDocs[id] = new Doc(
                doc.id,
                doc.docName,
                doc.content,
                doc.lastModified,
                doc.removed,
                doc.generatePdf,
                doc.generateWord,
                doc.protectDoc,
                doc.secretPhrase,
                doc.protectWholeDoc
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
                doc.lastModified,
                doc.removed,
                doc.generatePdf,
                doc.generateWord,
                doc.protectDoc,
                doc.secretPhrase,
                doc.protectWholdDoc
            );
        });

        return new DocRepo(newDocs, docRepoResponse.publishedDocIds);
    }

    public docs: { [id: string]: Doc };
    public publishedDocIds: string[];
    public currentDocId?: string;

    constructor(docs: { [id: string]: Doc }, publishedDocs: string[]) {
        this.docs = docs;
        this.publishedDocIds = publishedDocs;
    }

    public clone(): DocRepo {
        const plainDocRepo = { ...this } as DocRepo;
        const newDocs: { [id: string]: Doc } = {};

        Object.entries(plainDocRepo.docs).forEach(([id, doc]) => {
            newDocs[id] = new Doc(
                doc.id,
                doc.docName,
                doc.content,
                doc.lastModified,
                doc.removed,
                doc.generatePdf,
                doc.generateWord,
                doc.protectDoc,
                doc.secretPhrase,
                doc.protectWholeDoc
            );
        });

        return new DocRepo(newDocs, plainDocRepo.publishedDocIds);
    }

    public newDoc = (defaultDoc: IDefaultDoc): Doc => {
        const newDoc = new Doc(
            uuidv4(),
            this.getUniqueDocName(defaultDoc.namePrefix),
            defaultDoc.defaultContent,
            new Date(),
            false,
            true,
            true,
            false
        );

        addDocToRepo(newDoc, this);
        return newDoc;
    };

    public openDoc = (id: string) => {
        openDocInRepo(this.docs[id], this);
    };

    public closeCurentDoc = () => {
        this.currentDocId = undefined;
    };

    public removeDoc = (id: string) => {
        removeDocFromRepo(this.docs[id], this);
    };

    public updateDocName = (doc: Doc, newDocName: string) => {
        doc.docName = newDocName;

        // short circuit updating the modified date
        this.docs[doc.id] = doc;
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
