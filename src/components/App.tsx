import React from 'react';
import styles from './App.module.scss';
import ColumnLayout from './columns/ColumnLayout';
import BrowserView from './columns/BrowserView';
import Sidebar from './sidebar/Sidebar';
import { SidebarState } from './sidebar/SidebarState';
import State from './State';

export default function App() {
    return (
        <div className={styles.layout}>
            <State>
                {({ presets, sidebar, columns }) => (
                    <>
                        <Sidebar
                            presets={presets}
                            state={sidebar}
                            noColumns={columns.length === 0}
                        />
                        <ColumnLayout
                            id="mainContainer"
                            columns={columns}
                            controlMode={sidebar === SidebarState.control}
                        />
                    </>
                )}
            </State>
        </div>
    );
}
