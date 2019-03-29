import React, { useState } from 'react';
import { MenuItem } from '../../components/editor-app/app-bar';

export interface INavContextValue {
    activeMenu: MenuItem | undefined;
    setActiveMenu: (menuItem?: MenuItem) => void;
}

export interface INavProviderProps {
    children?: React.ReactNode;
}

export const NavContext = React.createContext<INavContextValue>({
    activeMenu: MenuItem.Doc,
    setActiveMenu: () => {}
});

export const NavProvider = React.memo((props: INavProviderProps) => {
    const [activeMenu, setActiveMenu] = useState<MenuItem | undefined>(
        undefined
    );

    return (
        <NavContext.Provider
            value={{
                activeMenu,
                setActiveMenu
            }}
        >
            {props.children}
        </NavContext.Provider>
    );
});
