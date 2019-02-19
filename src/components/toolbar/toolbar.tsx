import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faFolder,
    faShare,
    faSync,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React, { ChangeEvent } from 'react';
import './toolbar.scss';
library.add(faFolder, faShare, faUser, faSync);
export interface IToolbarProps {
    lostFocus: boolean;
    docName: string;
    fileMenuOpen: boolean;
    onDocNameChange: (newName: string) => void;
    onFileMenuToggle: (fileMenuOpen: boolean) => void;
}

export interface IToolbarState {
    docName: string;
}

export class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
    constructor(props: IToolbarProps) {
        super(props);

        const { docName } = this.props;
        this.state = {
            docName
        };
    }

    public componentWillReceiveProps(nextProps: IToolbarState) {
        const { docName } = nextProps;
        this.state = {
            docName
        };
    }

    public render() {
        const { fileMenuOpen } = this.props;
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
                        placeholder="Enter name"
                    />
                </div>
                <ul>
                    <li>
                        <i>
                            <FontAwesomeIcon icon="user" />
                        </i>
                    </li>
                    <li>
                        <i>
                            <FontAwesomeIcon icon="sync" />
                        </i>
                    </li>
                    <li onClick={this.toggleFileMenu}>
                        <i
                            className={classnames({
                                active: fileMenuOpen
                            })}
                        >
                            <FontAwesomeIcon icon="folder" />
                        </i>
                    </li>
                    <li>
                        <i>
                            <FontAwesomeIcon icon="share" />
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

    private toggleFileMenu = () => {
        const { onFileMenuToggle, fileMenuOpen } = this.props;
        onFileMenuToggle(!fileMenuOpen);
    };

    private calculateDocNameWidth = (): number => {
        const { docName } = this.state;
        return docName.length * 10 + 10;
    };
}
