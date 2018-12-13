import React from 'react';
import styles from './Sidebar.module.scss';
import classnames from 'classnames';

type Props = {
    onClick: () => any;
    children: React.ReactElement<any>;
    className?: string;
    active?: boolean;
};

export default function SidebarIcon({ onClick, children, className, active }: Props) {
    const classes = classnames(styles.button, className, {
        [styles.button__active]: active,
    });
    return (
        <button className={classes} onClick={onClick} type="button">
            {children}
        </button>
    );
}
