import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import MuiTheme from '../../theme';
import { AuthContext, AuthProvider } from '../auth-provider';
import { EditorQuery } from '../editor-query';
import './editor-app.css';

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
