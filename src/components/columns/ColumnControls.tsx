import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
    WebContents,
    ConsoleMessageEvent,
    PageFaviconUpdatedEvent,
    NewWindowEvent,
    PageTitleUpdatedEvent,
    webContents,
} from 'electron';
import useContrastColor from '../../hooks/useContrastColor';
import { X, RefreshCw, Home, XCircle, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'react-feather';
import stopPropagation from '../../util/stopPropagation';
import ActionIcon from './ActionIcon';
import { Column, ColumnDispatchers } from './ColumnState';
import { PresetDispatchers } from '../presets/PresetState';
import useNodeListener from '../../hooks/useNodeListener';
import useDomListener from '../../hooks/useDomListener';
import styles from './Columns.module.scss';

type Props = {
    id: string;
    webview?: HTMLWebViewElement;
    columnDispatchers: ColumnDispatchers;
    column: Column;
    setFullscreen: React.Dispatch<React.SetStateAction<undefined | string>>;
    presetDispatchers: PresetDispatchers;
    desktopUserAgent: string;
};

const browser_zoomLevel = 0;
const browser_maxZoom = 9;
const browser_minZoom = -8;

const mobileUserAgent = `Mozilla/5.0 (Linux; Android 9; Pixel Build/PPR2.181005.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/196.0.0.41.95;]`;

export default function ColumnControls({
    id,
    webview,
    columnDispatchers,
    column,
    presetDispatchers,
    setFullscreen,
    desktopUserAgent,
}: Props) {
    const webContents = useMemo<WebContents | undefined>(
        () => webview && webview.getWebContents(),
        [webview]
    );

    const zoomLevel = column.zoomLevel || browser_zoomLevel;

    // Initial states are a guess, but it doesn't really matter:
    // The buttons are disabled until state is initialized anyway.
    const [isLoading, setLoading] = useState(true);
    const [canGoBack, setGoBack] = useState(false);
    const [canGoForward, setGoForward] = useState(false);
    const [title, setTitle] = useState('');
    const [themeColor, setThemeColor] = useState<string | null>(null);

    const refreshState = useCallback(
        () => {
            if (webContents) {
                setLoading(webContents.isLoading());
                setGoBack(webContents.canGoBack());
                setGoForward(webContents.canGoForward());
                setTitle(webContents.getTitle());
                webContents.setZoomLevel(zoomLevel);
            }
        },
        [webContents, zoomLevel]
    );
    useEffect(refreshState, [webContents]);

    useNodeListener<'did-start-loading'>(webContents, 'did-start-loading', () => {
        setLoading(true);
    });
    useNodeListener<'did-stop-loading'>(webContents, 'did-stop-loading', () => {
        setLoading(false);
    });
    useNodeListener<'did-navigate'>(webContents, 'did-navigate', refreshState, [refreshState]);
    useNodeListener<'did-navigate-in-page'>(webContents, 'did-navigate-in-page', refreshState, [
        refreshState,
    ]);
    useNodeListener<'did-change-theme-color'>(
        webContents,
        'did-change-theme-color',
        (_: any, color: string | null) => {
            setThemeColor(color);
        }
    );

    useDomListener<'console-message'>(webview, 'console-message', (e: ConsoleMessageEvent) => {
        if (!window.Logs[id]) window.Logs[id] = [];
        window.Logs[id]!.push([e.level, e.message]);
    });

    useDomListener(webview, 'new-window', (e: NewWindowEvent) => {
        if (window.API.openURL(e.url)) e.preventDefault();
    });

    useDomListener(webview, 'enter-html-full-screen', (e: Event) => {
        e.preventDefault();
        setFullscreen(() => id);
    });

    useDomListener(webview, 'leave-html-full-screen', (e: Event) => {
        e.preventDefault();
        setFullscreen(old => (old === id ? undefined : old));
    });

    useDomListener(
        webview,
        'page-favicon-updated',
        (e: PageFaviconUpdatedEvent) =>
            presetDispatchers.updateFavicons(column.presetId, e.favicons),
        [column.presetId]
    );

    useDomListener(webview, 'page-title-updated', (e: PageTitleUpdatedEvent) => setTitle(e.title));

    const removeColumn = useCallback(() => columnDispatchers.removeColumn(id), [id]);
    const loadHome = useCallback(() => webContents!.loadURL(column.url), [
        webContents,
        id,
        column.url,
    ]);
    const reload = useCallback(() => webContents!.reload(), [webContents]);
    const stop = useCallback(() => webContents!.stop(), [webContents]);
    const goBack = useCallback(() => webContents!.goBack(), [webContents]);
    const goForward = useCallback(() => webContents!.goForward(), [webContents]);
    const zoomIn = useCallback(
        () =>
            columnDispatchers.setZoomLevel(
                id,
                Math.min(browser_maxZoom, zoomLevel + 1),
                webContents!
            ),
        [webContents, zoomLevel]
    );
    const zoomOut = useCallback(
        () =>
            columnDispatchers.setZoomLevel(
                id,
                Math.max(browser_minZoom, zoomLevel - 1),
                webContents!
            ),
        [webContents, zoomLevel]
    );
    const resetZoom = useCallback(
        () => columnDispatchers.setZoomLevel(id, browser_zoomLevel, webContents!),
        [webContents]
    );

    const contrastColor = useContrastColor(themeColor || '#000000');
    const themeStyle = useMemo(
        () => ({
            background: themeColor || undefined,
            color: themeColor ? contrastColor : undefined,
        }),
        [themeColor]
    );

    return (
        <div className={styles.controls} style={themeStyle}>
            <header className={styles.header}>
                <span className={styles.title}>{title}</span>
                <ActionIcon onClick={removeColumn} className={styles.close}>
                    <XCircle />
                </ActionIcon>
            </header>
            <div onClick={stopPropagation} className={styles.actionRow}>
                <ActionIcon disabled={webContents ? !canGoBack : false} onClick={goBack}>
                    <ArrowLeft />
                </ActionIcon>
                <ActionIcon disabled={webContents ? !canGoForward : false} onClick={goForward}>
                    <ArrowRight />
                </ActionIcon>
                <ActionIcon disabled={!webContents} onClick={isLoading ? stop : reload}>
                    {isLoading ? <X /> : <RefreshCw />}
                </ActionIcon>
                <ActionIcon disabled={!webContents} onClick={loadHome}>
                    <Home />
                </ActionIcon>
                <ActionIcon
                    small
                    right
                    disabled={!webContents || zoomLevel >= browser_maxZoom}
                    onClick={zoomIn}>
                    <ZoomIn />
                </ActionIcon>
                <ActionIcon
                    small
                    right
                    disabled={!webContents || zoomLevel <= browser_minZoom}
                    onClick={zoomOut}>
                    <ZoomOut />
                </ActionIcon>
                <ActionIcon
                    small
                    right
                    disabled={!webContents || zoomLevel === browser_zoomLevel}
                    onClick={resetZoom}>
                    <X />
                </ActionIcon>
                {/* <ActionIcon onClick={toggleMobile}>
                    <Monitor />
                </ActionIcon> */}
            </div>
        </div>
    );
}
