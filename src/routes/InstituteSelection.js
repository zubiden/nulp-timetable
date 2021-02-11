import React from 'react'

import TimetableManager from "../managers/TimetableManager"

import RouteButton from "../components/RouteButton"

import { SearchPanel , SearchPanelVariant} from "react-search-panel";

import {throttle} from "../utils/func"

import {HISTORY} from "../utils/history"

class InstituteSelection extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			institutes: [],
			isError: false,
			search: ""
		}
	}
	render() {
		return (
			<div className="institute-selection">
				{this.state.institutes.length === 0 && !this.state.isError && <div className="loading">Отримання даних з lpnu.ua</div>}
				{this.state.isError && <div className="error">Помилка при отриманні даних!</div>}
				{this.state.institutes.length > 0 && <SearchPanel placeholder="Група..."
														className="search"
														choices={TimetableManager.searchGroups(this.state.search).map(g => {return {key: g, description: g}})}
														onChange={event => this.setState({search: event.target.value})}
														value={this.state.search}
														shadow
														onSelectionChange={this.searchSelect}
														variant={SearchPanelVariant.link}
														float
														width={"100%"}
														maximumHeight={250}/>}
				{this.state.institutes.map(institute => <RouteButton to={`/${institute}`} text={institute} key={institute}/>)}
			</div>
		)
	}

	componentDidMount() {
		TimetableManager.getInstitutes().then(institutes => {
			this.setState({
				institutes
			});
		}).catch(err => {
			this.setState({
				isError: true
			})
		})
	}

	searchSelect = choices => {
		const selected = choices[0];
		if(!selected) return;
		const group = selected.key;
		HISTORY.push({
			hash: "/"+group
		});
	}
}

export default InstituteSelection
