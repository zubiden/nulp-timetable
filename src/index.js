import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

import TimetableManager from "./managers/TimetableManager"

import './styles/index.scss'

TimetableManager.init().then(() => {
	ReactDOM.render(
    	<App/>,
    	document.getElementById('App')
	)
})


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js').then(registration => {
                    //console.log('SW registered: ', registration);
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
    });
}

window.timetable = TimetableManager;
