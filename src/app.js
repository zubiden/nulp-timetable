import React, { useState} from 'react'
import {HISTORY} from "./utils/history"

import InstituteSelection from './routes/InstituteSelection'
import GroupSelection from './routes/GroupSelection'
import Timetable from './routes/Timetable'

const INSTITUTE_PARAM = "institute";
const GROUP_PARAM = "group"


function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue(value => ++value);
}

export const App = () => {
  const [search, setSearch] = useState(window.location.search)
  HISTORY.listen(({search}) => {
    setSearch(search);
  });

  const params = new URL(location.href).searchParams;

  const institute = params.get(INSTITUTE_PARAM);
  const group = params.get(GROUP_PARAM);

  // TODO group selection without institute
  if (institute && group) {
    return <Timetable institute={institute} group={group}/>
  } else if (institute) {
    return <GroupSelection institute={institute}/>
  } else {
    return <InstituteSelection/>
  }
}
