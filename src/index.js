import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './app'

import './styles/index.scss'

ReactDOM.render(
    <App/>,
    document.getElementById('App')
)

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}