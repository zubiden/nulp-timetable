import React from 'react'
import classNames from "classnames"

import TimetableManager from "../managers/TimetableManager"
import { setSearchParameters, getCurrentParameters } from "../utils/history"

import TwoSideButton from "../components/TwoSideButton"
import TimetableComponent from "../components/TimetableComponent"

class Timetable extends React.Component {
    constructor(props) {
        super(props);

        const subgroup = Number.parseInt(getCurrentParameters().subgroup) || 1;

        this.state = {
            timetable: [],
            week: getWeek() % 2 === 0 ? 1 : 2, // NULP doesn't like standardization
            subgroup: subgroup,
            isError: false,
        }
    }

    render() {
    	const time = TimetableManager.getCachedTime(this.props.institute, this.props.group);
        return (
            <div className="timetable-page">
		        <div className="header">
		            <div className="back" onClick={() => setSearchParameters({institute: this.props.institute})}>🡠 Повернутися</div>
		            <div className="location">{this.props.institute+"/"+this.props.group}</div>
		        </div>
		        <div className="controls">
		            <TwoSideButton one="I підгрупа" two="II підгрупа" default={this.state.subgroup === 1 ? "one" : "two"} onSelect={side => this.setState({subgroup: side === "one" ? 1 : 2})}/>
		            <div className="spreader"/>
		            <TwoSideButton one="По чисельнику" two="По знаменнику" default={this.state.week === 1 ? "one" : "two"} onSelect={side => this.setState({week: side === "one"? 1 : 2})}/>
		        </div>
		        {this.state.timetable.length === 0 && !this.state.isError && <div className="loading">Отримання даних з lpnu.ua</div>}
		        {this.state.isError && <div className="error">Помилка при отриманні даних!</div>}
		        {this.state.timetable.length > 0 && <TimetableComponent onReady={this.tryToScrollToCurrentDay} elements={this.prepareTimetable()}/>}
		        <div className="timetable-footer">
		        	<button className="reload" onClick={this.updateTimetable}>Оновити</button>
		        	<div className="last-cached">{time ? ("Востаннє: "+new Date(time).toLocaleString()) : ""}</div>
		        </div>
	        </div>
        )
    }

    componentDidMount() {
        TimetableManager.getTimetable(this.props.institute, this.props.group).then(timetable => {
            this.setState({
                timetable
            })
        }).catch(err => {
            this.setState({
                isError: true
            })
        })
    }

    getFilteredTimetable() {
        const week = this.state.week;
        const subgroup = this.state.subgroup;
        return this.state.timetable.filter(lesson => this.testWeek(lesson) && this.testSubgroup(lesson));
    }

    prepareTimetable() {
        const filtered = this.getFilteredTimetable();
        return filtered.map(el => {
            return {
                day: el.day,
                position: el.number,
                lesson: el
            }
        });
    }

    tryToScrollToCurrentDay = (el) => { // yeah, naming!
    	const width = el.getBoundingClientRect().width;

    	const currentDay = new Date().getDay(); // 0 - Sunday
    	if(currentDay === 0) currentDay = 7;
    	const inTimetable = this.getFilteredTimetable().some(el => el.day === currentDay);
    	if(inTimetable) {
    		el.scrollTo((currentDay-1)*width, 0);
    	}
    }

    // writing this at 4:50AM, refractor required
    testWeek(lesson) {
        if (this.state.week === 1 && lesson.isFirstWeek) return true;
        if (this.state.week === 2 && lesson.isSecondWeek) return true;
        return false;
    }

    testSubgroup(lesson) {
        if (this.state.subgroup === 1 && lesson.isFirstSubgroup) return true;
        if (this.state.subgroup === 2 && lesson.isSecondSubgroup) return true;
        return false;
    }

    updateTimetable = () => {
    	this.setState({
    		isError: false
    	})
    	TimetableManager.updateTimetable(this.props.institute, this.props.group).then(timetable => {
    		this.setState({
    			timetable
    		})
    	}).catch(err => {
    		this.setState({
    			isError: true
    		})
    	})
    }
}

function getWeek() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 -
        3 + (week1.getDay() + 6) % 7) / 7);
}

export default Timetable