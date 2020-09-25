import React from 'react'

import classNames from "classnames";
import "./TimetableComponent.scss";

/*
    element:
        day
        position
        content
*/
const TimetableComponent = ({ elements }) => {
    const sizes = findSize(elements);
    return (
        <div className={classNames({
            timetable: true,
            "has-saturday": sizes.days === 6,
            "has-sunday": sizes.days === 7 // Не заздрю...
          })}>
        {makeTable(sizes, elements)}
    </div>
    )
}

class TimetableCell extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            prevLesson: props.lesson,
            fadeIn: true,
            fadeOut: false
        }
    }

    render() {
        const { date, numeration, lesson, children } = this.props;
        const { fadeIn, fadeOut, prevLesson } = this.state;
        return (
            <div className={classNames({
                "timetable-cell": true,
                "date": date,
                "numeration": numeration,
            })}>
                <div onAnimationEnd={this.onAnimationEnd} className={classNames({
                    "animation-wrapper": true,
                    "fade-in": fadeIn,
                    "fade-out": fadeOut
                })}>
                    {children /*TODO special cell type for date and numeration? */}
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
            <div className="subject">{lesson.subject}</div>
            <div className="lecturer">{lesson.lecturer}</div>
            <div className="location">{lesson.location}</div>
        </div>
    )
}

function makeTable(size, elements) {
    const cells = [];
    for (let i = 0; i < size.rows + 1; i++) {
        for (let j = 0; j < size.days + 1; j++) {
            // first row
            if (i === 0) {
                if (j === 0) {
                    cells.push(<TimetableCell date key="first"/>); // first cell always empty
                } else {
                    const weekday = getWeekday(j);
                    cells.push(<TimetableCell date key={weekday}>{weekday}</TimetableCell>)
                }
            } else {
                if (j === 0) {
                    cells.push(<TimetableCell numeration key={i}>{i}</TimetableCell>);
                } else {
                    const lesson = elements.find(el => el.position === i && el.day === j)?.lesson;
                    cells.push(<TimetableCell key={i+":"+j} lesson={lesson}/>)
                }
            }
        }
    }
    return cells;
}

function getWeekday(number) {
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

function findSize(elements) {
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

export default TimetableComponent