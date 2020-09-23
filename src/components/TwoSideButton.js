import React from 'react'

import classNames from "classNames"

import "./TwoSideButton.scss"

class TwoSideButton extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			side: this.props.side ?? "one"
		}
	}

	render() {
		return (
			<div className="two-side-button">
				<div className={classNames({
					"side-button": true,
					"side-one": true,
					"selected": this.state.side ==="one"
				})} onClick={() => this.select("one")}>
					{this.props.one}
				</div>
				<div className={classNames({
					"side-button": true,
					"side-two": true,
					"selected": this.state.side ==="two"
				})} onClick={() => this.select("two")}>
					{this.props.two}
				</div>
			</div>
			)
	}

	select(side) {
		this.setState({
			side
		})

		if(this.props.onSelect) this.props.onSelect(side);
	}
}

export default TwoSideButton