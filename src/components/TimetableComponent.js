import React from 'react'

import classNames from "classnames";

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
        for (let i = 0; i < size.rows + 1; i++) {
            for (let j = 0; j < size.days + 1; j++) {
                // first row
                if (i === 0) {
                    if (j === 0) {
                        cells.push(<EmptyCell key="first"/>); // first cell always empty
                    } else {
                        const weekday = this.getWeekday(j);
                        cells.push(<DayCell weekday={weekday} key = {weekday}/>);
                        //cells.push(<TimetableCell date key={weekday}><div className="date">{weekday}</div></TimetableCell>)
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
        const { date, numeration, lesson, empty, children } = this.props;
        const { fadeIn, fadeOut, prevLesson } = this.state;
        return (
            <div className={classNames({
                "timetable-cell": true,
                "date": date,
                "numeration": numeration,
                "empty": empty
            })}>
                <div onAnimationEnd={this.onAnimationEnd} className={classNames({
                    "animation-wrapper": true,
                    "fade-in": fadeIn,
                    "fade-out": fadeOut
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
            <div className="location">{lesson.location}</div>
            {lesson.url && <a className="url" href={lesson.url} target="_blank" ref="noopener">Посилання</a>}
        </div>
    )
}

export default TimetableComponent