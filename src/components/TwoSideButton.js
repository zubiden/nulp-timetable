import React from 'react'

import classNames from "classnames"

import "./TwoSideButton.scss"

class TwoSideButton extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			side: this.props.side ?? "one",
			sliderStyles: {left: 0, right: "100%"}
		}

		this.oneRef = React.createRef();
		this.twoRef = React.createRef();
	}

	render() {
		return (
			<div className="two-side-button">
				<div className="slider" style={this.state.sliderStyles}/>
				<div className={classNames({
					"side-button": true,
					"side-one": true,
					"selected": this.state.side ==="one"
				})} onClick={() => this.select("one")} ref={this.oneRef}>
					{this.props.one}
				</div>
				<div className={classNames({
					"side-button": true,
					"side-two": true,
					"selected": this.state.side ==="two"
				})} onClick={() => this.select("two")} ref={this.twoRef}>
					{this.props.two}
				</div>
			</div>
			)
	}

	componentDidMount() {
		this.setState({
			sliderStyles: this._calculateSliderStyles(this.state.side),
		})
	}

	select(side) {
		this.setState({
			side: side,
			sliderStyles: this._calculateSliderStyles(side),
		})

		if(this.props.onSelect) this.props.onSelect(side);
	}

	_calculateSliderStyles(side) {
		let el = null;
		if(side === "one") {
			el = this.oneRef.current;
		} else {
			el = this.twoRef.current;
		}
		if(!el) return {
			left: 0,
			right: "100%"
		}
		const rootBounds = el.parentElement.getBoundingClientRect();
		const bounds = el.getBoundingClientRect()

		const left = bounds.left - rootBounds.left;
        const right = rootBounds.right - bounds.right;

        return {
            left: `${left}px`,
            right: `${right}px`,
        }
	}
}

export default TwoSideButton