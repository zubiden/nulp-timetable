import React, { useEffect } from 'react'

import { Link, useNavigate } from 'react-router-dom';

import TimetableManager from "../managers/TimetableManager"

import RouteButton from "../components/RouteButton"
import { SearchPanel, SearchPanelVariant } from "react-search-panel";

const InstituteSelection = () => {
	const [institutes, setInstitutes] = React.useState([]);
	const [isError, setIsError] = React.useState(false);
	const [search, setSearch] = React.useState("");

	const navigate = useNavigate();

	useEffect(() => {
		TimetableManager.getInstitutes().then(institutes => {
			setInstitutes(institutes);
		}).catch(err => {
			setIsError(true);
		})
	}, []);

	const handleSelect = (choices) => {
		const selected = choices[0];
		if (!selected) return;
		const group = selected.key;
		navigate(group);
	}

	const choices = TimetableManager.searchGroups(search).map(g => ({ key: g, description: g } ));

	return (
		<div className="institute-selection">
			{institutes.length === 0 && !isError && <div className="loading">Отримання даних з lpnu.ua</div>}
			{isError && <div className="error">Помилка при отриманні даних!</div>}
			{institutes.length > 0 && (
				<div className="search-row">
					<SearchPanel placeholder="Група..."
						className="search"
						choices={choices}
						onChange={event => setSearch(event.target.value)}
						value={search}
						shadow
						onSelectionChange={handleSelect}
						variant={SearchPanelVariant.link}
						float
						width={"100%"}
						maximumHeight={250} />
					<Link to={'/settings'} className="settings-link">⚙️</Link>
				</div>
			)}
			{institutes.map(institute => <RouteButton to={`/${institute}`} text={institute} key={institute} />)}
		</div>
	);
};

export default InstituteSelection
