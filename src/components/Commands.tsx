import React from 'react';
import useNodeListener from '../hooks/useNodeListener';
import { SpaceEvents } from '../Injected';
import { useDispatchers } from './AppState';

export default React.memo(function Commands() {
    const { Sidebar } = useDispatchers();

    useNodeListener(SpaceEvents, 'menu__new-column', () => {
        window.focus();
        Sidebar.openSetup();
    });
    useNodeListener(SpaceEvents, 'menu__control-arrange-columns', () => {
        window.focus();
        Sidebar.openArrangement();
    });
    // useNodeListener(SpaceEvents, 'accelerator__esc', Sidebar.resetSidebarState);

    return null;
});
