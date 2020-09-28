import React from 'react'
import classNames from "classnames"

import { getTimetable } from "../utils/parser"
import {setSearchParameters, getCurrentParameters} from "../utils/history"

import TwoSideButton from "../components/TwoSideButton"
import TimetableComponent from "../components/TimetableComponent"

class Timetable extends React.Component {
  constructor(props) {
    super(props);

    const subgroup = Number.parseInt(getCurrentParameters().subgroup) || 1;

    this.state = {
      timetable: [],
      week: getWeek() % 2 === 1 ? 1 : 2,
      subgroup: subgroup,
    }
  }

  render() {
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
        {this.state.timetable.length === 0 && <div className="loading">Отримання даних з lpnu.ua</div>}
        {this.state.timetable.length > 0 && <TimetableComponent elements={this.prepareTimetable()}/>}
        </div>
    )
  }

  componentDidMount() {
    getTimetable(this.props.institute, this.props.group).then(timetable => {
      this.setState({
        timetable
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
