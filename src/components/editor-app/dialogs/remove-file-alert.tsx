import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide
} from '@material-ui/core';
import { useContext } from 'react';
import React from 'react';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { EditorContext } from '../../../context-providers/editor-provider';

const Transition = (props: any) => {
    return <Slide direction="up" {...props} />;
};

export const RemoveFileAlert = () => {
    const {
        isRemoveFileAlertOpen,
        setRemoveFileAlertOpen,
        docToRemove
    } = useContext(DialogContext);

    const { removeDoc } = useContext(EditorContext);

    const handleCancel = () => {
        setRemoveFileAlertOpen(false);
    };

    const handleOkay = () => {
        if (docToRemove) {
            removeDoc(docToRemove.id);
            setRemoveFileAlertOpen(false);
        }
    };

    return docToRemove ? (
        <div>
            <Dialog
                open={isRemoveFileAlertOpen}
                TransitionComponent={Transition}
                keepMounted={true}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    Remove this documet?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {`"${
                            docToRemove.docName
                        }" will be unrecoverable after it's
                        been removed. Would you like to continue?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleOkay} color="primary">
                        Okay
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    ) : null;
};
