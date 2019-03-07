import React from 'react';
import { AuthContext, AuthProvider } from '../auth-provider';
import { EditorQuery } from '../editor-query';
import './editor-app.css';

export const EditorApp = () => {
    return (
        <AuthProvider>
            <AuthContext.Consumer>
                {({ currentUser }) => <EditorQuery currentUser={currentUser} />}
            </AuthContext.Consumer>
        </AuthProvider>
    );
};
