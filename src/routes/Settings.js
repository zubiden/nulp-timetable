import React from 'react'

import TimetableManager from "../managers/TimetableManager"

class Settings extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="settings">
				{TimetableManager.getCachedTimetables().map(el => <TimetableFragment key={JSON.stringify(el)} cachedTimetable={el}/>)}
			</div>
		)
	}
}

const TimetableFragment = ({cachedTimetable}) => {
	return (
		<div className="cached-timetable">
			<div className="name">{cachedTimetable.institute+"/"+cachedTimetable.group}</div>
			<div className="time">{new Date(cachedTimetable.time).toLocaleString()}</div>
		</div>
		)
}

export default Settings
