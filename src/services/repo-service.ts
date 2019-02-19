import uuidv4 from 'uuid/v4';
import { Doc, DocRepo } from '../types';

export const cacheRepo = (docRepo: DocRepo) => {
    const encodedDocRepo = JSON.stringify(docRepo);
    localStorage.setItem('docRepo', encodedDocRepo);
};

export const getRepoFromCache = (): DocRepo => {
    const encodedDocRepo = localStorage.getItem('docRepo');
    const cachedDocRepo = encodedDocRepo
        ? DocRepo.parseFromJson(encodedDocRepo)
        : null;

    // cachedDocRepo && Object.setPrototypeOf(cachedDocRepo, DocRepo.prototype);
    if (cachedDocRepo && Object.keys(cachedDocRepo.docs).length > 0) {
        return cachedDocRepo;
    } else {
        return initNewRepo();
    }
};

export const addDocToRepo = (doc: Doc, docRepo: DocRepo) => {
    docRepo.docs[doc.id] = doc;
    docRepo.currentDocId = doc.id;
    cacheRepo(docRepo);
};

export const getDocFromRepo = (id: string, docRepo: DocRepo) => {
    return docRepo.docs[id] as Doc;
};

export const removeDocFromRepo = (doc: Doc, docRepo: DocRepo) => {
    if (Object.keys(docRepo.docs).length > 1) {
        delete docRepo.docs[doc.id];
        docRepo.currentDocId = docRepo.sortedDocs[0].id;
        cacheRepo(docRepo);
    }
};

export const openDocInRepo = (doc: Doc, docRepo: DocRepo) => {
    docRepo.currentDocId = doc.id;
    cacheRepo(docRepo);
};

export const updateDocInRepo = (doc: Doc, docRepo: DocRepo) => {
    doc.lastModified = new Date();
    docRepo.docs[doc.id] = doc;
    cacheRepo(docRepo);
};

const initNewRepo = () => {
    const doc = new Doc('My document 1', 'hello world', uuidv4(), new Date());
    const docs: { [id: string]: Doc } = {};
    docs[doc.id] = doc;
    const docRepo = new DocRepo(docs);

    addDocToRepo(doc, docRepo);
    docRepo.currentDocId = doc.id;
    cacheRepo(docRepo);

    return docRepo;
};
