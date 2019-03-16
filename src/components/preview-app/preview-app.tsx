import React from 'react';
import { RouteComponentProps } from 'react-router';
import {
    AuthContext,
    AuthProvider
} from '../../context-providers/auth-provider';
import { Preview } from './preview';
import { PreviewQuery } from './preview-query';

export interface IPreviewAppProps extends RouteComponentProps<any> {}
export const PreviewApp = (props: IPreviewAppProps) => {
    const { docId } = props.match.params;
    return (
        <AuthProvider>
            <AuthContext.Consumer>
                {({ currentUser }) => (
                    <PreviewQuery currentUser={currentUser} docId={docId} />
                )}
            </AuthContext.Consumer>
        </AuthProvider>
    );
};
