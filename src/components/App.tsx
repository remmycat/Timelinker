import React, { useState, useCallback, useMemo } from 'react';
import useTransformers, { Transform } from '../hooks/useTransformers';
import usePresetState, { Preset as PresetType } from './presets/PresetState';
import useSidebarState, { SidebarState } from './sidebar/SidebarState';
import { PlusCircle, Grid } from 'react-feather';
import useColumnState from './columns/ColumnState';
import useDomListener from '../hooks/useDomListener';
import useDragEnd from '../hooks/useDragEnd';
import styles from './App.module.scss';
import Col from './columns/Column';
import Preset from './presets/Preset';
import PresetList from './presets/PresetList';
import ColumnLayout from './columns/ColumnLayout';
import BrowserView from './BrowserView';
import Sidebar from './sidebar/Sidebar';
import SidebarPanel from './sidebar/SidebarPanel';
import SidebarIcon from './sidebar/SidebarIcon';
import ColumnControls from './columns/ColumnControls';

type WebviewState = {
    [id: string]: HTMLWebViewElement | undefined;
};

const WebviewTransformers = {
    addWebview(id: string, webview: HTMLWebViewElement): Transform<WebviewState> {
        return state => ({
            ...state,
            [id]: webview,
        });
    },
};

export default function App() {
    const [fullscreen, setFullscreen] = useState<string | undefined>(undefined);
    const [columns, columnDis, columnsRef] = useColumnState();
    const [presets, presetDis] = usePresetState();
    const [mode, sidebarActions] = useSidebarState(columns.length);
    const [webviews, { addWebview }] = useTransformers(WebviewTransformers, {} as WebviewState);
    const desktopUserAgent = useMemo(() => navigator.userAgent, []);

    const setupMode = mode === SidebarState.setupColumn;
    const controlMode = mode === SidebarState.control;

    const onColumnDrag = useDragEnd(columnDis.moveColumn);
    const onPresetDrag = useDragEnd(presetDis.movePreset);

    const openPreset = useCallback((preset: PresetType) => {
        columnDis.addColumn(preset);
        sidebarActions.closeSetup();
    }, []);

    const addPresetAndOpen = useCallback((url: string) => {
        presetDis.addUserPreset(url, openPreset);
    }, []);

    useDomListener(document, 'keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape') sidebarActions.resetSidebarState();
    });

    const renderControls = useCallback(
        (id: string) => (
            <ColumnControls
                webview={webviews[id]}
                id={id}
                column={columns.find(c => c.id === id)!}
                columnDispatchers={columnDis}
                presetDispatchers={presetDis}
                setFullscreen={setFullscreen}
                desktopUserAgent={desktopUserAgent}
            />
        ),
        [webviews, columnDis, presetDis, setFullscreen, columns]
    );

    return (
        <div className={styles.layout}>
            <Sidebar panelOpen={setupMode}>
                <SidebarPanel
                    visible={setupMode}
                    onClose={columns.length === 0 ? undefined : sidebarActions.toggleSetup}>
                    <PresetList id="sidebar" addPreset={addPresetAndOpen} onDragEnd={onPresetDrag}>
                        {presets.map((preset, index) => (
                            <Preset
                                key={preset.id}
                                preset={preset}
                                index={index}
                                onRemove={presetDis.removePreset}
                                onClick={openPreset}
                            />
                        ))}
                    </PresetList>
                </SidebarPanel>
                <SidebarIcon onClick={sidebarActions.toggleSetup} active={setupMode}>
                    <PlusCircle />
                </SidebarIcon>
                <SidebarIcon onClick={sidebarActions.toggleArrangement} active={controlMode}>
                    <Grid />
                </SidebarIcon>
            </Sidebar>
            <ColumnLayout id="mainContainer" onDragEnd={onColumnDrag}>
                {columns
                    .filter(column => !fullscreen || column.id === fullscreen)
                    .map((column, index) => (
                        <Col
                            key={column.id}
                            controlMode={controlMode}
                            id={column.id}
                            index={index}
                            renderControls={renderControls}>
                            <BrowserView
                                addWebview={addWebview}
                                mobile={column.mobileSite}
                                desktopUserAgent={desktopUserAgent}
                                url={column.url}
                                id={column.id}
                                key={column.id}
                            />
                        </Col>
                    ))}
            </ColumnLayout>
        </div>
    );
}
