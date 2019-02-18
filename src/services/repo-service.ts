import { Doc, DocRepo } from '../types';
import uuidv4 from 'uuid/v4';

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
    cacheRepo(docRepo);
};

export const getDocFromRepo = (id: string, docRepo: DocRepo) => {
    return docRepo.docs[id] as Doc;
};

export const removeDocFromRepo = (doc: Doc, docRepo: DocRepo) => {
    delete docRepo.docs[doc.id];
    cacheRepo(docRepo);
};

export const openDocInRepo = (doc: Doc, docRepo: DocRepo) => {
    docRepo.lastOpenedDocId = doc.id;
    cacheRepo(docRepo);
};

export const updateDocInRepo = (doc: Doc, docRepo: DocRepo) => {
    docRepo.docs[doc.id] = doc;
    cacheRepo(docRepo);
};

const initNewRepo = () => {
    const doc = new Doc('My document 1', 'hello world', uuidv4(), new Date());

    const docRepo = new DocRepo({}, doc.id);

    addDocToRepo(doc, docRepo);
    docRepo.lastOpenedDocId = doc.id;
    cacheRepo(docRepo);

    return docRepo;
};
