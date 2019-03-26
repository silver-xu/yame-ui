import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import React, { useContext } from 'react';
import { DialogContent } from './common/dialog-content';
import { DialogTitle } from './common/dialog-title';

import { Button, Dialog, DialogActions } from '@material-ui/core';
import { DialogContext } from '../../../context-providers/dialog-provider';
import './file-manager.scss';

library.add(faCheck);

export const FileManager = React.memo(() => {
    const { isRegisterUserOpen, setRegisterUserOpen } = useContext(
        DialogContext
    );

    const handleClose = () => {
        setRegisterUserOpen(false);
    };

    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            onClose={() => handleClose}
            open={isRegisterUserOpen}
            fullWidth={true}
        >
            <DialogTitle onClose={handleClose}>
                Few things before you begin
            </DialogTitle>
            <DialogContent>Content Placeholder</DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary">
                    Next
                </Button>
            </DialogActions>
        </Dialog>
    );
});
