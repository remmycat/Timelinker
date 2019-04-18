import { ContextMenuParams, MenuItemConstructorOptions, WebviewTag, WebContents } from 'electron';
import { electron, env, API } from '../Injected';
import { useMemo } from 'react';

type MenuTemplate = MenuItemConstructorOptions[];

const Separator: MenuItemConstructorOptions = { type: 'separator' };

function filterUndefinedOrInvisible(
    menuItem: MenuItemConstructorOptions | undefined
): menuItem is MenuItemConstructorOptions {
    return menuItem !== undefined && menuItem.visible !== false;
}

function makeMenuTemplate(
    groupedMenuTemplate: Array<MenuItemConstructorOptions | undefined>[]
): MenuTemplate {
    return groupedMenuTemplate.reduce<MenuTemplate>((acc, group) => {
        const visible = group.filter(filterUndefinedOrInvisible);
        if (visible.length > 0 && acc.length > 0) return [...acc, Separator, ...visible];
        if (visible.length > 0) return visible;
        return acc;
    }, []);
}

export default function useContextMenuHandler(webview?: WebviewTag, webContents?: WebContents) {
    return useMemo(() => {
        if (!webview || !webContents) return () => {};
        return (
            _: any,
            {
                x,
                y,
                editFlags,
                isEditable,
                selectionText,
                mediaType,
                srcURL,
                linkURL,
                inputFieldType,
                linkText,
            }: ContextMenuParams
        ) => {
            const hasText = selectionText.trim().length > 0;
            API.openContextMenu(
                makeMenuTemplate([
                    [
                        {
                            id: 'undo',
                            label: 'Undo',
                            enabled: editFlags.canUndo,
                            visible: isEditable,
                            click: () => webContents.undo(),
                        },
                        {
                            id: 'redo',
                            label: 'Redo',
                            enabled: editFlags.canRedo,
                            visible: isEditable,
                            click: () => webContents.redo(),
                        },
                    ],
                    [
                        {
                            id: 'cut',
                            label: 'Cut',
                            enabled: editFlags.canCut,
                            visible: isEditable,
                            click: () => webContents.cut(),
                        },
                        {
                            id: 'copy',
                            label: 'Copy',
                            enabled: editFlags.canCopy,
                            visible: isEditable || hasText,
                            click: () => webContents.copy(),
                        },
                        {
                            id: 'paste',
                            label: 'Paste',
                            enabled: editFlags.canPaste,
                            visible: isEditable,
                            click: () => webContents.paste(),
                        },
                        {
                            id: 'pasteAndMatch',
                            label: 'Paste and Match Style',
                            enabled: editFlags.canPaste,
                            visible: isEditable && inputFieldType !== 'plainText',
                            click: () => webContents.pasteAndMatchStyle(),
                        },
                        {
                            id: 'selectAll',
                            label: 'Select All',
                            enabled: editFlags.canSelectAll,
                            visible: true,
                            click: () => webContents.selectAll(),
                        },
                    ],
                    [
                        {
                            id: 'openLinkBrowser',
                            label: 'Open Link in Browser',
                            visible: linkURL.length !== 0 && mediaType === 'none',
                            click: () => API.openURL(linkURL),
                        },
                        {
                            id: 'copyImageAddress',
                            label: 'Copy Image Address',
                            visible: mediaType === 'image',
                            click: () =>
                                electron.clipboard.write({
                                    bookmark: srcURL,
                                    text: srcURL,
                                }),
                        },
                        {
                            id: 'copyLink',
                            label: 'Copy Link',
                            visible: linkURL.length !== 0 && mediaType === 'none',
                            click: () =>
                                electron.clipboard.write({
                                    bookmark: linkText,
                                    text: linkURL,
                                }),
                        },
                    ],
                    [
                        {
                            id: 'inspect',
                            label: 'Inspect Element',
                            visible: env.development,
                            click() {
                                webview.inspectElement(x, y);
                                if (webContents.isDevToolsOpened()) {
                                    webContents.devToolsWebContents.focus();
                                }
                            },
                        },
                    ],
                ])
            );
        };
    }, [webview, webContents]);
}
