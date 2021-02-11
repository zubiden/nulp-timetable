import React from 'react'

import RouteButton from "../components/RouteButton"
import {HISTORY} from "../utils/history"

import TimetableManager from "../managers/TimetableManager"

class Settings extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {

		let items = TimetableManager.getCachedTimetables()
									.map(el => <TimetableFragment key={JSON.stringify(el)} 
																	cachedTimetable={el} 
																	onUpdate={() => this.forceUpdate()}/>);
		return (
			<div className="settings">
				<div className="header">
					<RouteButton to="/" className="back" text="← Повернутися"/>
				</div>
				<div className="timetables">
					{items.length > 0 ? items : "Збережені розклади відсутні!"}
				</div>
				<div className="flex-grow"/>
				<div className="footer">
					<div className="clear" onClick={() => {
						TimetableManager.clearCache();
						this.forceUpdate();
					}}>Очистити дані</div>
				</div>
			</div>
		)
	}
}

const TimetableFragment = ({cachedTimetable, onUpdate}) => {
	return (
		<div className="cached-timetable">
			<div className="info" onClick={() => {
				HISTORY.push({
					hash: "/"+cachedTimetable.group
				});
			}}>
				<div className="name">{cachedTimetable.group}</div>
				<div className="time">{new Date(cachedTimetable.time).toLocaleString()}</div>
			</div>
			<div className="flex-grow"/>
			<div className="refresh" onClick={() => {
				TimetableManager.updateTimetable(cachedTimetable.group).then(timetable => {
					if(onUpdate) onUpdate();
				});
			}}>Оновити</div>
			<div className="delete" onClick={() => {
				TimetableManager.deleteTimetable(cachedTimetable.group).then(() => {
					if(onUpdate) onUpdate();
				});
			}}>Видалити</div>
		</div>
		)
}

export default Settings
