import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, withStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import React, { useContext } from 'react';
import { DialogContext } from '../../../context-providers/dialog-provider';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './notification-bar.scss';

library.add(faTimes);

export interface INotificationBarProps {
    open: boolean;
    message: string;
    classes: any;
}

export const NotificationBar = withStyles(theme => ({
    root: {
        marginBottom: 10
    }
}))((props: INotificationBarProps) => {
    const { closeNotificationBar } = useContext(DialogContext);
    return (
        <Snackbar
            className={props.classes.root}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            onClose={closeNotificationBar}
            open={props.open}
            autoHideDuration={2000}
            message={<span id="message-id">{props.message}</span>}
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    onClick={closeNotificationBar}
                >
                    <FontAwesomeIcon
                        icon={['fas', 'times']}
                        className="icon-contrast"
                    />
                </IconButton>
            ]}
        />
    );
});
