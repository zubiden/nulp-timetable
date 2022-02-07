import React from 'react'
import { getHash } from "./utils/history"

import { HashRouter, Routes, Route, useLocation } from "react-router-dom"

import InstituteSelection from "./routes/InstituteSelection"
import GroupSelection from "./routes/GroupSelection"
import Timetable from "./routes/Timetable"
import Settings from "./routes/Settings"

import LoadingComponent from "./components/LoadingComponent"
import TimetableManager from "./managers/TimetableManager"

const App = () => {
    const location = useLocation();
    const hash = getHash(location);

    let path = hash.split("/");
    let root = path[0];

    let content = null;
    if (root) {
        switch (hash.toLowerCase()) {
            case "settings":
                content = <Settings />
                break;
            default:
                break;
        }

        if (!content) {

            if (TimetableManager.getCachedInstitutes().length === 0) {
                TimetableManager.requestInstitutes().then(inst => {
                    this.forceUpdate();
                })
                content = <LoadingComponent text="Отримання списку інститутів..." />
            }

            if (TimetableManager.getCachedGroups().length === 0) {
                TimetableManager.requestGroups().then(inst => {
                    this.forceUpdate();
                })
                content = <LoadingComponent text="Отримання списку груп..." />
            }

            let institute = TimetableManager.getCachedInstitutes().find(inst => inst.toLowerCase().trim() === root.toLowerCase());
            if (institute) {
                content = <GroupSelection institute={institute} />
            } else {
                let group = TimetableManager.getCachedGroups().find(gr => gr.toLowerCase().trim() === root.toLowerCase());
                if (group) {
                    content = <Timetable group={group} subgroup={Number.parseInt(path[1] || 1)} />
                }
            }
        }
    }

    if (!content) {
        content = <InstituteSelection />;
    }

    return (
        <Routes>
            <Route path="*" element={content} />
        </Routes>
    )
}

const AppWrapper = () => (
    <HashRouter>
        <App />
    </HashRouter>
)

export default AppWrapper;
