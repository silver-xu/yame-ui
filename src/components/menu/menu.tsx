import React from 'react';
import classnames from 'classnames';
import './menu.scss';

export interface IMenuItem {
    text: string;
    iconClassNames?: string;
    action?: () => void;
}

interface IMenuProps {
    menuItems: IMenuItem[];
    isMenuOpen: boolean;
}

const noOp = () => {};

export const Menu = (props: IMenuProps) => {
    return (
        <ul className={classnames({ menu: true, hide: !props.isMenuOpen })}>
            {props.menuItems.map(m => {
                return m.text === '-' ? (
                    <li className="separator" />
                ) : (
                    <li onClick={m.action ? m.action : noOp}>
                        <i
                            className={
                                m.iconClassNames
                                    ? m.iconClassNames
                                    : 'placeholder'
                            }
                        />
                        {m.text}
                    </li>
                );
            })}
        </ul>
    );
};
