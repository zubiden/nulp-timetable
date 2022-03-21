import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import TimetableManager from "../managers/TimetableManager"
import { getHash } from "../utils/history"
import { getCurrentUADate } from '../utils/date'

import RouteButton from "../components/RouteButton"
import TwoSideButton from "../components/TwoSideButton"
import TimetableComponent from "../components/TimetableComponent"

const Timetable = ({ group, subgroup }) => {
    const [timetable, setTimetable] = React.useState([]);
    const [week, setWeek] = React.useState(getWeek() % 2 === 0 ? 2 : 1);
    const [isError, setIsError] = React.useState(false);

    const navigate = useNavigate();

    const setSubgroup = (subgroup) => {
        let hash = getHash();
        let path = hash.split("/");
        if (subgroup) {
            path[1] = subgroup;
        } else {
            path.splice(1, 1);
        }
        navigate(path.join("/"))
    };

    const updateTimetable = (checkCache = false) => {
        setIsError(false);
        setTimetable([]);
        TimetableManager.getTimetable(group, checkCache).then(timetable => {
            setTimetable(timetable);
        }).catch(err => {
            setIsError(true);
        })
    };

    useEffect(() => {
        updateTimetable(true);
    }, [group]);

    useEffect(() => {
        if (subgroup !== 1 && subgroup !== 2) {
            setSubgroup(undefined);
        } else {
            setSubgroup(subgroup);
        }
    }, [subgroup]);

    const filteredTimetable = useMemo(() => {
        return timetable.filter(lesson => testWeek(lesson, week) && testSubgroup(lesson, subgroup))
            .map(el => ({
                day: el.day,
                position: el.number,
                lesson: el
            }));
    }, [timetable, subgroup, week]);

    const tryToScrollToCurrentDay = (el) => { // yeah, naming!
        const width = el.getBoundingClientRect().width;

        let currentDay = getCurrentUADate().getDay(); // 0 - Sunday
        if (currentDay === 0) currentDay = 7;
        const inTimetable = filteredTimetable.some(({day}) => Math.max(day, 5) >= currentDay);
        if (inTimetable) {
            el.scrollTo((currentDay - 1) * width, 0);
        }
    }

    const hasSubgroups = timetable.find(el => el.isFirstSubgroup !== el.isSecondSubgroup);
    const hasWeeks = timetable.find(el => el.isFirstWeek !== el.isSecondWeek);

    const time = TimetableManager.getCachedTime(group);
    return (
        <div className="timetable-page">
            <div className="header">
                <RouteButton className="back" to="/" text="← Повернутися" />
                <div className="location">{group}</div>
            </div>
            <div className="controls">
                {hasSubgroups ?
                    <TwoSideButton one="I підгрупа" two="II підгрупа" default={subgroup === 2 ? "two" : "one"} onSelect={side => setSubgroup(side === "two" ? 2 : 1)} />
                    :
                    <div className="spreader" />
                }
                <div className="spreader" />
                {hasWeeks ?
                    <TwoSideButton one="По чисельнику" two="По знаменнику" default={week === 2 ? "two" : "one"} onSelect={side => setWeek(side === "two" ? 2 : 1)} />
                    :
                    <div className="spreader" />
                }
            </div>
            {timetable.length === 0 && !isError && <div className="loading">Отримання даних з lpnu.ua</div>}
            {isError && <div className="error">Помилка при отриманні даних!</div>}
            {timetable.length > 0 && <TimetableComponent onReady={tryToScrollToCurrentDay} elements={filteredTimetable} />}
            <div className="timetable-footer">
                <button className="reload" onClick={updateTimetable}>Оновити</button>
                <div className="last-cached">{time ? ("Востаннє: " + new Date(time).toLocaleString()) : ""}</div>
            </div>
        </div>
    )
}

function testWeek(lesson, week) {
    if (week === 1 && lesson.isFirstWeek) return true;
    if (week === 2 && lesson.isSecondWeek) return true;
    return false;
}

function testSubgroup(lesson, subgroup) {
    if (subgroup === 1 && lesson.isFirstSubgroup) return true;
    if (subgroup === 2 && lesson.isSecondSubgroup) return true;
    return false;
}

function getWeek() {
    const date = getCurrentUADate();
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