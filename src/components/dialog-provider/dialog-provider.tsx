import React, { useState } from 'react';
import { FileManager } from '../dialogs';

export interface IDialogContextValue {
    setFileManagerOpen: (open: boolean) => void;
    isFileManagerOpen: boolean;
}

export interface IDialogProviderProps {
    children?: React.ReactNode;
}

export const DialogContext = React.createContext<IDialogContextValue>({
    setFileManagerOpen: () => {},
    isFileManagerOpen: false
});

export const DialogProvider = React.memo((props: IDialogProviderProps) => {
    const [isFileManagerOpen, setFileManagerOpen] = useState<boolean>(false);
    const { children } = props;
    const handleSetFileManagerOpen = (open: boolean) => {
        setFileManagerOpen(open);
    };

    return (
        <DialogContext.Provider
            value={{
                isFileManagerOpen,
                setFileManagerOpen: handleSetFileManagerOpen
            }}
        >
            <FileManager
                open={isFileManagerOpen}
                setFileManagerOpen={handleSetFileManagerOpen}
            />
            {children}
        </DialogContext.Provider>
    );
});
