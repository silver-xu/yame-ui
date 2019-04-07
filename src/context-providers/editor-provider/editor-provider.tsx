import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-apollo-hooks';
import uuidv4 from 'uuid/v4';
import { getDocStatistics } from '../../services/doc-service';
import { deriveDocRepoMutation } from '../../services/repo-service';
import {
    Doc,
    DocRepo,
    IDefaultDoc,
    IDocAccess,
    IDocStatistics
} from '../../types';
import { debounce } from '../../utils/deboune';

export interface IEditorProviderProps {
    docRepo: DocRepo;
    defaultDoc: IDefaultDoc;
    children?: React.ReactNode;
}

export enum EditorMode {
    CurrentDoc,
    AvailableDocs,
    Drafts,
    Published,
    Trash
}

export interface IEditorContextValue {
    docRepo: DocRepo;
    isSaving: boolean;
    editorKey: string;
    docAccess?: IDocAccess;
    renderedContent?: string;
    statistics?: IDocStatistics;
    editorMode?: EditorMode;
    updateCurrentDoc: (value: string) => void;
    newDoc: () => void;
    openDoc: (id: string) => void;
    closeCurrentDoc: () => void;
    removeDoc: (id: string) => void;
    updateDoc: (doc: Doc) => void;
    updateDocName: (id: string, newDocName: string) => void;
    setEditorMode: (editorMode?: EditorMode) => void;
    isPermalinkDuplicate: (
        docId: string,
        permalink: string
    ) => Promise<boolean>;
    publishDoc: (doc: Doc) => void;
}

export interface IEditorProviderUIState {
    isSaving: boolean;
    editorKey: string;
}

export interface IEditorProviderDocState {
    docRepo: DocRepo;
    unchangedDocRepo: DocRepo;
}

export const EditorContext = React.createContext<IEditorContextValue>({
    docRepo: new DocRepo(
        {
            foo: new Doc(
                'foo',
                'bar',
                'foobar',
                new Date(),
                false,
                true,
                true,
                false
            )
        },
        ['foo']
    ),
    isSaving: false,
    editorKey: '',
    updateCurrentDoc: () => {},
    newDoc: () => {},
    openDoc: (_: string) => {},
    closeCurrentDoc: () => {},
    removeDoc: (_: string) => {},
    updateDoc: (doc: Doc) => {},
    updateDocName: (_: string, __: string) => {},
    setEditorMode: (_?: EditorMode) => {},
    isPermalinkDuplicate: () => Promise.resolve(true),
    publishDoc: (_: Doc) => {}
});

const UPDATE_DOC_REPO = gql`
    mutation UpdateDocRepo($docRepoMutation: DocRepoMutation) {
        updateDocRepo(docRepoMutation: $docRepoMutation)
    }
`;

const IS_PERMALINK_DUPLICATE = gql`
    mutation isPermalinkDuplicate($docId: String, $permalink: String) {
        isPermalinkDuplicate(docId: $docId, permalink: $permalink)
    }
`;

const PUBLISH_DOC = gql`
    mutation publishDoc($doc: DocMutation) {
        publishDoc(doc: $doc)
    }
`;

export const EditorProvider = React.memo((props: IEditorProviderProps) => {
    const { docRepo: initialDocRepo, defaultDoc, children } = props;

    const [uiState, setUIState] = useState<IEditorProviderUIState>({
        isSaving: false,
        editorKey: uuidv4()
    });

    const [docState, setDocState] = useState<IEditorProviderDocState>({
        docRepo: initialDocRepo,
        unchangedDocRepo: initialDocRepo.clone()
    });

    const [docAccess] = useState<IDocAccess | undefined>(undefined);

    const [renderedContent, setRenderedContent] = useState<string | undefined>(
        undefined
    );

    const [docStatistics, setStatistics] = useState<IDocStatistics | undefined>(
        undefined
    );

    const [editorMode, setEditorMode] = useState<EditorMode | undefined>(
        undefined
    );

    const { isSaving, editorKey } = uiState;
    const { docRepo, unchangedDocRepo } = docState;

    useEffect(() => {
        getRenderedContent();
    }, [docRepo.currentDoc && docRepo.currentDoc.content]);

    const getRenderedContent = async () => {
        if (docRepo.currentDoc) {
            const content = await docRepo.currentDoc.renderContent();
            setRenderedContent(content);
            setStatistics(getDocStatistics(content));
        }
    };

    const updateDocRepoMutation = useMutation(UPDATE_DOC_REPO);
    const isPermalinkDuplicateMutation = useMutation(IS_PERMALINK_DUPLICATE);
    const publishDocMutation = useMutation(PUBLISH_DOC);

    const saveDocRepo = () => {
        setUIState({
            ...uiState,
            isSaving: true
        });

        const docRepoMutation = deriveDocRepoMutation(
            docRepo,
            unchangedDocRepo
        );
        // there is a change
        if (
            docRepoMutation.newDocs.length > 0 ||
            docRepoMutation.updatedDocs.length > 0 ||
            docRepoMutation.deletedDocIds.length > 0
        ) {
            updateDocRepoMutation({
                variables: { docRepoMutation }
            }).then(() => {
                setDocState({
                    ...docState,
                    unchangedDocRepo: docRepo.clone()
                });

                setTimeout(() => {
                    setUIState({
                        ...uiState,
                        isSaving: false
                    });
                }, 500);
            });
        }
    };

    const debouncedSaveDocRepo = () => debounce(saveDocRepo, 1500)();

    const updateCurrentDoc = (value: string) => {
        if (docRepo.currentDoc) {
            docRepo.currentDoc.content = value;
            docRepo.updateDoc(docRepo.currentDoc);

            setDocState({
                ...docState,
                docRepo
            });

            debouncedSaveDocRepo();
        }
    };

    const newDoc = () => {
        docRepo.newDoc(defaultDoc);
        setUIState({
            ...uiState,
            editorKey: uuidv4()
        });

        setDocState({
            ...docState,
            docRepo
        });

        saveDocRepo();
    };

    const openDoc = (id: string) => {
        docRepo.openDoc(id);
        setUIState({
            ...uiState,
            editorKey: uuidv4()
        });

        setDocState({
            ...docState,
            docRepo
        });

        saveDocRepo();
    };

    const closeCurrentDoc = () => {
        docRepo.currentDocId = undefined;

        setUIState({
            ...uiState,
            editorKey: uuidv4()
        });

        setDocState({
            ...docState,
            docRepo
        });

        saveDocRepo();
    };

    const removeDoc = (id: string) => {
        docRepo.removeDoc(id);
        setUIState({
            ...uiState,
            editorKey: uuidv4()
        });

        setDocState({
            ...docState,
            docRepo
        });

        saveDocRepo();
    };

    const updateDocName = (id: string, newDocName: string) => {
        docRepo.updateDocName(docRepo.docs[id], newDocName);
        setUIState({
            ...uiState,
            editorKey: uuidv4()
        });

        setDocState({
            ...docState,
            docRepo
        });

        saveDocRepo();
    };

    const updateDoc = (doc: Doc) => {
        docRepo.docs[doc.id] = doc;
        setUIState({
            ...uiState,
            editorKey: uuidv4()
        });

        setDocState({
            ...docState,
            docRepo
        });

        saveDocRepo();
    };

    const isPermalinkDuplicate = async (
        docId: string,
        permalink: string
    ): Promise<boolean> => {
        const response = await isPermalinkDuplicateMutation({
            variables: { docId, permalink }
        });

        return response.data.isPermalinkDuplicate as boolean;
    };

    const publishDoc = async (doc: Doc) => {
        await publishDocMutation({
            variables: {
                doc: {
                    id: doc.id,
                    docName: doc.docName,
                    content: doc.content,
                    lastModified: doc.lastModified,
                    published: doc.published,
                    removed: doc.removed,
                    generatePdf: doc.generatePdf,
                    generateWord: doc.generateWord,
                    protectDoc: doc.protectDoc,
                    secretPhrase: doc.secretPhrase,
                    protectWholeDoc: doc.protectWholeDoc
                }
            }
        });
    };

    return (
        <EditorContext.Provider
            value={{
                docRepo,
                isSaving,
                editorKey,
                docAccess,
                renderedContent,
                editorMode,
                updateCurrentDoc,
                newDoc,
                openDoc,
                closeCurrentDoc,
                removeDoc,
                updateDocName,
                updateDoc,
                statistics: docStatistics,
                setEditorMode,
                isPermalinkDuplicate,
                publishDoc
            }}
        >
            {children}
        </EditorContext.Provider>
    );
});
