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
import './register-user.scss';

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

export interface IRegisterUser extends WithStyles<typeof styles> {}

const UnstyledRegisterUser = React.memo((props: IRegisterUser) => {
    const [username, setUsername] = useState<string>('');
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

    const { isRegisterUserOpen, setRegisterUserOpen } = useContext(
        DialogContext
    );

    const [activeStep, setActiveStep] = useState<number>(0);

    const [isProgressing, setIsProgressing] = useState<boolean>(false);

    const handleClose = () => {
        setRegisterUserOpen(false);
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

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value);
    };

    const steps = [
        {
            label: 'Select a unique username',
            jsx: (
                <>
                    <FormControl error={errors[0].hasError}>
                        <InputLabel htmlFor="component-error">
                            Username
                        </InputLabel>
                        <Input
                            id="component-error"
                            aria-describedby="component-error-text"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <FormHelperText id="component-error-text">
                            {errors[0].errorMessage}
                        </FormHelperText>
                    </FormControl>
                </>
            ),
            validate: (): boolean => {
                if (username === '') {
                    setErrors([
                        {
                            hasError: true,
                            errorMessage:
                                'In the world of yame.io, username is requireed'
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
            open={isRegisterUserOpen}
            fullWidth={true}
            maxWidth="md"
        >
            <DialogTitle onClose={handleClose}>
                A few little things before you start...
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

export const RegisterUser = withStyles(styles)(UnstyledRegisterUser);
