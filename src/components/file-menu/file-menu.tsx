import React from 'react';
import { Doc } from '../../types';
import './file-menu.scss';
import classnames from 'classnames';

export interface IFileMenuProps {
    docs: { [id: string]: Doc };
    currentDocId: string;
    onNewFileClicked: () => void;
}

const orderDocsByDateDesc = (docs: { [id: string]: Doc }): Doc[] => {
    const docsArray = Object.keys(docs).map(id => {
        return docs[id];
    });

    return docsArray.sort(
        (a: Doc, b: Doc): number => {
            debugger;
            return (
                new Date(b.lastModified).getTime() -
                new Date(a.lastModified).getTime()
            );
        }
    );
};

export const FileMenu = (props: IFileMenuProps) => {
    const { docs, currentDocId } = props;
    const orderedDocs = orderDocsByDateDesc(docs);
    return (
        <div className="file-menu">
            <ul className="menu-header">
                <li onClick={props.onNewFileClicked}>
                    <i className="fa fa-file" />
                </li>
                <li>
                    <i className="fa fa-trash-o" />
                </li>
                <li>
                    <i className="fa fa-cloud-upload" />
                </li>
            </ul>
            <ul className="file-list">
                {orderedDocs.map(doc => (
                    <li
                        className={classnames({
                            active: currentDocId === doc.id
                        })}
                    >
                        {currentDocId === doc.id ? (
                            <i className="fa fa-check" />
                        ) : (
                            <i className="placeholder" />
                        )}
                        {doc.docname}
                    </li>
                ))}
            </ul>
        </div>
    );
};
