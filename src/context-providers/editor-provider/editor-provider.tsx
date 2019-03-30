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
    IDocStatistics,
    IPublishResult
} from '../../types';
import { debounce } from '../../utils/deboune';

export interface IEditorProviderProps {
    docRepo: DocRepo;
    defaultDoc: IDefaultDoc;
    children?: React.ReactNode;
}

export enum EditorMode {
    Editing,
    AllDoc,
    Drafts,
    Published,
    Trash
}

export interface IEditorContextValue {
    docRepo: DocRepo;
    isSaving: boolean;
    editorKey: string;
    docAccess?: IDocAccess;
    publishResult?: IPublishResult;
    renderedContent?: string;
    statistics?: IDocStatistics;
    editorMode?: EditorMode;
    setPublishResult: (publishResult?: IPublishResult) => void;
    updateCurrentDoc: (value: string) => void;
    newDoc: () => void;
    openDoc: (id: string) => void;
    removeDoc: (id: string) => void;
    updateCurrentDocName: (newDocName: string) => void;
    publishCurrentDoc: () => Promise<IPublishResult>;
    updateCurrentPermalink: (permalink: string) => Promise<boolean>;
    setEditorMode: (editorMode?: EditorMode) => void;
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
    docRepo: new DocRepo({ foo: new Doc('foo', 'bar', 'foobar', new Date()) }, [
        'foo'
    ]),
    isSaving: false,
    editorKey: '',
    setPublishResult: () => {},
    updateCurrentDoc: () => {},
    newDoc: () => {},
    openDoc: (_: string) => {},
    removeDoc: (_: string) => {},
    updateCurrentDocName: (_: string) => {},
    publishCurrentDoc: () =>
        Promise.resolve({ normalizedUsername: 'foo', permalink: 'bar' }),
    updateCurrentPermalink: (_: string) => Promise.resolve(true),
    setEditorMode: (_?: EditorMode) => {}
});

const UPDATE_DOC_REPO = gql`
    mutation UpdateDocRepo($docRepoMutation: DocRepoMutation) {
        updateDocRepo(docRepoMutation: $docRepoMutation)
    }
`;

const UPDATE_PERMALINK = gql`
    mutation UpdatePermalink($id: String, $permalink: String) {
        updatePermalink(id: $id, permalink: $permalink)
    }
`;

const PUBLISH_DOC = gql`
    mutation publishDoc($docMutation: DocMutation) {
        publishDoc(docMutation: $docMutation) {
            normalizedUsername
            permalink
        }
    }
`;

const DOC_ACCESS = gql`
    query DocAccess($id: String) {
        docAccess(id: $id) {
            id
            userId
            permalink
            generatePDF
            generateWord
            secret
            protectionMode
        }
    }
`;

const PUBLISH_RESULT = gql`
    query PublishResult($id: String) {
        publishResult(id: $id) {
            normalizedUsername
            permalink
        }
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

    const [docAccess, setDocAccess] = useState<IDocAccess | undefined>(
        undefined
    );

    const [renderedContent, setRenderedContent] = useState<string | undefined>(
        undefined
    );

    const [docStatistics, setStatistics] = useState<IDocStatistics | undefined>(
        undefined
    );

    const [editorMode, setEditorMode] = useState<EditorMode | undefined>(
        undefined
    );

    const [publishResult, setPublishResult] = useState<
        IPublishResult | undefined
    >(undefined);

    const { isSaving, editorKey } = uiState;
    const { docRepo, unchangedDocRepo } = docState;

    const { loading: _, error: __, data: publishResultData } = useQuery(
        PUBLISH_RESULT,
        {
            variables: { id: docRepo.currentDoc.id }
        }
    );

    const { loading: ___, error: ____, data: docAccessData } = useQuery(
        DOC_ACCESS,
        {
            variables: { id: docRepo.currentDoc.id }
        }
    );

    useEffect(() => {
        if (!publishResult && publishResultData) {
            setPublishResult(publishResultData.publishResult);
        }
    }, [
        docRepo.currentDoc.id,
        publishResultData && publishResultData.publishResult
            ? publishResultData.publishResult.permalink
            : undefined
    ]);

    useEffect(() => {
        if (!docAccess && docAccessData) {
            setDocAccess(docAccessData.docAccess);
        }
    }, [
        docRepo.currentDoc.id,
        docAccessData && docAccessData.docAccess
            ? docAccessData.docAccess.id
            : undefined
    ]);

    useEffect(() => {
        getRenderedContent();
    }, [docRepo.currentDoc.content]);

    const getRenderedContent = async () => {
        const content = await docRepo.currentDoc.renderContent();
        setRenderedContent(content);
        setStatistics(getDocStatistics(content));
    };

    const publishDocMutation = useMutation(PUBLISH_DOC);
    const updatePermalinkMutation = useMutation(UPDATE_PERMALINK);
    const updateDocRepoMutation = useMutation(UPDATE_DOC_REPO);

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
        docRepo.currentDoc.content = value;
        docRepo.updateDoc(docRepo.currentDoc);

        setDocState({
            ...docState,
            docRepo
        });

        debouncedSaveDocRepo();
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
    };

    const removeDoc = (id: string) => {
        docRepo.removeDoc(id, defaultDoc);
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

    const updateCurrentDocName = (newDocName: string) => {
        docRepo.updateDocName(docRepo.currentDoc, newDocName);
        setUIState({
            ...uiState,
            editorKey: uuidv4()
        });

        setDocState({
            ...docState,
            docRepo
        });

        debouncedSaveDocRepo();
    };

    const publishCurrentDoc = async (): Promise<IPublishResult> => {
        const { id, docName, content, lastModified } = docRepo.currentDoc;
        return (await publishDocMutation({
            variables: {
                docMutation: {
                    id,
                    docName,
                    content,
                    lastModified
                }
            }
        })).data.publishDoc;
    };

    const updateCurrentPermalink = async (
        permalink: string
    ): Promise<boolean> => {
        return (await updatePermalinkMutation({
            variables: {
                id: docRepo.currentDocId,
                permalink
            }
        })).data.updatePermalink;
    };

    return (
        <EditorContext.Provider
            value={{
                docRepo,
                isSaving,
                editorKey,
                docAccess,
                publishResult,
                renderedContent,
                editorMode,
                setPublishResult,
                updateCurrentDoc,
                newDoc,
                openDoc,
                removeDoc,
                updateCurrentDocName,
                publishCurrentDoc,
                updateCurrentPermalink,
                statistics: docStatistics,
                setEditorMode
            }}
        >
            {children}
        </EditorContext.Provider>
    );
});
