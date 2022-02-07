import React from 'react'

import { useNavigate } from 'react-router-dom';
import { useForceUpdate } from '../utils/hooks';

import TimetableManager from "../managers/TimetableManager"

import RouteButton from "../components/RouteButton"

const Settings = () => {
	const forceUpdate = useForceUpdate();
	const items = TimetableManager.getCachedTimetables()
		.map(el => <TimetableFragment key={JSON.stringify(el)}
			cachedTimetable={el}
			onUpdate={() => forceUpdate()} />);
	return (
		<div className="settings">
			<div className="header">
				<RouteButton to="/" className="back" text="← Повернутися" />
			</div>
			<div className="timetables">
				{items.length > 0 ? items : "Збережені розклади відсутні!"}
			</div>
			<div className="flex-grow" />
			<div className="footer">
				<div className="clear" onClick={() => {
					TimetableManager.clearCache();
					forceUpdate();
				}}>Очистити дані</div>
			</div>
		</div>
	)
};

const TimetableFragment = ({ cachedTimetable, onUpdate }) => {
	const navigate = useNavigate();
	return (
		<div className="cached-timetable">
			<div className="info" onClick={() => {
				navigate(cachedTimetable.group);
			}}>
				<div className="name">{cachedTimetable.group}</div>
				<div className="time">{new Date(cachedTimetable.time).toLocaleString()}</div>
			</div>
			<div className="flex-grow" />
			<div className="refresh" onClick={() => {
				TimetableManager.updateTimetable(cachedTimetable.group).then(timetable => {
					if (onUpdate) onUpdate();
				});
			}}>Оновити</div>
			<div className="delete" onClick={() => {
				TimetableManager.deleteTimetable(cachedTimetable.group).then(() => {
					if (onUpdate) onUpdate();
				});
			}}>Видалити</div>
		</div>
	)
}

export default Settings
