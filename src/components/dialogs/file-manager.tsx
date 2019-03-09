import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { DialogContext } from '../dialog-provider/dialog-provider';

export interface IFileManagerProps {
    open: boolean;
    setFileManagerOpen: (open: boolean) => void;
}

export const FileManager = (props: IFileManagerProps) => {
    const { open, setFileManagerOpen } = props;
    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            onClose={() => setFileManagerOpen(false)}
            open={open}
        >
            <DialogTitle id="customized-dialog-title">Modal title</DialogTitle>
            <DialogContent>
                Cras mattis consectetur purus sit amet fermentum. Cras justo
                odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                risus, porta ac consectetur ac, vestibulum at eros. Praesent
                commodo cursus magna, vel scelerisque nisl consectetur et.
                Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                auctor. Aenean lacinia bibendum nulla sed consectetur. Praesent
                commodo cursus magna, vel scelerisque nisl consectetur et. Donec
                sed odio dui. Donec ullamcorper nulla non metus auctor
                fringilla.
            </DialogContent>
        </Dialog>
    );
};
