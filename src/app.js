import React, { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from "react-router-dom"

import { getHash } from "./utils/history"
import { useForceUpdate } from './utils/hooks'

import InstituteSelection from "./routes/InstituteSelection"
import GroupSelection from "./routes/GroupSelection"
import Timetable from "./routes/Timetable"
import Settings from "./routes/Settings"

import LoadingComponent from "./components/LoadingComponent"
import TimetableManager from "./managers/TimetableManager"

const REDIRECT_URL = 'https://lpnu.pp.ua';

const App = () => {
    const location = useLocation();
    const hash = getHash(location);
    const forceUpdate = useForceUpdate();

    useEffect(() => {
        window.location.replace(REDIRECT_URL);
    }, [])

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
                    forceUpdate();
                })
                content = <LoadingComponent text="Отримання списку інститутів..." />
            }

            if (TimetableManager.getCachedGroups().length === 0) {
                TimetableManager.requestGroups().then(inst => {
                    forceUpdate();
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

    const wrappedContent = (
        <>
            <div className="notice">
                Нова версія розкладу знаходиться <a href={REDIRECT_URL}>за цим посиланням</a>
            </div>
            {content}
        </>
    );

    return (
        <Routes>
            <Route path="*" element={wrappedContent} />
        </Routes>
    )
}

const AppWrapper = () => (
    <HashRouter>
        <App />
    </HashRouter>
)

export default AppWrapper;
