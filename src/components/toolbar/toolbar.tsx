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
import React from 'react';
import {
    AuthContext,
    IAuthContextValue
} from '../../context-providers/auth-provider';
import { EditorContext } from '../../context-providers/editor-provider';
import { MenuContext } from '../../context-providers/menu-provider';
import { UserType } from '../../types';
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

export class Toolbar extends React.Component<IToolbarProps> {
    constructor(props: IToolbarProps) {
        super(props);
    }

    public render() {
        return (
            <AuthContext.Consumer>
                {({ currentUser }) => (
                    <EditorContext.Consumer>
                        {({ updateCurrentDocName, docRepo }) => (
                            <MenuContext.Consumer>
                                {({ activeMenu, setActiveMenu }) => (
                                    <div className="toolbar-extra">
                                        <div className="filename">
                                            <input
                                                style={this.getInputStyle(
                                                    docRepo.currentDoc.docName
                                                )}
                                                type="text"
                                                value={
                                                    docRepo.currentDoc.docName
                                                }
                                                className={classnames({
                                                    error:
                                                        docRepo.currentDoc
                                                            .docName.length ===
                                                        0
                                                })}
                                                onKeyUp={
                                                    this.handleDocNameKeyup
                                                }
                                                onChange={(
                                                    e: React.ChangeEvent<
                                                        HTMLInputElement
                                                    >
                                                ) => {
                                                    updateCurrentDocName(
                                                        e.target.value
                                                    );
                                                }}
                                                placeholder="Enter title"
                                                maxLength={15}
                                            />
                                        </div>
                                        <ul>
                                            <li>
                                                <i>
                                                    <FontAwesomeIcon
                                                        icon={[
                                                            'fab',
                                                            'firefox'
                                                        ]}
                                                    />
                                                </i>
                                            </li>

                                            <li
                                                onClick={() =>
                                                    setActiveMenu(
                                                        activeMenu === Menu.File
                                                            ? undefined
                                                            : Menu.File
                                                    )
                                                }
                                            >
                                                <i
                                                    className={classnames({
                                                        active:
                                                            activeMenu ===
                                                            Menu.File
                                                    })}
                                                >
                                                    <FontAwesomeIcon icon="folder" />
                                                </i>
                                            </li>
                                            <li
                                                onClick={() =>
                                                    setActiveMenu(
                                                        activeMenu ===
                                                            Menu.Share
                                                            ? undefined
                                                            : Menu.Share
                                                    )
                                                }
                                            >
                                                <i
                                                    className={classnames({
                                                        active:
                                                            activeMenu ===
                                                            Menu.Share
                                                    })}
                                                >
                                                    <FontAwesomeIcon icon="share" />
                                                </i>
                                            </li>
                                            <li
                                                onClick={() =>
                                                    setActiveMenu(
                                                        activeMenu ===
                                                            Menu.UserProfile
                                                            ? undefined
                                                            : Menu.UserProfile
                                                    )
                                                }
                                            >
                                                <i
                                                    className={classnames({
                                                        active:
                                                            activeMenu ===
                                                            Menu.UserProfile
                                                    })}
                                                >
                                                    {currentUser &&
                                                    currentUser.userType ===
                                                        UserType.Facebook ? (
                                                        <FontAwesomeIcon
                                                            icon={[
                                                                'fab',
                                                                'facebook-square'
                                                            ]}
                                                        />
                                                    ) : (
                                                        <FontAwesomeIcon icon="user-secret" />
                                                    )}
                                                </i>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </MenuContext.Consumer>
                        )}
                    </EditorContext.Consumer>
                )}
            </AuthContext.Consumer>
        );
    }

    private handleDocNameKeyup = (e: any) => {
        this.setState({
            docName: e.target.value
        });
    };

    private toggleMenu = (menu: Menu) => {
        const { onMenuToggle } = this.props;
        onMenuToggle(menu);
    };

    private calculateDocNameWidth = (docName: string): number => {
        return docName.length * 12 + 10;
    };

    private getInputStyle = (docName: string): React.CSSProperties => {
        const docNameWidth = this.calculateDocNameWidth(docName);

        return docNameWidth > 100
            ? {
                  width: this.calculateDocNameWidth(docName) + 'px'
              }
            : {};
    };
}
