import React from "react"

import "./LoadingComponent.scss"

const LoadingComponent = ({text}) => {
	return (<div className="loading">
		{text}
	</div>)
}

export default LoadingComponent;