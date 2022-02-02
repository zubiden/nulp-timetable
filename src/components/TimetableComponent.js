import React from 'react'

import classNames from "classnames";
import { getCurrentUADate } from '../utils/date';

import "./TimetableComponent.scss";

/*
    element:
        day
        position
        content
*/

class TimetableComponent extends React.Component {
    ref = React.createRef();

    render() {
        const {elements} = this.props;
        const sizes = this.findSize(elements)
        return (
            <div className={classNames({
            timetable: true,
            "has-saturday": sizes.days === 6,
            "has-sunday": sizes.days === 7, // Не заздрю...
              })} ref={this.ref}>
                {this.makeTable(sizes, elements)}
            </div>
        )
    }

    componentDidMount() {
        if(this.props.onReady) this.props.onReady(this.ref.current);
    }

    makeTable(size, elements) {
        const cells = [];
        let active = this.getActiveLesson();

        for (let i = 0; i < size.rows + 1; i++) {
            for (let j = 0; j < size.days + 1; j++) {
                // first row
                if (i === 0) {
                    if (j === 0) {
                        cells.push(<EmptyCell key="first"/>); // first cell always empty
                    } else {
                        const weekday = this.getWeekday(j);
                        cells.push(<DayCell weekday={weekday} key = {weekday}/>);
                    }
                } else {
                    if (j === 0) {
                        cells.push(<NumerationCell key={i} num={i} time={this.getHours(i)}/>);
                    } else {
                        const lesson = elements.find(el => el.position === i && el.day === j)?.lesson;
                        cells.push(<LessonCell key={i+":"+j} lesson={lesson} active={active.day === j && active.num === i}/>)
                    }
                }
            }
        }
        return cells;
    }

    getActiveLesson() {
    	let date = getCurrentUADate();
    	let currentDay = date.getDay(); // 0 - Sunday
    	if(currentDay === 0) currentDay = 7; // костиль

    	let prevEnd = null;

    	for(let i = 1; i < 9; i++) { // 1-8
    		let endH = this.getHours(i)[1];
    		
    		let end = this.timeToDate(endH);

    		if(date < end && (!prevEnd || date > prevEnd)) {
    			return {
    				day: currentDay,
    				num: i
    			}
    		} else {
    			prevEnd = end;
    		}
    	}

    	return {
    		day: -1,
    		num: -1
    	}
    }

    timeToDate(time) {
    	let date = getCurrentUADate();
    	let [hours, minutes] = time.split(':');
    	date.setHours(hours);
    	date.setMinutes(minutes)
    	date.setSeconds(0);
    	return date;
    }

    // TODO переписати ці світчі на щось нормальне
    getWeekday(number) {
        switch (number) {
            case 1:
                return "Понеділок";
            case 2:
                return "Вівторок";
            case 3:
                return "Середа";
            case 4:
                return "Четвер";
            case 5:
                return "П'ятниця";
            case 6:
                return "Субота";
            case 7:
                return "Неділя";
            default:
                return "Не вдалося отримати день"
        }
    }

    getHours(num) {
        switch(num) {
            case 1:
                return ["8:30", "10:05"];
            case 2:
                return ["10:20", "11:55"];
            case 3:
                return ["12:10", "13:45"];
            case 4:
                return ["14:15", "15:50"];
            case 5:
                return ["16:00", "17:35"];
            case 6:
                return ["17:40", "19:15"];
            case 7:
                return ["19:20", "20:55"];
            case 8:
                return ["21:00", "22:35"];
            default:
                return ["", ""];
        }
    }

    findSize(elements) {
        let days = 5;
        let rows = 5;
        for (let element of elements) {
            if (element.day > days) days = element.day;
            if (element.position > rows) rows = element.position;
        }
        return {
            days: Math.min(days, 7),
            rows
        }
    }
}

const NumerationCell = ({num, time}) => {
    return (
            <div className={classNames({
                "timetable-cell": true,
                "numeration": true,
            })}>
                <div className="num">{num}</div>
                <div className="hours">
                    <div>{time[0]}</div>
                    <div>{time[1]}</div>
                </div>
            </div>
        )
}

const EmptyCell = () => {
    return (
        <div className={classNames({
                "timetable-cell": true,
                "empty": true
            })}>
        </div>
        )
}

const DayCell = ({weekday}) => {
    return (
        <div className={classNames({
                "timetable-cell": true,
                "date": true
            })}>
            <div className="date">{weekday}</div>
        </div>
        )
}

class LessonCell extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            prevLesson: props.lesson,
            fadeIn: true,
            fadeOut: false
        }
    }

    render() {
        const { lesson, children, active } = this.props;
        const { fadeIn, fadeOut, prevLesson } = this.state;
        return (
            <div className="timetable-cell">
                <div onAnimationEnd={this.onAnimationEnd} className={classNames({
                    "animation-wrapper": true,
                    "fade-in": fadeIn,
                    "fade-out": fadeOut,
                    "active": active
                })}>
                    {children}
                    <LessonFragment lesson={fadeOut ? prevLesson : lesson}/>
                </div>
            </div>
        )
    }

    onAnimationEnd = (event) => {
        if (event.animationName === "fade-out") {
            this.setState({
                fadeIn: true,
                fadeOut: false
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lesson !== this.props.lesson) {
            this.setState({
                prevLesson: prevProps.lesson,
                fadeIn: false,
                fadeOut: true
            })
        }
    }
}

const LessonFragment = ({ lesson }) => {
    if (!lesson) return null;
    return (
        <div className={classNames({
                lesson: true,
                [lesson.type]: true
            })}>
            <div className="number">{lesson.number}</div>
            <div className="subject">{lesson.subject}</div>
            <div className="lecturer">{lesson.lecturer}</div>
            <div className="location">{lesson.location.trim()}</div>
            {lesson.url && <a className="url" href={lesson.url} target="_blank" rel="noopener">Посилання</a>}
        </div>
    )
}

export default TimetableComponent