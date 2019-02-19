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

    public static parseFromJson(jsonString: string) {
        const plainDocRepo = JSON.parse(jsonString) as DocRepo;
        const newDocs: { [id: string]: Doc } = {};

        Object.entries(plainDocRepo.docs).forEach(([id, doc]) => {
            newDocs[id] = new Doc(
                doc.id,
                doc.docname,
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

    public updateDoc = (doc: Doc) => {
        updateDocInRepo(doc, this);
    };

    private getUniqueDocName = () => {
        let i = 1;

        while (
            this.enumerableDocs.find(
                doc => doc.docname === `${newDocNamePrefix} ${i}`
            )
        ) {
            i++;
        }

        return `${newDocNamePrefix} ${i}`;
    };
}
