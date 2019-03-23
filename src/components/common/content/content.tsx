import React, { useEffect, useState } from 'react';
import { Doc } from '../../../types';
import './content.scss';

export interface IContentProps {
    doc: Doc;
}

export const Content = (props: IContentProps) => {
    const { doc } = props;
    const [markup, setMarkup] = useState<string | undefined>(undefined);

    useEffect(() => {
        renderContent();
    }, [doc.content]);

    const renderContent = async () => {
        setMarkup(await doc.renderContent());
    };

    return markup ? (
        <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: markup }}
        />
    ) : null;
};
