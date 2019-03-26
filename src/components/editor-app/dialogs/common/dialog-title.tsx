import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
library.add(faTimes);

export const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
        boxSizing: 'border-box'
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500]
    }
}))(
    (props: {
        children: React.ReactNode;
        classes: any;
        onClose: () => void;
    }) => {
        const { children, classes, onClose } = props;
        return (
            <MuiDialogTitle className={classes.root}>
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton
                        aria-label="Close"
                        className={classes.closeButton}
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={['fas', 'times']} />
                    </IconButton>
                ) : null}
            </MuiDialogTitle>
        );
    }
);
