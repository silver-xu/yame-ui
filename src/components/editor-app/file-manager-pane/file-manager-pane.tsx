import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faFolderOpen,
    faSearch,
    faShareAlt,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { EditorContext } from '../../../context-providers/editor-provider';
import { NavContext } from '../../../context-providers/nav-provider';
import { sortDocsByDateDesc } from '../../../services/repo-service';
import { Doc } from '../../../types';
import { containsAllTokens } from '../../../utils/string';
import { MenuItem } from '../app-bar';
import './file-manager-pane.scss';
import { Tile } from './tiles';

library.add(faSearch, faTrashAlt, faFolderOpen, faShareAlt);

export const FileManagerPane = React.memo(() => {
    const { docRepo, editorKey } = useContext(EditorContext);
    const { activeMenu, setActiveMenu } = useContext(NavContext);
    const { setRemoveFileAlertOpen, setPublishDialogOpen } = useContext(
        DialogContext
    );
    const [keywordValue, setKeywordValue] = useState<string>('');
    const [activeDocId, setActiveDocId] = useState<string | undefined>(
        undefined
    );

    const [docs, setDocs] = useState<Doc[]>([]);

    useEffect(() => {
        filterDocs(keywordValue);
    }, [activeMenu, docRepo.enumerableDocs.map(doc => doc.docName)]);

    const handleTileAction = (id: string) => {
        docRepo.openDoc(id);
        setActiveMenu(MenuItem.CurrentDoc);
    };

    const handleTileSelected = (id: string) => {
        setActiveDocId(id);
    };

    const handleSearchKeywordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = e.currentTarget;
        setKeywordValue(value);
        filterDocs(value);
    };

    const handleClearKeywords = () => {
        setKeywordValue('');
    };

    const handleOpenDoc = () => {
        if (activeDocId) {
            docRepo.openDoc(activeDocId);
            setActiveMenu(MenuItem.CurrentDoc);
        }
    };

    const handleRemoveDoc = () => {
        if (activeDocId) {
            setRemoveFileAlertOpen(true, docRepo.docs[activeDocId]);
        }
    };

    const handleShareClick = () => {
        if (activeDocId) {
            setPublishDialogOpen(true, docRepo.docs[activeDocId]);
        }
    };

    const filterDocs = (keyword: string) => {
        const keywords = keyword.split(' ');
        let filteredDocs: Doc[];
        switch (activeMenu) {
            case MenuItem.AvailableDocs:
                filteredDocs = sortDocsByDateDesc(docRepo.availableDocs).filter(
                    doc => containsAllTokens(doc.docName, keywords)
                );
                break;
            case MenuItem.Drafts:
                filteredDocs = sortDocsByDateDesc(docRepo.draftDocs).filter(
                    doc => containsAllTokens(doc.docName, keywords)
                );
                break;
            case MenuItem.Published:
                filteredDocs = sortDocsByDateDesc(docRepo.publishedDocs).filter(
                    doc => containsAllTokens(doc.docName, keywords)
                );
                break;
            case MenuItem.Trash:
                filteredDocs = sortDocsByDateDesc(docRepo.removedDocs).filter(
                    doc => containsAllTokens(doc.docName, keywords)
                );
                break;
            default:
                filteredDocs = sortDocsByDateDesc(docRepo.availableDocs).filter(
                    doc => containsAllTokens(doc.docName, keywords)
                );
        }
        setDocs(filteredDocs);
    };

    return (
        <>
            <div className="toolbar" key={editorKey}>
                <FontAwesomeIcon icon="search" />
                <input
                    type="text"
                    className="search-bar"
                    value={keywordValue}
                    onChange={handleSearchKeywordChange}
                />
                <ul className="extra-tools">
                    <li className="separate" onClick={handleClearKeywords}>
                        <FontAwesomeIcon icon="times" />
                    </li>
                    <li onClick={handleOpenDoc}>
                        <FontAwesomeIcon icon="folder-open" />
                    </li>
                    <li onClick={handleRemoveDoc}>
                        <FontAwesomeIcon icon="trash-alt" />
                    </li>
                    <li onClick={handleShareClick}>
                        <FontAwesomeIcon icon="share-alt" />
                    </li>
                </ul>
            </div>
            <ul className="tiles">
                {docs.map(doc => (
                    <Tile
                        key={doc.id}
                        doc={doc}
                        onTileAction={() => {
                            handleTileAction(doc.id);
                        }}
                        onTileSelected={() => {
                            handleTileSelected(doc.id);
                        }}
                        isActive={activeDocId === doc.id}
                    />
                ))}
            </ul>
        </>
    );
});
