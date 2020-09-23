import React from 'react'

import {getGroups} from "../utils/parser"
import {setSearchParameters} from "../utils/history"

import URLParameterButton from "../components/URLParameterButton"
import CategoryButton from "../components/CategoryButton"

class GroupSelection extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			categories: [],
			groups: []
		}
	}

	render() {
		return (
			<div className="group-selection">
				<div className="back" onClick={() => setSearchParameters({})}>🡠 Повернутися</div>
				{this.state.groups.length === 0 && <div className="loading">Отримання даних з lpnu.ua</div>}
				{this.getCategories()}
			</div>
		)
	}

	componentDidMount() {
		getGroups(this.props.institute).then(groups => {
			const categories = new Set();
			for(let group of groups) {
				const category = group.split("-")[0];
				categories.add(category);
			}

			this.setState({
				groups,
				categories: Array.from(categories)
			});
		})
	}

	getCategories() {
		if(!this.state.categories) return [];
		const categories = [];
		for(let category of this.state.categories) {
			const groups = this.state.groups.filter(el => el.split("-")[0] === category);
			categories.push(<CategoryButton key={category} text={category} contents={groups.map(group => {
				return <URLParameterButton key={group} text={group} parameter={{group: group}}/>
			})}/>)
		}
		return categories;
	}
}

export default GroupSelection
