import React from 'react';
import { Doc, DocRepo } from '../../types';
import './file-menu.scss';
import classnames from 'classnames';

export interface IFileMenuProps {
    docRepo: DocRepo;
    onNewFileClicked: () => void;
    onFileOpenClicked: (id: string) => void;
    onFileRemoveClicked: () => void;
}

export const FileMenu = (props: IFileMenuProps) => {
    const { docRepo, onFileOpenClicked } = props;
    return (
        <div className="file-menu">
            <ul className="menu-header">
                <li onClick={props.onNewFileClicked}>
                    <i className="fa fa-plus" />
                </li>
                <li>
                    <i className="fa fa-trash-o" />
                </li>
                <li>
                    <i className="fa fa-cloud-upload" />
                </li>
                <li>
                    <i className="fa fa-download" />
                </li>
                <li>
                    <i className="fa fa-file-pdf-o" />
                </li>
                <li>
                    <i className="fa fa-file-word-o" />
                </li>
            </ul>
            <ul className="file-list">
                {docRepo.sortedDocs.map(doc => (
                    <li
                        key={doc.id}
                        className={classnames({
                            active: docRepo.currentDocId === doc.id
                        })}
                        onClick={() => onFileOpenClicked(doc.id)}
                    >
                        {docRepo.currentDocId === doc.id ? (
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
