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
    RadioGroup,
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
import { EditorContext } from '../../../context-providers/editor-provider';
import { Doc } from '../../../types';
import { normalizeToUrl } from '../../../utils/string';
import { DialogContent } from './common/dialog-content';
import { DialogTitle } from './common/dialog-title';
import './publish-dialog.scss';

library.add(faCheck);

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || '';

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

const urlInputRef = React.createRef<HTMLInputElement>();

const UnstyledPublishhDialog = React.memo((props: IPublishDialogProps) => {
    const { doc } = props;
    const { currentUser } = useContext(AuthContext);

    if (!doc || !doc.docName || !currentUser || !currentUser.userName) {
        return null;
    }

    const { isPublishDialogOpen, setPublishDialogOpen } = useContext(
        DialogContext
    );

    const {
        isPermalinkDuplicate,
        updateDoc,
        publishDoc,
        changeDoc
    } = useContext(EditorContext);

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

    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        setActiveStep(0);
    }, [doc && doc.id]);

    const handleClose = () => {
        setPublishDialogOpen(false, undefined);
    };

    const handleNext = async () => {
        setIsProgressing(true);

        if (await steps[activeStep].validate()) {
            await steps[activeStep].do();
            setIsProgressing(false);

            if (activeStep < steps.length - 1) {
                setActiveStep(activeStep + 1);
            } else {
                setPublishDialogOpen(false);
            }
        } else {
            setIsProgressing(false);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextUrl = e.currentTarget.value.replace(/[^\w\s\/\.:-]/gi, '');
        if (nextUrl.startsWith(baseUrl)) {
            setUrl(nextUrl);
        }
    };

    const handleToggleProtectDocument = () => {
        doc.protectDoc = !doc.protectDoc;
        setShowProtectDocument(!showProtectDocument);
    };

    const handleCopy = () => {
        const ref = urlInputRef.current;
        if (ref) {
            ref.select();
            document.execCommand('copy');
            setCopied(true);
        }
    };

    const handleGeneratePdfchange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        doc.generatePdf = e.currentTarget.checked;
        changeDoc(doc);
    };

    const handleGenerateWordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        doc.generateWord = e.currentTarget.checked;
        changeDoc(doc);
    };

    const handleSecretPhraseChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        doc.secretPhrase = e.currentTarget.value;
        changeDoc(doc);
    };

    const handleProtectWholeDocChange = (e: React.ChangeEvent<{}>) => {
        doc.protectWholeDoc = JSON.parse((e.target as any).value);
        changeDoc(doc);
    };

    const steps = [
        {
            label: 'Are you happy with the below url? ',
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
            validate: async (): Promise<boolean> => {
                if (url === baseUrl) {
                    setErrors([
                        {
                            hasError: true,
                            errorMessage:
                                'A document name is required after the last back slash'
                        },
                        errors[1]
                    ]);

                    return Promise.resolve(false);
                } else {
                    const permalink = url.replace(baseUrl, '');
                    const permalinkDuplicate = await isPermalinkDuplicate(
                        doc.id,
                        permalink
                    );

                    if (permalinkDuplicate) {
                        setErrors([
                            {
                                hasError: true,
                                errorMessage: 'Document name is not unique'
                            },
                            errors[1]
                        ]);
                    }

                    return !permalinkDuplicate;
                }
            },
            do: async () => {},
            nextText: 'Next',
            supressBack: true
        },
        {
            label: 'Advanced options, skip if you wish. ',
            jsx: (
                <>
                    <FormGroup row={true}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="generatePDF"
                                    color="primary"
                                    checked={doc.generatePdf}
                                    onChange={handleGeneratePdfchange}
                                />
                            }
                            label="Generate Adobe PDF"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="generateWord"
                                    color="primary"
                                    checked={doc.generateWord}
                                    onChange={handleGenerateWordChange}
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
                                    checked={doc.protectDoc}
                                />
                            }
                            label="Protect document with a Secret Phrase"
                        />
                        {doc.protectDoc && (
                            <FormControl
                                fullWidth={true}
                                error={errors[1].hasError}
                            >
                                <InputLabel htmlFor="component-error">
                                    Secret Phrase
                                </InputLabel>
                                <Input
                                    id="component-error"
                                    aria-describedby="component-error-text"
                                    fullWidth={true}
                                    value={doc.secretPhrase || ''}
                                    onChange={handleSecretPhraseChange}
                                />
                                <FormHelperText id="component-error-text">
                                    {errors[1].errorMessage}
                                </FormHelperText>

                                <FormControl>
                                    <RadioGroup
                                        name="protectWholeDoc"
                                        onChange={handleProtectWholeDocChange}
                                        value={(!!doc.protectWholeDoc).toString()}
                                    >
                                        <FormControlLabel
                                            value="true"
                                            control={<Radio color="primary" />}
                                            label="Protect Whole Document"
                                            labelPlacement="end"
                                        />
                                        <FormControlLabel
                                            value="false"
                                            control={<Radio color="primary" />}
                                            label="Protect Sections"
                                            labelPlacement="end"
                                        />
                                    </RadioGroup>
                                    <FormHelperText>
                                        labelPlacement start
                                    </FormHelperText>
                                </FormControl>
                            </FormControl>
                        )}
                    </FormGroup>
                </>
            ),
            validate: async (): Promise<boolean> => {
                if (doc.protectDoc) {
                    if (
                        !doc.secretPhrase ||
                        doc.secretPhrase.trim().length === 0
                    ) {
                        setErrors([
                            errors[0],
                            {
                                hasError: true,
                                errorMessage: 'Secret Phrase is required'
                            }
                        ]);

                        return Promise.resolve(false);
                    }
                }

                return Promise.resolve(true);
            },
            do: async () => {
                updateDoc(doc);
                publishDoc(doc, url.replace(baseUrl, ''));
            },
            nextText: 'Publish',
            supressBack: false
        },
        {
            label: 'All set, document published.',
            jsx: (
                <>
                    <FormControl error={errors[0].hasError} fullWidth={true}>
                        <InputLabel htmlFor="component-error">
                            Copy and Paste the below URL to share
                        </InputLabel>
                        <Input
                            id="component-error"
                            aria-describedby="component-error-text"
                            value={url}
                            fullWidth={true}
                            inputRef={urlInputRef}
                            readOnly={true}
                        />
                        <FormHelperText id="component-error-text">
                            {errors[0].errorMessage}
                        </FormHelperText>
                    </FormControl>
                    {copied && <span>The url has been copied</span>}
                </>
            ),
            validate: (): boolean => true,
            nextText: 'Complete',
            supressBack: true,
            do: async () => {}
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
                A few little things about your publish...
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
                {activeStep === steps.length - 1 && (
                    <Button
                        variant="contained"
                        color="default"
                        onClick={handleCopy}
                    >
                        Copy URL
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
