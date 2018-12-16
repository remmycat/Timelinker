import React, { useCallback, memo } from 'react';
import styles from './Sidebar.module.scss';
import classnames from 'classnames';
import { SidebarState } from './SidebarState';
import SidebarPanel from './SidebarPanel';
import { Preset, PresetState } from '../presets/PresetState';
import PresetList from '../presets/PresetList';
import SidebarIcon from './SidebarIcon';
import { PlusCircle, Grid } from 'react-feather';
import useDomListener from '../../hooks/useDomListener';
import { useDispatchers } from '../AppState';

type Props = {
    state: SidebarState;
    presets: PresetState;
    noColumns: boolean;
};

export default memo(function SettingsSidebar({ noColumns, state, presets }: Props) {
    const Dispatchers = useDispatchers();
    const { addColumn } = Dispatchers.Column;
    const { closeSetup, toggleArrangement, toggleSetup, resetSidebarState } = Dispatchers.Sidebar;

    useDomListener(document, 'keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape') resetSidebarState();
    });

    const onPresetOpen = useCallback(
        (preset: Preset) => {
            addColumn(preset);
            closeSetup();
        },
        [addColumn, closeSetup]
    );

    const wrapClasses = classnames(styles.wrap, {
        [styles.wrap__panelOpen]: state === SidebarState.setupColumn,
    });
    return (
        <div className={wrapClasses}>
            <div className={styles.sidebar}>
                <SidebarPanel
                    visible={state === SidebarState.setupColumn}
                    onClose={noColumns ? undefined : closeSetup}>
                    <PresetList presets={presets} id="sidebar" onPresetOpen={onPresetOpen} />
                </SidebarPanel>
                <SidebarIcon onClick={toggleSetup} active={state === SidebarState.setupColumn}>
                    <PlusCircle />
                </SidebarIcon>
                <SidebarIcon onClick={toggleArrangement} active={state === SidebarState.control}>
                    <Grid />
                </SidebarIcon>
            </div>
        </div>
    );
});
