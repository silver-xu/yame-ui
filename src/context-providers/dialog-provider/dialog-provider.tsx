import React, { useState } from 'react';
import {
    NotificationBar,
    PublishDialog,
    RemoveFileAlert
} from '../../components/editor-app/dialogs';
import { Doc } from '../../types';

export interface IDialogContextValue {
    setFileManagerOpen: (open: boolean) => void;
    setRemoveFileAlertOpen: (open: boolean, doc?: Doc) => void;
    openNotificationBar: (message: string) => void;
    closeNotificationBar: () => void;
    isFileManagerOpen: boolean;
    isRemoveFileAlertOpen: boolean;
    isPublishDialogOpen: boolean;
    setPublishDialogOpen: (open: boolean, doc?: Doc) => void;
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
    isPublishDialogOpen: false,
    openNotificationBar: () => {},
    closeNotificationBar: () => {},
    setPublishDialogOpen: () => {},
    docToRemove: new Doc('foo', 'bar', 'foobar', new Date())
});

export interface IRemoveFileAlertState {
    isRemoveFileAlertOpen: boolean;
    doc?: Doc;
}

export interface INotificationBarState {
    message: string;
    isNotificationBarOpen: boolean;
}

export interface IPublishDialogState {
    doc?: Doc;
    open: boolean;
}

export const DialogProvider = React.memo((props: IDialogProviderProps) => {
    const [isFileManagerOpen, setFileManagerOpen] = useState<boolean>(false);
    const [publishDialogState, setPublishDialogState] = useState<
        IPublishDialogState
    >({
        open: false
    });

    const [removeFileAlertState, setRemoveFileAlertState] = useState<
        IRemoveFileAlertState
    >({
        isRemoveFileAlertOpen: false,
        doc: new Doc('foo', 'bar', 'foobar', new Date())
    });

    const [notificationBarState, setNotificationBarState] = useState<
        INotificationBarState
    >({
        message: '',
        isNotificationBarOpen: false
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

    const handleOpenNotificationBar = (message: string) => {
        setNotificationBarState({
            message,
            isNotificationBarOpen: true
        });
    };

    const handleCloseNotificationBar = () => {
        setNotificationBarState({
            ...notificationBarState,
            isNotificationBarOpen: false
        });
    };

    const handleSetPublishDialogOpen = (open: boolean, doc?: Doc) => {
        setPublishDialogState({
            open,
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
                openNotificationBar: handleOpenNotificationBar,
                closeNotificationBar: handleCloseNotificationBar,
                docToRemove: removeFileAlertState.doc,
                isPublishDialogOpen: publishDialogState.open,
                setPublishDialogOpen: handleSetPublishDialogOpen
            }}
        >
            {publishDialogState.doc && (
                <PublishDialog doc={publishDialogState.doc} />
            )}
            <RemoveFileAlert />
            <NotificationBar
                message={notificationBarState.message}
                open={notificationBarState.isNotificationBarOpen}
            />
            {children}
        </DialogContext.Provider>
    );
});
