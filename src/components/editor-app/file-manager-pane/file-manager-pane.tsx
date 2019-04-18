import { library } from '@fortawesome/fontawesome-svg-core';
import { faSafari } from '@fortawesome/free-brands-svg-icons';
import {
    faFilePdf,
    faFileWord,
    faFolderOpen,
    faSearch,
    faShareAlt,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context-providers/auth-provider';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { EditorContext } from '../../../context-providers/editor-provider';
import { NavContext } from '../../../context-providers/nav-provider';
import { sortDocsByDateDesc } from '../../../services/repo-service';
import { Doc } from '../../../types';
import { containsAllTokens } from '../../../utils/string';
import { MenuItem } from '../app-bar';
import './file-manager-pane.scss';
import { Tile } from './tiles';

library.add(
    faSearch,
    faTrashAlt,
    faFolderOpen,
    faShareAlt,
    faSafari,
    faFilePdf,
    faFileWord
);

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || '';
const BLOB_BASE_URL = process.env.REACT_APP_BLOB_BASE_URL || '';

export const FileManagerPane = React.memo(() => {
    const { docRepo, editorKey } = useContext(EditorContext);
    const { currentUser } = useContext(AuthContext);
    const { activeMenu, setActiveMenu } = useContext(NavContext);
    const { setRemoveFileAlertOpen, setPublishDialogOpen } = useContext(
        DialogContext
    );
    const [keywordValue, setKeywordValue] = useState<string>('');
    const [activeDocId, setActiveDocId] = useState<string | undefined>(
        undefined
    );

    const [docs, setDocs] = useState<Doc[]>([]);

    if (!currentUser) {
        return null;
    }

    useEffect(() => {
        filterDocs(keywordValue);
        selectFirstDoc();
    }, [activeMenu, docRepo.enumerableDocs.map(doc => doc.docName)]);

    const selectFirstDoc = () => {
        if (
            (!activeDocId || !docs.find(doc => doc.id === activeDocId)) &&
            docs.length > 0
        ) {
            setActiveDocId(docs[0].id);
        }
    };

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

    const handlePreviewClick = () => {
        if (activeDocId) {
            window.open(`${REACT_APP_BASE_URL}/preview/${activeDocId}`);
        }
    };

    const handlePdfClick = () => {
        if (activeDocId) {
            window.open(
                `${BLOB_BASE_URL}/convert/pdf/${currentUser.id}/${activeDocId}`
            );
        }
    };
    const handleWordClick = () => {
        if (activeDocId) {
            window.open(
                `${BLOB_BASE_URL}/convert/word/${currentUser.id}/${activeDocId}`
            );
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
            <div className="filemanager-toolbar" key={editorKey}>
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
                    <li onClick={handlePreviewClick}>
                        <FontAwesomeIcon icon={['fab', 'safari']} />
                    </li>
                    <li onClick={handleShareClick}>
                        <FontAwesomeIcon icon="share-alt" />
                    </li>
                    <li onClick={handlePdfClick}>
                        <FontAwesomeIcon icon="file-pdf" />
                    </li>
                    <li onClick={handleWordClick}>
                        <FontAwesomeIcon icon="file-word" />
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
