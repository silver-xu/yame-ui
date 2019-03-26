import MuiDialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';

export const DialogContent = withStyles(theme => ({
    root: {
        padding: 15,
        minHeight: 300
    }
}))((props: { children: React.ReactNode; classes: any }) => {
    const { children, classes } = props;

    return (
        <MuiDialogContent className={classes.root}>{children}</MuiDialogContent>
    );
});
