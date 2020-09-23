import React from 'react'

import classNames from "classNames";
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
            "has-saturday": sizes.days === 6
          })}>
        {makeTable(sizes, elements)}
    </div>
  )
}

const TimetableCell = ({ date, numeration, children }) => {
  return <div className={classNames({
        "timetable-cell": true,
        "date": date,
        "numeration": numeration
    })}>{children}</div>
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
          cells.push(<TimetableCell key={i+":"+j}>{elements.find(el => el.position === i && el.day === j)?.content}</TimetableCell>)
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
    days: Math.min(days, 6),
    rows
  }
}

export default TimetableComponent
