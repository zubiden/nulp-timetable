import React from 'react'

import {getInstitutes} from "../utils/parser"

import URLParameterButton from "../components/URLParameterButton"

class InstituteSelection extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			institutes: []
		}
	}
	render() {
		return (
			<div className="institute-selection">
				{this.state.institutes.length === 0 && <div className="loading">Отримання даних з lpnu.ua</div>}
				{this.state.institutes.map(institute => <URLParameterButton key={institute} text={institute} parameters={{institute: institute}}/>)}
			</div>
		)
	}

	componentDidMount() {
		getInstitutes().then(institutes => {
			this.setState({
				institutes
			});
		})
	}
}

export default InstituteSelection
