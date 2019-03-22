import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation, MutationFn, OperationVariables, Query } from 'react-apollo';
import uuidv4 from 'uuid/v4';
import { deriveDocRepoMutation } from '../../services/repo-service';
import {
    Doc,
    DocRepo,
    IDefaultDoc,
    IDocAccess,
    IPublishResult
} from '../../types';
import { debounce } from '../../utils/deboune';

export interface IEditorProviderProps {
    docRepo: DocRepo;
    defaultDoc: IDefaultDoc;
    children?: React.ReactNode;
}

export interface IEditorContextValue {
    docRepo: DocRepo;
    isSaving: boolean;
    editorKey: string;
    docAccess?: IDocAccess;
    publishResult?: IPublishResult;
    setPublishResult: (publishResult: IPublishResult | undefined) => void;
    updateCurrentDoc: (value: string) => void;
    newDoc: () => void;
    openDoc: (id: string) => void;
    removeDoc: (id: string) => void;
    updateCurrentDocName: (newDocName: string) => void;
    publishCurrentDoc: () => Promise<IPublishResult>;
    updateCurrentPermalink: (permalink: string) => Promise<boolean>;
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
        { foo: new Doc('foo', 'bar', 'foobar', new Date()) },
        { foo: new Doc('foo', 'bar', 'foobar', new Date()) }
    ),
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
    updateCurrentPermalink: (_: string) => Promise.resolve(true)
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

    const [publishResult, setPublishResult] = useState<
        IPublishResult | undefined
    >(undefined);

    const { isSaving, editorKey } = uiState;
    const { docRepo, unchangedDocRepo } = docState;

    const saveDocRepo = (
        updateDocMutation: MutationFn<any, OperationVariables>
    ) => {
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
            updateDocMutation({
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

    const debouncedSaveDocRepo = (
        updateDocMutation: MutationFn<any, OperationVariables>
    ) => {
        debounce(saveDocRepo, 1500)(updateDocMutation);
    };

    const updateCurrentDoc = (
        value: string,
        updateDocMutation: MutationFn<any, OperationVariables>
    ) => {
        docRepo.currentDoc.content = value;
        docRepo.updateDoc(docRepo.currentDoc);

        setDocState({
            ...docState,
            docRepo
        });

        debouncedSaveDocRepo(updateDocMutation);
    };

    const newDoc = (updateDocMutation: MutationFn<any, OperationVariables>) => {
        docRepo.newDoc(defaultDoc);
        setUIState({
            ...uiState,
            editorKey: uuidv4()
        });

        setDocState({
            ...docState,
            docRepo
        });

        saveDocRepo(updateDocMutation);
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

    const removeDoc = (
        id: string,
        updateDocMutation: MutationFn<any, OperationVariables>
    ) => {
        docRepo.removeDoc(id, defaultDoc);
        setUIState({
            ...uiState,
            editorKey: uuidv4()
        });

        setDocState({
            ...docState,
            docRepo
        });

        saveDocRepo(updateDocMutation);
    };

    const updateCurrentDocName = (
        newDocName: string,
        updateDocMutation: MutationFn<any, OperationVariables>
    ) => {
        docRepo.updateDocName(docRepo.currentDoc, newDocName);
        setUIState({
            ...uiState,
            editorKey: uuidv4()
        });

        setDocState({
            ...docState,
            docRepo
        });

        saveDocRepo(updateDocMutation);
    };

    const publishCurrentDoc = async (
        publishDocMutation: MutationFn<any, OperationVariables>
    ): Promise<IPublishResult> => {
        const { id, docName, content, lastModified } = docRepo.currentDoc;
        return ((await publishDocMutation({
            variables: {
                docMutation: {
                    id,
                    docName,
                    content,
                    lastModified
                }
            }
        })) as any).data.publishDoc;
    };

    const updateCurrentPermalink = async (
        permalink: string,
        updatePermalinkMutation: MutationFn<any, OperationVariables>
    ): Promise<boolean> => {
        return ((await updatePermalinkMutation({
            variables: {
                id: docRepo.currentDocId,
                permalink
            }
        })) as any).data.updatePermalink;
    };

    return (
        <Query query={PUBLISH_RESULT} variables={{ id: docRepo.currentDoc.id }}>
            {({
                loading: publishResultLoading,
                error: publishResultError,
                data: publishResultData
            }) => {
                if (
                    !publishResult &&
                    !publishResultLoading &&
                    !publishResultError &&
                    publishResultData
                ) {
                    setPublishResult(publishResultData.publishResult);
                }

                return (
                    <Query
                        query={DOC_ACCESS}
                        variables={{ id: docRepo.currentDoc.id }}
                    >
                        {({
                            loading: docAccessLoading,
                            error: docAccessError,
                            data: docAccessData
                        }) => {
                            if (
                                !docAccessLoading &&
                                !docAccessError &&
                                docAccessData
                            ) {
                                setDocAccess(docAccessData.docAccess);
                            }
                            return (
                                <Mutation mutation={PUBLISH_DOC}>
                                    {publishDoc => (
                                        <Mutation mutation={UPDATE_PERMALINK}>
                                            {updatePermalink => (
                                                <Mutation
                                                    mutation={UPDATE_DOC_REPO}
                                                >
                                                    {updateDoc => (
                                                        <EditorContext.Provider
                                                            value={{
                                                                docRepo,
                                                                isSaving,
                                                                editorKey,
                                                                docAccess,
                                                                publishResult,
                                                                setPublishResult: (
                                                                    value:
                                                                        | IPublishResult
                                                                        | undefined
                                                                ) => {
                                                                    setPublishResult(
                                                                        value
                                                                    );
                                                                },
                                                                updateCurrentDoc: (
                                                                    value: string
                                                                ) =>
                                                                    updateCurrentDoc(
                                                                        value,
                                                                        updateDoc
                                                                    ),
                                                                newDoc: () =>
                                                                    newDoc(
                                                                        updateDoc
                                                                    ),
                                                                openDoc: (
                                                                    id: string
                                                                ) =>
                                                                    openDoc(id),
                                                                removeDoc: (
                                                                    id: string
                                                                ) =>
                                                                    removeDoc(
                                                                        id,
                                                                        updateDoc
                                                                    ),
                                                                updateCurrentDocName: (
                                                                    newDocName: string
                                                                ) =>
                                                                    updateCurrentDocName(
                                                                        newDocName,
                                                                        updateDoc
                                                                    ),
                                                                publishCurrentDoc: () =>
                                                                    publishCurrentDoc(
                                                                        publishDoc
                                                                    ),
                                                                updateCurrentPermalink: async (
                                                                    permalink: string
                                                                ): Promise<
                                                                    boolean
                                                                > =>
                                                                    await updateCurrentPermalink(
                                                                        permalink,
                                                                        updatePermalink
                                                                    )
                                                            }}
                                                        >
                                                            {children}
                                                        </EditorContext.Provider>
                                                    )}
                                                </Mutation>
                                            )}
                                        </Mutation>
                                    )}
                                </Mutation>
                            );
                        }}
                    </Query>
                );
            }}
        </Query>
    );
});
