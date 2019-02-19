import { library } from '@fortawesome/fontawesome-svg-core';
import { faFolder, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';
import './toolbar.scss';
library.add(faFolder, faShare);
export interface IToolbarProps {
    lostFocus: boolean;
    docname: string;
    fileMenuOpen: boolean;
    onFileMenuToggle: (fileMenuOpen: boolean) => void;
}

export class Toolbar extends React.Component<IToolbarProps> {
    constructor(props: IToolbarProps) {
        super(props);
    }

    public componentWillReceiveProps() {
        const { lostFocus } = this.props;
        this.setState({
            fileMenuOpen: !lostFocus,
            shareMenuOpen: !lostFocus
        });
    }

    public render() {
        const { docname, fileMenuOpen } = this.props;
        return (
            <div className="toolbar-extra">
                <div className="filename">
                    <input type="text" value={docname} />
                </div>
                <ul>
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

    private toggleFileMenu = () => {
        const { onFileMenuToggle, fileMenuOpen } = this.props;
        onFileMenuToggle(!fileMenuOpen);
    };
}
