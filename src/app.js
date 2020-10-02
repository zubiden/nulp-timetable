import React, { useState} from 'react'
import {HISTORY} from "./utils/history"

import {Router, Switch, Route} from "react-router"

import InstituteSelection from './routes/InstituteSelection'
import GroupSelection from './routes/GroupSelection'
import Timetable from './routes/Timetable'
import Settings from "./routes/Settings"

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

  let content = null;
  if (institute && group) {
    content = <Timetable institute={institute} group={group}/>
  } else if (institute) {
    content = <GroupSelection institute={institute}/>
  } else {
    content = <InstituteSelection/>
  }

  return (
    <Router history={HISTORY}>
        <Switch>
            {/*<Route exact path={__PUBLIC_URL__+"/"}>
                {content}
            </Route>*/}
            <Route path={__PUBLIC_URL__+"/settings"}>
                <Settings/>
            </Route>
            <Route>
                {content}
            </Route>
        </Switch>
    </Router>
  )
}
