import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
    faFolder,
    faShare,
    faSync,
    faUserSecret
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React, { useContext } from 'react';
import { AuthContext } from '../../../context-providers/auth-provider';
import { EditorContext } from '../../../context-providers/editor-provider';
import { MenuContext } from '../../../context-providers/menu-provider';
import { UserType } from '../../../types';
import './toolbar.scss';

library.add(faFolder, faShare, faUserSecret, faSync, fab);

export enum Menu {
    File = 'File',
    Share = 'Share',
    UserProfile = 'UserProfile'
}

export interface IToolbarProps {
    lostFocus: boolean;
    onMenuToggle: (menu: Menu) => void;
}

export const Toolbar = (props: IToolbarProps) => {
    const { currentUser } = useContext(AuthContext);
    const { updateCurrentDocName, docRepo } = useContext(EditorContext);
    const { activeMenu, setActiveMenu } = useContext(MenuContext);

    const calculateDocNameWidth = (docName: string): number => {
        return docName.length * 12 + 10;
    };

    const getInputStyle = (docName: string): React.CSSProperties => {
        const docNameWidth = calculateDocNameWidth(docName);

        return docNameWidth > 100
            ? {
                  width: calculateDocNameWidth(docName) + 'px'
              }
            : {};
    };

    return (
        <div className="toolbar-extra">
            <div className="filename">
                <input
                    style={getInputStyle(docRepo.currentDoc.docName)}
                    type="text"
                    value={docRepo.currentDoc.docName}
                    className={classnames({
                        error: docRepo.currentDoc.docName.length === 0
                    })}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateCurrentDocName(e.target.value);
                    }}
                    placeholder="Enter title"
                    maxLength={15}
                />
            </div>
            <ul>
                <li>
                    <a
                        href={`http://localhost:3000/preview/${
                            docRepo.currentDoc.id
                        }`}
                        target="_blank"
                    >
                        <i>
                            <FontAwesomeIcon icon={['fab', 'firefox']} />
                        </i>
                    </a>
                </li>

                <li onClick={() => setActiveMenu(Menu.File)}>
                    <i
                        className={classnames({
                            active: activeMenu === Menu.File
                        })}
                    >
                        <FontAwesomeIcon icon="folder" />
                    </i>
                </li>
                <li onClick={() => setActiveMenu(Menu.Share)}>
                    <i
                        className={classnames({
                            active: activeMenu === Menu.Share
                        })}
                    >
                        <FontAwesomeIcon icon="share" />
                    </i>
                </li>
                <li onClick={() => setActiveMenu(Menu.UserProfile)}>
                    <i
                        className={classnames({
                            active: activeMenu === Menu.UserProfile
                        })}
                    >
                        {currentUser &&
                        currentUser.userType === UserType.Facebook ? (
                            <FontAwesomeIcon
                                icon={['fab', 'facebook-square']}
                            />
                        ) : (
                            <FontAwesomeIcon icon="user-secret" />
                        )}
                    </i>
                </li>
            </ul>
        </div>
    );
};
