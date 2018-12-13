import React from 'react';
import styles from './Columns.module.scss';
import classnames from 'classnames';

type Props = {
    onClick: () => any;
    children: React.ReactElement<any>;
    className?: string;
    right?: boolean;
    disabled?: boolean;
};

export default function SidebarIcon({ onClick, children, className, right, disabled }: Props) {
    const classes = classnames(styles.action, className, {
        [styles.action__right]: right,
    });
    return (
        <button
            className={classes}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
            type="button">
            {children}
        </button>
    );
}
