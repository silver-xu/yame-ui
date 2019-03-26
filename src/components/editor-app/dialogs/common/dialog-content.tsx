import MuiDialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';

export const DialogContent = withStyles(theme => ({
    root: {
        padding: 30,
        minHeight: 400
    }
}))((props: { children: React.ReactNode; classes: any }) => {
    const { children, classes } = props;

    return (
        <MuiDialogContent className={classes.root}>{children}</MuiDialogContent>
    );
});
