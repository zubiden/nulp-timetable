import React from 'react'
import {Link} from "react-router-dom"

import "./RouteButton.scss";

const RouteButton = ({text, to, className = ""}) => {
  return (
  		<Link to={to} className={`route-button ${className}`}>
  			<div className="route-button-text">{text}</div>
  		</Link>
  )
}

export default RouteButton