import React, { useState } from 'react';
import { FileManager } from '../../components/dialogs';
import { RemoveFileAlert } from '../../components/dialogs/remove-file-alert';
import { Doc } from '../../types';

export interface IDialogContextValue {
    setFileManagerOpen: (open: boolean) => void;
    setRemoveFileAlertOpen: (open: boolean, doc?: Doc) => void;
    isFileManagerOpen: boolean;
    isRemoveFileAlertOpen: boolean;
    docToRemove?: Doc;
}

export interface IDialogProviderProps {
    children?: React.ReactNode;
}

export const DialogContext = React.createContext<IDialogContextValue>({
    setFileManagerOpen: () => {},
    isFileManagerOpen: false,
    setRemoveFileAlertOpen: () => {},
    isRemoveFileAlertOpen: false,
    docToRemove: new Doc('foo', 'bar', 'foobar', new Date())
});

export interface IRemoveFileAlertState {
    isRemoveFileAlertOpen: boolean;
    doc?: Doc;
}

export const DialogProvider = React.memo((props: IDialogProviderProps) => {
    const [isFileManagerOpen, setFileManagerOpen] = useState<boolean>(false);
    const [removeFileAlertState, setRemoveFileAlertState] = useState<
        IRemoveFileAlertState
    >({
        isRemoveFileAlertOpen: false,
        doc: new Doc('foo', 'bar', 'foobar', new Date())
    });

    const { children } = props;
    const handleSetFileManagerOpen = (open: boolean) => {
        setFileManagerOpen(open);
    };
    const handleRemoveFileAlertOpen = (open: boolean, doc?: Doc) => {
        setRemoveFileAlertState({
            isRemoveFileAlertOpen: true,
            doc
        });
    };

    return (
        <DialogContext.Provider
            value={{
                isFileManagerOpen,
                setFileManagerOpen: handleSetFileManagerOpen,
                isRemoveFileAlertOpen:
                    removeFileAlertState.isRemoveFileAlertOpen,
                setRemoveFileAlertOpen: handleRemoveFileAlertOpen,
                docToRemove: removeFileAlertState.doc
            }}
        >
            <FileManager />
            <RemoveFileAlert />
            {children}
        </DialogContext.Provider>
    );
});
