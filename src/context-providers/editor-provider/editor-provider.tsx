import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation, MutationFn, OperationVariables } from 'react-apollo';
import uuidv4 from 'uuid/v4';
import { deriveDocRepoMutation } from '../../services/repo-service';
import { Doc, DocRepo, IDefaultDoc } from '../../types';
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
    updateCurrentDoc: (value: string) => void;
    newDoc: () => void;
    openDoc: (id: string) => void;
    removeDoc: (id: string) => void;
    updateCurrentDocName: (newDocName: string) => void;
    publishCurrentDoc: () => void;
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
    updateCurrentDoc: () => {},
    newDoc: () => {},
    openDoc: (_: string) => {},
    removeDoc: (_: string) => {},
    updateCurrentDocName: (_: string) => {},
    publishCurrentDoc: () => {}
});

const UPDATE_DOC_REPO = gql`
    mutation UpdateDocRepo($docRepoMutation: DocRepoMutation) {
        updateDocRepo(docRepoMutation: $docRepoMutation)
    }
`;

const PUBLISH_DOC = gql`
    mutation publishDoc($docMutation: DocMutation) {
        publishDoc(docMutation: $docMutation)
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
        docRepo.removeDoc(id);
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
    ) => {
        const { id, docName, content, lastModified } = docRepo.currentDoc;
        await publishDocMutation({
            variables: {
                docMutation: {
                    id,
                    docName,
                    content,
                    lastModified
                }
            }
        });
    };

    return (
        <Mutation mutation={PUBLISH_DOC}>
            {publishDoc => (
                <Mutation mutation={UPDATE_DOC_REPO}>
                    {updateDoc => (
                        <EditorContext.Provider
                            value={{
                                docRepo,
                                isSaving,
                                editorKey,
                                updateCurrentDoc: (value: string) =>
                                    updateCurrentDoc(value, updateDoc),
                                newDoc: () => newDoc(updateDoc),
                                openDoc: (id: string) => openDoc(id),
                                removeDoc: (id: string) =>
                                    removeDoc(id, updateDoc),
                                updateCurrentDocName: (newDocName: string) =>
                                    updateCurrentDocName(newDocName, updateDoc),
                                publishCurrentDoc: () =>
                                    publishCurrentDoc(publishDoc)
                            }}
                        >
                            {children}
                        </EditorContext.Provider>
                    )}
                </Mutation>
            )}
        </Mutation>
    );
});
