import React from 'react';
import styles from './Sidebar.module.scss';
import classnames from 'classnames';

type Props = {
    children: React.ReactNode;
    panelOpen?: boolean;
};

export default function SettingsSidebar({ children, panelOpen }: Props) {
    const wrapClasses = classnames(styles.wrap, {
        [styles.wrap__panelOpen]: panelOpen,
    });
    return (
        <div className={wrapClasses}>
            <div className={styles.sidebar}>{children}</div>
        </div>
    );
}
