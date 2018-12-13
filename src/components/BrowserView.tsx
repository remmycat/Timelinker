import React, { useRef, useEffect } from 'react';
import styles from './BrowserView.module.scss';

type Props = {
    url: string;
    id: string;
    addWebview: (id: string, contents: HTMLWebViewElement) => any;
};

export default function BrowserView({ url, id, addWebview }: Props) {
    const viewRef = useRef<HTMLWebViewElement | null>(null);

    useEffect(
        () => {
            addWebview(id, viewRef.current!);
        },
        [id]
    );

    return (
        <webview
            id={id}
            key={id}
            ref={viewRef}
            className={styles.webView}
            src={url}
            partition={`persist:${String(id)}`}
        />
    );
}
