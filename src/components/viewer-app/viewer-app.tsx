import React from 'react';
import { RouteComponentProps } from 'react-router';
import { ViewerQuery } from './viewer-query';

export interface IViewerApp extends RouteComponentProps<any> {}
export const ViewerApp = (props: IViewerApp) => {
    const { username, permalink } = props.match.params;
    return <ViewerQuery username={username} permalink={permalink} />;
};
