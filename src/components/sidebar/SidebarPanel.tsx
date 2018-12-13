import React from 'react';
import styles from './Sidebar.module.scss';
import classnames from 'classnames';
import SidebarIcon from './SidebarIcon';
import { ArrowLeft } from 'react-feather';

type Props = {
    children: React.ReactNode;
    visible?: boolean;
    onClose?: () => any;
};

export default function SidbarPanel({ children, visible, onClose }: Props) {
    const panelStyle = classnames(styles.panel, {
        [styles.panel__visible]: visible,
    });

    return (
        <div className={panelStyle}>
            {onClose && (
                <SidebarIcon onClick={onClose} className={styles.panelCloseButton}>
                    <ArrowLeft />
                </SidebarIcon>
            )}
            <div className={styles.panelContent}>{children}</div>
        </div>
    );
}
