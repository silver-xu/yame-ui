import React, { useContext } from 'react';
import { AuthContext } from '../../../context-providers/auth-provider';
import { Doc } from '../../../types';

export interface IPreviewProps {
    doc: Doc;
}

export const Preview = (props: IPreviewProps) => {
    const { doc } = props;
    return <div>{doc.content}</div>;
};
