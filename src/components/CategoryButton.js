import React from 'react'

import {addSearchParameters} from "../utils/history"

import "./CategoryButton.scss"

class CategoryButton extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			opened: props.opened ?? false
		}
	}

	render() {
		return (
			<div className="category-button">
				<div className="category-button-text" onClick={() => this.setState({opened: !this.state.opened})}>
					<span className="icon">{this.state.opened ? "▼" : "►"}</span>{this.props.text}
				</div>
				{this.state.opened && <div className="category-contents">
					{this.props.contents}
				</div>}
			</div>
			)
	}
}

export default CategoryButton