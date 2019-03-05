import React from 'react';
import './App.css';
import { AuthContext, AuthProvider } from './components/auth-provider';
import { EditorQuery } from './components/editor-query';

const App = () => {
    return (
        <AuthProvider>
            <AuthContext.Consumer>
                {({ currentUser, signInToken }) => (
                    <EditorQuery
                        currentUser={currentUser}
                        signInToken={signInToken}
                    />
                )}
            </AuthContext.Consumer>
        </AuthProvider>
    );
};

export default App;
