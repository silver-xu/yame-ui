import uuidv4 from 'uuid/v4';
import { Doc, DocRepo, IDocRepoMutation, IDefaultDoc } from '../types';

export const addDocToRepo = (doc: Doc, docRepo: DocRepo) => {
    docRepo.docs[doc.id] = doc;
    docRepo.currentDocId = doc.id;
};

export const getDocFromRepo = (id: string, docRepo: DocRepo) => {
    return docRepo.docs[id] as Doc;
};

export const removeDocFromRepo = (doc: Doc, docRepo: DocRepo) => {
    delete docRepo.docs[doc.id];
};

export const openDocInRepo = (doc: Doc, docRepo: DocRepo) => {
    docRepo.currentDocId = doc.id;
};

export const updateDocInRepo = (doc: Doc, docRepo: DocRepo) => {
    doc.lastModified = new Date();
    docRepo.docs[doc.id] = doc;
};

export const deriveDocRepoMutation = (
    docRepo: DocRepo,
    unChangedDocRepo: DocRepo
): IDocRepoMutation => {
    const newDocs = Object.entries(docRepo.docs)
        .filter(([id]: [string, Doc]) => !unChangedDocRepo.docs[id])
        .map(([, doc]: [string, Doc]) => {
            return {
                id: doc.id,
                docName: doc.docName,
                content: doc.content,
                lastModified: doc.lastModified
            };
        });

    const updatedDocs = Object.entries(docRepo.docs)
        .filter(
            ([id, doc]: [string, Doc]) =>
                unChangedDocRepo.docs[id] &&
                !unChangedDocRepo.docs[id].equals(doc)
        )
        .map(([, doc]: [string, Doc]) => {
            return {
                id: doc.id,
                docName: doc.docName,
                content: doc.content,
                lastModified: doc.lastModified
            };
        });

    const deletedDocIds = Object.entries(unChangedDocRepo.docs)
        .filter(([id]: [string, Doc]) => !docRepo.docs[id])
        .map(([id]: [string, Doc]) => id);

    return {
        newDocs,
        updatedDocs,
        deletedDocIds
    };
};
