import React from 'react'

import {addSearchParameters, openInNewTab} from "../utils/history"

import "./URLParameterButton.scss";

const URLParameterButton = ({text, parameters}) => {
  return (
	    <div className="parameter-button" onMouseDown={ev => onMouseDown(ev, parameters)}>
	    	<div className="parameter-button-text">{text}</div>
	    </div>
  )
}

const onMouseDown = (event, parameters) => {
	event.preventDefault();
	if(event.button === 0) {
		addSearchParameters(parameters)
	}
	if(event.button === 1) {
		const url = new URL(window.location.href);
		for(let param in parameters) {
			url.searchParams.set(param, parameters[param]);
		}
		openInNewTab(url);
	}
}

export default URLParameterButton