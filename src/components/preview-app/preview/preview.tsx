import React, { useContext } from 'react';
import { AuthContext } from '../../../context-providers/auth-provider';
import '../../../styles/render.scss';
import { Doc } from '../../../types';
export interface IPreviewProps {
    doc: Doc;
}

export const Preview = (props: IPreviewProps) => {
    const { doc } = props;
    const createMarkup = () => {
        return { __html: doc.renderedContent };
    };

    return <div dangerouslySetInnerHTML={createMarkup()} />;
};
