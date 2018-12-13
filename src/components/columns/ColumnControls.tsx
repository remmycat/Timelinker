import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { WebContents } from 'electron'; // eslint-disable-line
import useContrastColor from '../../hooks/useContrastColor';
import { X, RefreshCw, Home, Trash, ArrowLeft, ArrowRight } from 'react-feather';
import stopPropagation from '../../util/stopPropagation';
import ActionIcon from './ActionIcon';
import { ColumnState, ColumnDispatchers } from './ColumnState'; // eslint-disable-line
import { PresetDispatchers } from '../presets/PresetState'; // eslint-disable-line
import useNodeListener from '../../hooks/useNodeListener';
import useDomListener from '../../hooks/useDomListener';
import styles from './Columns.module.scss';

type Props = {
    id: string;
    webview?: HTMLWebViewElement;
    columnDispatchers: ColumnDispatchers;
    columns: React.MutableRefObject<ColumnState>;
    setFullscreen: React.Dispatch<React.SetStateAction<undefined | string>>;
    presetDispatchers: PresetDispatchers;
};

interface NewWindowEvent extends UIEvent {
    readonly url: string;
}

interface FaviconChangeEvent extends UIEvent {
    readonly favicons: string[];
}

interface TitleChangeEvent extends UIEvent {
    readonly title: string;
    readonly explicitSet: boolean;
}

export default function ColumnControls({
    id,
    webview,
    columnDispatchers,
    columns,
    presetDispatchers,
    setFullscreen,
}: Props) {
    const { updateFavicons } = presetDispatchers;

    const webContents = useMemo<WebContents | undefined>(
        () => webview && (webview as any).getWebContents(),
        [webview]
    );

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
            }
        },
        [webContents]
    );

    useEffect(refreshState, [webContents]);

    useNodeListener<'did-start-loading'>(webContents, 'did-start-loading', () => {
        setLoading(true);
    });
    useNodeListener<'did-stop-loading'>(webContents, 'did-stop-loading', () => {
        setLoading(false);
    });
    useNodeListener<'did-navigate'>(webContents, 'did-navigate', refreshState);
    useNodeListener<'did-navigate-in-page'>(webContents, 'did-navigate-in-page', refreshState);
    useNodeListener<'did-change-theme-color'>(
        webContents,
        'did-change-theme-color',
        (_: any, color: string | null) => {
            setThemeColor(color);
        }
    );

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

    useDomListener(webview, 'page-favicon-updated', (e: FaviconChangeEvent) => {
        const column = columns.current.find(c => c.id === id);
        // column is expected to exist
        column && updateFavicons(column.presetId, e.favicons);
    });

    useDomListener(webview, 'page-title-updated', (e: TitleChangeEvent) => setTitle(e.title));

    const removeColumn = useCallback(() => columnDispatchers.removeColumn(id), [id]);

    const loadHome = useCallback(
        () => {
            const column = columns.current.find(c => c.id === id);
            // column is expected to exist
            if (column && column.url) webContents!.loadURL(column.url);
        },
        [webContents, id]
    );

    const reload = useCallback(() => webContents!.reload(), [webContents]);
    const stop = useCallback(() => webContents!.stop(), [webContents]);
    const goBack = useCallback(() => webContents!.goBack(), [webContents]);
    const goForward = useCallback(() => webContents!.goForward(), [webContents]);

    const themeStyle = useMemo(
        () => ({
            background: themeColor || undefined,
            color: themeColor ? useContrastColor(themeColor) : undefined,
        }),
        [themeColor]
    );

    return (
        <div className={styles.controls} style={themeStyle}>
            <header className={styles.header}>
                <span className={styles.title}>{title}</span>
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
                <ActionIcon right onClick={removeColumn}>
                    <Trash />
                </ActionIcon>
            </div>
        </div>
    );
}
