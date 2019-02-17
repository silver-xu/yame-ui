import { IDoc, IDocRepo } from '../types';
import uuidv4 from 'uuid/v4';

export const cacheRepo = (docRepo: IDocRepo) => {
    const encodedDocRepo = JSON.stringify(docRepo);
    localStorage.setItem('docRepo', encodedDocRepo);
};

export const getRepoFromCache = (): IDocRepo => {
    const encodedDocRepo = localStorage.getItem('docRepo');
    const cachedDocRepo = encodedDocRepo
        ? (JSON.parse(encodedDocRepo) as IDocRepo)
        : null;

    if (cachedDocRepo && Object.keys(cachedDocRepo.docs).length > 0) {
        return cachedDocRepo;
    } else {
        return initNewRepo();
    }
};

export const addDocToRepo = (doc: IDoc, docRepo: IDocRepo) => {
    docRepo.docs[doc.id] = doc;
    cacheRepo(docRepo);
};

export const getDocFromRepo = (id: string, docRepo: IDocRepo) => {
    return docRepo.docs[id] as IDoc;
};

export const removeDocFromRepo = (doc: IDoc, docRepo: IDocRepo) => {
    delete docRepo.docs[doc.id];
    cacheRepo(docRepo);
};

export const openDocInRepo = (doc: IDoc, docRepo: IDocRepo) => {
    docRepo.lastOpenedDocId = doc.id;
    cacheRepo(docRepo);
};

export const updateDocInRepo = (doc: IDoc, docRepo: IDocRepo) => {
    docRepo.docs[doc.id] = doc;
    cacheRepo(docRepo);
};

const initNewRepo = () => {
    const doc: IDoc = {
        docname: 'My document 1',
        content: 'hello world',
        id: uuidv4(),
        lastModified: new Date()
    };

    const docRepo = {
        docs: {},
        lastOpenedDocId: doc.id
    };

    addDocToRepo(doc, docRepo);
    docRepo.lastOpenedDocId = doc.id;
    cacheRepo(docRepo);

    return docRepo;
};
