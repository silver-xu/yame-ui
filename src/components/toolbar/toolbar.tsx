import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
    faFolder,
    faShare,
    faSync,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';
import './toolbar.scss';
library.add(faFolder, faShare, faUser, faSync, fab);

export enum Menu {
    File = 'File',
    Share = 'Share',
    UserProfile = 'UserProfile'
}

export interface IToolbarProps {
    lostFocus: boolean;
    docName: string;
    activeMenu?: Menu;
    onDocNameChange: (newName: string) => void;
    onMenuToggle: (menu: Menu) => void;
}

export interface IToolbarState {
    docName: string;
}

export class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
    private menus: Menu[];

    constructor(props: IToolbarProps) {
        super(props);

        const { docName } = this.props;
        this.state = {
            docName
        };
        this.menus = [Menu.File, Menu.Share, Menu.UserProfile];
    }

    public componentWillReceiveProps(nextProps: IToolbarState) {
        const { docName } = nextProps;
        this.setState({
            docName
        });
    }

    public render() {
        const { activeMenu } = this.props;
        const { docName } = this.state;
        const docNameWidth = this.calculateDocNameWidth();

        const inputStyle =
            docNameWidth > 100
                ? {
                      width: this.calculateDocNameWidth() + 'px'
                  }
                : {};

        return (
            <div className="toolbar-extra">
                <div className="filename">
                    <input
                        style={inputStyle}
                        type="text"
                        value={docName}
                        className={classnames({ error: docName.length === 0 })}
                        onKeyUp={this.handleDocNameKeyup}
                        onChange={this.handleDocNameChange}
                        placeholder="Enter title"
                        maxLength={15}
                    />
                </div>
                <ul>
                    <li>
                        <i>
                            <FontAwesomeIcon icon={['fab', 'firefox']} />
                        </i>
                    </li>

                    <li
                        onClick={() => {
                            return this.toggleMenu(Menu.File);
                        }}
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
                        onClick={() => {
                            return this.toggleMenu(Menu.Share);
                        }}
                    >
                        <i
                            className={classnames({
                                active: activeMenu === Menu.Share
                            })}
                        >
                            <FontAwesomeIcon icon="share" />
                        </i>
                    </li>
                    <li
                        onClick={() => {
                            return this.toggleMenu(Menu.UserProfile);
                        }}
                    >
                        <i
                            className={classnames({
                                active: activeMenu === Menu.UserProfile
                            })}
                        >
                            <FontAwesomeIcon icon="user" />
                        </i>
                    </li>
                </ul>
            </div>
        );
    }

    private handleDocNameKeyup = (e: any) => {
        this.setState({
            docName: e.target.value
        });
    };

    private handleDocNameChange = (e: any) => {
        const { onDocNameChange } = this.props;
        onDocNameChange(e.target.value);
    };

    private toggleMenu = (menu: Menu) => {
        const { onMenuToggle } = this.props;
        onMenuToggle(menu);
    };

    private calculateDocNameWidth = (): number => {
        const { docName } = this.state;
        return docName.length * 12 + 10;
    };
}