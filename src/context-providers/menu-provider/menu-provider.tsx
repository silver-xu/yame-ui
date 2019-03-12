import React, { useState } from 'react';
import { Menu } from '../../components/editor-app/toolbar';

export interface IMenuContextValue {
    activeMenu?: Menu;
    setActiveMenu: (menu?: Menu) => void;
    open: boolean;
    inTransition: boolean;
}

export interface IMenuProviderProps {
    children?: React.ReactNode;
}

export const MenuContext = React.createContext<IMenuContextValue>({
    setActiveMenu: () => {},
    open: false,
    inTransition: false
});

export const MenuProvider = (props: IMenuProviderProps) => {
    const { children } = props;
    const [activeMenu, setActiveMenu] = useState<Menu | undefined>(undefined);
    const [inTransition, setInTransition] = useState<boolean>(false);

    const switchMenu = (nextActiveMenu?: Menu) => {
        if (activeMenu === nextActiveMenu) {
            setActiveMenu(undefined);
        } else if (activeMenu) {
            setInTransition(true);
            setActiveMenu(undefined);
            setTimeout(() => {
                setActiveMenu(nextActiveMenu);
                setInTransition(false);
            }, 300);
        } else {
            setActiveMenu(nextActiveMenu);
        }
    };

    return (
        <MenuContext.Provider
            value={{
                activeMenu,
                setActiveMenu: switchMenu,
                open: activeMenu !== undefined,
                inTransition
            }}
        >
            {children}
        </MenuContext.Provider>
    );
};
