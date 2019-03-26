import MuiDialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';

export const FileManagerDialogContent = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: '0',
        minHeight: 300
    }
}))((props: { children: React.ReactNode; classes: any }) => {
    const { children, classes } = props;

    return (
        <MuiDialogContent className={classes.root}>{children}</MuiDialogContent>
    );
});
