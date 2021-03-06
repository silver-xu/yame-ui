import { withStyles } from '@material-ui/core/styles';
import MuiTableCell, { TableCellBaseProps } from '@material-ui/core/TableCell';
import { TableCellProps } from '@material-ui/core/TableCell';
import React from 'react';

export const TableCell = withStyles(theme => ({
    root: {
        cursor: 'pointer',
        paddingTop: 15,
        paddingBottom: 15
    }
}))(
    (props: {
        children: React.ReactNode;
        classes: any;
        align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
        component?: React.ReactType<TableCellBaseProps>;
    }) => {
        const { children, classes, align, component } = props;

        return (
            <MuiTableCell
                className={classes.root}
                align={align}
                component={component}
            >
                {children}
            </MuiTableCell>
        );
    }
);
