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
import { UserType } from '../../types';
import { AuthContext, IAuthContextValue } from '../auth-provider';
import { EditorContext } from '../editor-provider/editor-provider';
import './toolbar.scss';
import { CSSProperties } from 'jss/css';
import { DialogContext } from '../dialog-provider/dialog-provider';
library.add(faFolder, faShare, faUserSecret, faSync, fab);

export enum Menu {
    File = 'File',
    Share = 'Share',
    UserProfile = 'UserProfile'
}

export interface IToolbarProps {
    lostFocus: boolean;
    activeMenu?: Menu;
    onMenuToggle: (menu: Menu) => void;
}

export class Toolbar extends React.Component<IToolbarProps> {
    constructor(props: IToolbarProps) {
        super(props);
    }

    public render() {
        const { activeMenu } = this.props;

        return (
            <AuthContext.Consumer>
                {({ currentUser }) => (
                    <EditorContext.Consumer>
                        {({ updateCurrentDocName, docRepo }) => (
                            <div className="toolbar-extra">
                                <div className="filename">
                                    <input
                                        style={this.getInputStyle(
                                            docRepo.currentDoc.docName
                                        )}
                                        type="text"
                                        value={docRepo.currentDoc.docName}
                                        className={classnames({
                                            error:
                                                docRepo.currentDoc.docName
                                                    .length === 0
                                        })}
                                        onKeyUp={this.handleDocNameKeyup}
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
                                                icon={['fab', 'firefox']}
                                            />
                                        </i>
                                    </li>

                                    <li
                                        onClick={() =>
                                            this.toggleMenu(Menu.File)
                                        }
                                    >
                                        <i
                                            className={classnames({
                                                active: activeMenu === Menu.File
                                            })}
                                        >
                                            <FontAwesomeIcon icon="folder" />
                                        </i>
                                    </li>
                                    <li
                                        onClick={() =>
                                            this.toggleMenu(Menu.Share)
                                        }
                                    >
                                        <i
                                            className={classnames({
                                                active:
                                                    activeMenu === Menu.Share
                                            })}
                                        >
                                            <FontAwesomeIcon icon="share" />
                                        </i>
                                    </li>
                                    <li
                                        onClick={() => {
                                            return this.toggleMenu(
                                                Menu.UserProfile
                                            );
                                        }}
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
