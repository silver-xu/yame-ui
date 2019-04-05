import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import React, { useContext, useState } from 'react';
import { DialogTitle } from './common/dialog-title';

import {
    Button,
    CircularProgress,
    createStyles,
    Dialog,
    DialogActions,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Input,
    InputLabel,
    Radio,
    RadioGroup,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Theme,
    withStyles,
    WithStyles
} from '@material-ui/core';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { DialogContent } from './common/dialog-content';
import './publish-dialog.scss';

library.add(faCheck);

interface IError {
    hasError: boolean;
    errorMessage?: string;
}

const styles = (theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        progress: {
            marginLeft: 20
        }
    });

export interface IPublishDialog extends WithStyles<typeof styles> {}

const UnstyledPublishhDialog = React.memo((props: IPublishDialog) => {
    const [url, setUrl] = useState<string>('http://localhost:3000/silver-xu/');
    const [errors, setErrors] = useState<IError[]>([
        {
            hasError: false,
            errorMessage: undefined
        },
        {
            hasError: false,
            errorMessage: undefined
        }
    ]);

    const { isPublishDialogOpen, setPublishDialogOpen } = useContext(
        DialogContext
    );

    const [activeStep, setActiveStep] = useState<number>(0);

    const [isProgressing, setIsProgressing] = useState<boolean>(false);

    const handleClose = () => {
        setPublishDialogOpen(false);
    };

    const handleNext = () => {
        setIsProgressing(true);
        if (steps[activeStep].validate()) {
            setIsProgressing(false);
            setActiveStep(activeStep + 1);
        } else {
            setIsProgressing(false);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (url.startsWith('http://localhost:3000/silver-xu/')) {
            setUrl(e.currentTarget.value);
        }
    };

    const steps = [
        {
            label: 'Set the URL the document is publishing to.',
            jsx: (
                <>
                    <FormControl error={errors[0].hasError}>
                        <InputLabel htmlFor="component-error">URL</InputLabel>
                        <Input
                            id="component-error"
                            aria-describedby="component-error-text"
                            value={url}
                            onChange={handleURLChange}
                        />
                        <FormHelperText id="component-error-text">
                            {errors[0].errorMessage}
                        </FormHelperText>
                    </FormControl>
                </>
            ),
            validate: (): boolean => {
                if (url === '') {
                    setErrors([
                        {
                            hasError: true,
                            errorMessage:
                                'In the world of yame.io, username is required'
                        },
                        errors[1]
                    ]);

                    return false;
                }

                return true;
            }
        },
        {
            label: 'Move document to your cloud account?',
            jsx: (
                <>
                    <FormControl>
                        <RadioGroup
                            aria-label="Gender"
                            name="gender1"
                            value="yes"
                        >
                            <FormControlLabel
                                value="yes"
                                control={<Radio />}
                                label="Yep, my local documents will be removed after merge"
                            />
                            <FormControlLabel
                                value="no"
                                control={<Radio />}
                                label="Mehh, I have second thoughts"
                            />
                        </RadioGroup>
                    </FormControl>
                </>
            ),
            validate: (): boolean => true
        }
    ];

    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            onClose={handleClose}
            open={isPublishDialogOpen}
            fullWidth={true}
            maxWidth="md"
        >
            <DialogTitle onClose={handleClose}>
                A few little things before you publish...
            </DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, idx) => (
                        <Step key={idx}>
                            <StepLabel>
                                {step.label}
                                {idx === activeStep && isProgressing && (
                                    <CircularProgress
                                        color="secondary"
                                        className={props.classes.progress}
                                        size={20}
                                    />
                                )}
                            </StepLabel>
                            <StepContent>{step.jsx}</StepContent>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>
            <DialogActions>
                {activeStep !== 0 && (
                    <Button
                        variant="contained"
                        color="default"
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                >
                    {activeStep < steps.length - 1 ? 'Next' : 'Complete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export const PublishDialog = withStyles(styles)(UnstyledPublishhDialog);
