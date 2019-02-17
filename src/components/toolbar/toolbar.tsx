import React from 'react';
import Menu from '../menu';
import classnames from 'classnames';
import './toolbar.scss';

export interface IToolbarProps {
    lostFocus: boolean;
    docname: string;
}

export interface IToolbarState {
    extraMenuOpen: boolean;
    shareMenuOpen: boolean;
}

export class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
    constructor(props: IToolbarProps) {
        super(props);

        this.state = {
            extraMenuOpen: false,
            shareMenuOpen: false
        };
    }

    public componentWillReceiveProps() {
        const { lostFocus } = this.props;
        this.setState({
            extraMenuOpen: !lostFocus,
            shareMenuOpen: !lostFocus
        });
    }

    public render() {
        const { extraMenuOpen } = this.state;
        const { docname } = this.props;
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
                                'fa-bars': true,
                                active: extraMenuOpen
                            })}
                            onClick={this.toggleExtraMenu}
                        />
                        <Menu
                            isMenuOpen={extraMenuOpen}
                            menuItems={[
                                {
                                    text: 'New Document',
                                    action: () => {},
                                    iconClassNames: 'fa fa-file-text'
                                },
                                {
                                    text: '-'
                                },
                                {
                                    text: 'Document 1',
                                    action: () => {}
                                },
                                {
                                    text: 'Document 2',
                                    action: () => {}
                                },
                                {
                                    text: 'Document 3',
                                    action: () => {}
                                }
                            ]}
                        />
                    </li>
                    <li>
                        <i className="fa fa-share" />
                    </li>
                </ul>
            </div>
        );
    }

    private toggleExtraMenu = () => {
        const { extraMenuOpen } = this.state;
        this.setState({ extraMenuOpen: !extraMenuOpen });
    };
}
