import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import {
    AuthContext,
    AuthProvider
} from '../../context-providers/auth-provider';
import MuiTheme from '../../theme';
import './editor-app.css';
import { EditorQuery } from './editor-query';

export const EditorApp = () => {
    return (
        <MuiThemeProvider theme={MuiTheme}>
            <AuthProvider>
                <AuthContext.Consumer>
                    {({ currentUser }) => (
                        <EditorQuery currentUser={currentUser} />
                    )}
                </AuthContext.Consumer>
            </AuthProvider>
        </MuiThemeProvider>
    );
};
