import React from 'react';
import { Doc } from '../../../types';
import './content.scss';

export interface IContentProps {
    doc: Doc;
}

export const Content = (props: IContentProps) => {
    const { doc } = props;

    const createMarkup = () => {
        return { __html: doc.renderContent() };
    };

    return (
        <div
            className="markdown-body"
            dangerouslySetInnerHTML={createMarkup()}
        />
    );
};
