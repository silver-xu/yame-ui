import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faFolderOpen,
    faSearch,
    faShareAlt,
    faTimes,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
    ReactEventHandler,
    useContext,
    useEffect,
    useState
} from 'react';
import { EditorContext } from '../../../context-providers/editor-provider';
import { NavContext } from '../../../context-providers/nav-provider';
import { sortDocsByDateDesc } from '../../../services/repo-service';
import { Doc } from '../../../types';
import { containsTokens } from '../../../utils/string';
import { MenuItem } from '../app-bar';
import './file-manager-pane.scss';
import { Tile } from './tiles';

library.add(faSearch, faTrashAlt, faFolderOpen, faShareAlt);

export const FileManagerPane = React.memo(() => {
    const { docRepo } = useContext(EditorContext);
    const { activeMenu, setActiveMenu } = useContext(NavContext);

    const [activeDocId, setActiveDocId] = useState<string | undefined>(
        undefined
    );

    const [docs, setDocs] = useState<Doc[]>([]);

    useEffect(() => {
        filterDocs('');
    }, []);

    const handleTileAction = (id: string) => {
        docRepo.openDoc(id);
        setActiveMenu(MenuItem.Doc);
    };

    const handleTileSelected = (id: string) => {
        setActiveDocId(id);
    };

    const handleSearchKeywordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        filterDocs(e.currentTarget.value);
    };

    const filterDocs = (keyword: string) => {
        const keywords = keyword.split(' ');
        switch (activeMenu) {
            case MenuItem.AllDoc:
                setDocs(
                    sortDocsByDateDesc(docRepo.availableDocs).filter(doc =>
                        containsTokens(doc.docName, keywords)
                    )
                );
            case MenuItem.Drafts:
                setDocs(
                    sortDocsByDateDesc(docRepo.draftDocs).filter(doc =>
                        containsTokens(doc.docName, keywords)
                    )
                );
            case MenuItem.Published:
                setDocs(
                    sortDocsByDateDesc(docRepo.publishedDocs).filter(doc =>
                        containsTokens(doc.docName, keywords)
                    )
                );
            case MenuItem.Trash:
                setDocs(
                    sortDocsByDateDesc(docRepo.removedDocs).filter(doc =>
                        containsTokens(doc.docName, keywords)
                    )
                );
            default:
                setDocs(
                    sortDocsByDateDesc(docRepo.availableDocs).filter(doc =>
                        containsTokens(doc.docName, keywords)
                    )
                );
        }
    };

    return (
        <>
            <div className="toolbar">
                <FontAwesomeIcon icon="search" />
                <input
                    type="text"
                    className="search-bar"
                    onChange={handleSearchKeywordChange}
                />
                <ul className="extra-tools">
                    <li className="separate">
                        <FontAwesomeIcon icon="times" />
                    </li>
                    <li>
                        <FontAwesomeIcon icon="folder-open" />
                    </li>
                    <li>
                        <FontAwesomeIcon icon="trash-alt" />
                    </li>
                    <li>
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
