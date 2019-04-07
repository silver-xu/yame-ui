import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
    Button,
    Checkbox,
    CircularProgress,
    createStyles,
    Dialog,
    DialogActions,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Input,
    InputLabel,
    Radio,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Theme,
    withStyles,
    WithStyles
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context-providers/auth-provider';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { Doc } from '../../../types';
import { normalizeToUrl } from '../../../utils/string';
import { DialogContent } from './common/dialog-content';
import { DialogTitle } from './common/dialog-title';
import './publish-dialog.scss';

library.add(faCheck);

interface IError {
    hasError: boolean;
    errorMessage?: string;
}

const styles = (_: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        progress: {
            marginLeft: 20
        },
        stepperContent: {
            paddingTop: 5
        }
    });

export interface IPublishDialogProps extends WithStyles<typeof styles> {
    doc: Doc;
}

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || '';

const UnstyledPublishhDialog = React.memo((props: IPublishDialogProps) => {
    const { doc } = props;
    const { currentUser } = useContext(AuthContext);

    if (!doc || !doc.docName || !currentUser || !currentUser.userName) {
        return null;
    }

    const { isPublishDialogOpen, setPublishDialogOpen } = useContext(
        DialogContext
    );

    const baseUrl = `${REACT_APP_BASE_URL}/${normalizeToUrl(
        currentUser.userName
    )}/`;

    const [url, setUrl] = useState<string>(
        `${baseUrl}${doc && normalizeToUrl(doc.docName)}`
    );

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

    const [activeStep, setActiveStep] = useState<number>(0);

    const [isProgressing, setIsProgressing] = useState<boolean>(false);

    const [showProtectDocument, setShowProtectDocument] = useState<boolean>(
        false
    );

    useEffect(() => {
        setActiveStep(0);
    }, [doc && doc.id]);

    const handleClose = () => {
        setPublishDialogOpen(false, undefined);
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
        const nextUrl = e.currentTarget.value;
        if (nextUrl.startsWith(baseUrl)) {
            setUrl(nextUrl);
        }
    };

    const handleToggleProtectDocument = () => {
        setShowProtectDocument(!showProtectDocument);
    };

    const steps = [
        {
            label: 'Are you happy with the publish',
            jsx: (
                <>
                    <FormControl error={errors[0].hasError} fullWidth={true}>
                        <InputLabel htmlFor="component-error">URL</InputLabel>
                        <Input
                            id="component-error"
                            aria-describedby="component-error-text"
                            value={url}
                            onChange={handleURLChange}
                            fullWidth={true}
                        />
                        <FormHelperText id="component-error-text">
                            {errors[0].errorMessage}
                        </FormHelperText>
                    </FormControl>
                </>
            ),
            validate: (): boolean => {
                if (url === baseUrl) {
                    setErrors([
                        {
                            hasError: true,
                            errorMessage:
                                'A token is required after the last back slash'
                        },
                        errors[1]
                    ]);

                    return false;
                }

                return true;
            },
            nextText: 'Next',
            supressBack: true
        },
        {
            label: 'More options. ',
            jsx: (
                <>
                    <FormGroup row={true}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="generatePDF"
                                    color="primary"
                                    checked={true}
                                />
                            }
                            label="Generate Adobe PDF"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="generateWord"
                                    color="primary"
                                    checked={true}
                                />
                            }
                            label="Generate MS Word"
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="protectDocument"
                                    color="primary"
                                    onChange={handleToggleProtectDocument}
                                />
                            }
                            label="Protect document with a Secret Phrase"
                        />
                        {showProtectDocument && (
                            <FormControl fullWidth={true}>
                                <InputLabel htmlFor="component-error">
                                    Secret Phrase
                                </InputLabel>
                                <Input
                                    id="component-error"
                                    aria-describedby="component-error-text"
                                    fullWidth={true}
                                />
                                <FormHelperText id="component-error-text" />
                                <FormControlLabel
                                    control={
                                        <Radio
                                            value="protectWhole"
                                            color="primary"
                                            checked={true}
                                        />
                                    }
                                    label="Protect whole document"
                                />
                                <FormControlLabel
                                    control={
                                        <Radio
                                            value="protectSections"
                                            color="primary"
                                        />
                                    }
                                    label="Protect sections of document"
                                />
                            </FormControl>
                        )}
                    </FormGroup>
                </>
            ),
            validate: (): boolean => true,
            nextText: 'Publish',
            supressBack: false
        },
        {
            label: 'All set, Document published.',
            jsx: (
                <FormControl error={errors[0].hasError} fullWidth={true}>
                    <InputLabel htmlFor="component-error">URL</InputLabel>
                    <Input
                        id="component-error"
                        aria-describedby="component-error-text"
                        value={url}
                        onChange={handleURLChange}
                        fullWidth={true}
                    />
                    <FormHelperText id="component-error-text">
                        {errors[0].errorMessage}
                    </FormHelperText>
                </FormControl>
            ),
            validate: (): boolean => true,
            nextText: 'Complete',
            supressBack: true
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
                                        color="primary"
                                        className={props.classes.progress}
                                        size={20}
                                    />
                                )}
                            </StepLabel>
                            <StepContent
                                className={props.classes.stepperContent}
                            >
                                {step.jsx}
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>
            <DialogActions>
                {activeStep !== 0 && !steps[activeStep].supressBack && (
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
                    {steps[activeStep].nextText}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export const PublishDialog = withStyles(styles)(UnstyledPublishhDialog);
