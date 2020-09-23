import React from 'react'

import {addSearchParameters} from "../utils/history"

import "./URLParameterButton.scss";

const URLParameterButton = ({text, parameter}) => {
  return (
	    <div className="parameter-button" onClick={ev => addSearchParameters(parameter)}>
	    	<div className="parameter-button-text">{text}</div>
	    </div>
  )
}

export default URLParameterButton