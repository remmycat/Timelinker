import React from 'react';
import styles from './App.module.scss';
import ColumnLayout from './columns/ColumnLayout';
import Sidebar from './sidebar/Sidebar';
import { SidebarState } from './sidebar/SidebarState';
import AppState from './AppState';

export default function App() {
    return (
        <div className={styles.layout}>
            <AppState>
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
            </AppState>
        </div>
    );
}
