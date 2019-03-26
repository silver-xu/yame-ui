import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import React, { useContext, useState } from 'react';
import { DialogTitle } from './common/dialog-title';

import {
    Button,
    Dialog,
    DialogActions,
    Step,
    StepLabel,
    Stepper
} from '@material-ui/core';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { DialogContent } from './common/dialog-content';
import './file-manager.scss';

library.add(faCheck);

function getSteps() {
    return ['Select a unique username', 'Docs in anonymous workspace'];
}

export const RegisterUser = React.memo(() => {
    const { isRegisterUserOpen, setRegisterUserOpen } = useContext(
        DialogContext
    );

    const handleClose = () => {
        setRegisterUserOpen(false);
    };

    const [activeStep, setActiveStep] = useState<number | undefined>(undefined);

    const steps = getSteps();
    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            onClose={handleClose}
            open={isRegisterUserOpen}
            fullWidth={true}
            maxWidth="md"
        >
            <DialogTitle onClose={handleClose}>
                Few things before you may start...
            </DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary">
                    Next
                </Button>
            </DialogActions>
        </Dialog>
    );
});
