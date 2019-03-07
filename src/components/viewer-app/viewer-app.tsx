import React from 'react';
import { RouteComponentProps } from 'react-router';

export interface IViewAppProps extends RouteComponentProps<any> {}

export const ViewerApp = (props: IViewAppProps) => {
    return <div>{props.match.params.permalink}</div>;
};
