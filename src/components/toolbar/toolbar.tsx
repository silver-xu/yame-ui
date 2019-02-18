import React from 'react';
import classnames from 'classnames';
import './toolbar.scss';

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
                    <li>
                        <i
                            className={classnames({
                                fa: true,
                                'fa-folder': true,
                                active: fileMenuOpen
                            })}
                            onClick={this.toggleFileMenu}
                        />
                    </li>
                    <li>
                        <i className="fa fa-share" />
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
