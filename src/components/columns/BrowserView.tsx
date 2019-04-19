import React, { memo, useMemo, useState, Dispatch, SetStateAction, useRef, useEffect } from 'react';
import styles from './BrowserView.module.scss';
import { AlertTriangle } from 'react-feather';
import useDomListener from '../../hooks/useDomListener';
import { DidFailLoadEvent } from 'electron';
import { WebviewTag } from 'electron';
import { env } from '../../Injected';

type Props = {
    url: string;
    id: string;
    mobile?: boolean;
    setWebview: Dispatch<SetStateAction<WebviewTag | undefined>>;
};

type ErrorData = {
    code: number;
    message: string;
};

const hideScrollbarCss = `
body::-webkit-scrollbar { 
    display: none!important; 
}
`;

const desktopUserAgent = navigator.userAgent;
const mobileUserAgent = `Mozilla/5.0 (Linux; Android 9; Pixel Build/PPR2.181005.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/196.0.0.41.95;]`;

export default memo(function BrowserView({ url, id, mobile, setWebview }: Props) {
    const viewRef = useRef<WebviewTag | null>(null);
    const [errorData, setErrorData] = useState<null | ErrorData>(null);

    const initialUseragent = useMemo(() => (mobile ? mobileUserAgent : desktopUserAgent), []);

    useDomListener<'did-fail-load'>(
        viewRef,
        'did-fail-load',
        (e: DidFailLoadEvent) =>
            e.errorCode !== -3 &&
            setErrorData({
                code: e.errorCode,
                message: e.errorDescription,
            })
    );

    useDomListener<'did-finish-load'>(viewRef, 'did-finish-load', () => {
        if (!env.macos) viewRef.current!.insertCSS(hideScrollbarCss);
    });

    useEffect(() => setWebview(viewRef.current!), []);

    useDomListener<'did-start-loading'>(viewRef, 'did-start-loading', () => setErrorData(null));
    return (
        <>
            <webview
                id={id}
                key={id}
                ref={viewRef}
                className={styles.webView}
                useragent={initialUseragent} // updating will be done on webContents instead
                src={url}
                partition={`persist:${String(id)}`}
            />
            {errorData && (
                <div className={styles.errorPage}>
                    <AlertTriangle className={styles.errorIcon} />
                    <h4 className={styles.errorMessage}>{errorData.message}</h4>
                </div>
            )}
        </>
    );
});
