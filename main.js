/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 587:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(294);
// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(935);
// EXTERNAL MODULE: ./node_modules/history/index.js + 1 modules
var node_modules_history = __webpack_require__(682);
;// CONCATENATED MODULE: ./src/utils/history.js

const HISTORY = (0,node_modules_history/* createBrowserHistory */.lX)();
function setSearchParameters(paramsObject) {
  const url = new URL(window.location.href);
  url.search = "";

  for (let key in paramsObject) {
    url.searchParams.set(key, paramsObject[key]);
  }

  replaceHistoryState(url.href);
}
function addSearchParameters(paramsObject, overwrite = true) {
  const url = new URL(window.location.href);

  for (let key in paramsObject) {
    let value = url.searchParams.get(key);

    if (value && !overwrite) {
      continue;
    } else {
      url.searchParams.set(key, paramsObject[key]);
    }
  }

  replaceHistoryState(url.href);
}
function replaceHistoryState(newUrl) {
  const url = new URL(newUrl);
  const path = url.pathname + url.search + url.hash;
  HISTORY.replace(path, {});
}
function getCurrentParameters() {
  const url = new URL(window.location.href);
  let result = {};

  for (let entry of url.searchParams.entries()) {
    const [key, value] = entry;
    result[key] = value;
  }

  return result;
}
function openInNewTab(url) {
  window.open(url, "_black");
}
function getHash(location = window.location) {
  return decodeURI(location.hash || location.pathname).replace(/^#?\//, '').replace('#', ''); // #/Settings -> Settings
}
// EXTERNAL MODULE: ./node_modules/react-router-dom/index.js
var react_router_dom = __webpack_require__(711);
// EXTERNAL MODULE: ./node_modules/react-router/index.js
var react_router = __webpack_require__(974);
// EXTERNAL MODULE: ./node_modules/idb/build/index.js + 1 modules
var build = __webpack_require__(424);
;// CONCATENATED MODULE: ./src/utils/storage.js

const defaultDbName = "nulp-timetable";
const defaultStoreName = "cache";
const cachedKevals = {};
function useKeval(dbPromise, storeName) {
  if (cachedKevals[storeName]) {
    return cachedKevals[storeName];
  }

  return cachedKevals[storeName] = {
    keys: () => dbPromise.then(db => db.getAllKeys(storeName)),
    clear: () => dbPromise.then(db => db.clear(storeName)),
    deleteItem: key => dbPromise.then(db => db.delete(storeName, key)),
    getItem: key => dbPromise.then(db => db.get(storeName, key)),
    setItem: (key, val) => dbPromise.then(db => db.put(storeName, val, key))
  };
}
const DEFAULT_DB_PROMISE = (0,build/* openDB */.X3)(defaultDbName, 2, {
  upgrade(db, oldVersion, newVersion, transaction) {
    db.createObjectStore(defaultStoreName);
  }

});
const storage = useKeval(DEFAULT_DB_PROMISE, defaultStoreName);
/* harmony default export */ const utils_storage = (storage);
;// CONCATENATED MODULE: ./src/utils/func.js
const throttle = (callable, period, context = null) => {
  let timeoutId;
  let time;
  return function () {
    if (!context) {
      context = this;
    }

    if (time) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (Date.now() - time >= period) {
          callable.apply(context, arguments);
          time = Date.now();
        }
      }, period - (Date.now() - time));
    } else {
      callable.apply(context, arguments);
      time = Date.now();
    }
  };
};
function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Promise timeout'));
    }, ms);
    promise.then(value => {
      clearTimeout(timer);
      resolve(value);
    }).catch(reason => {
      clearTimeout(timer);
      reject(reason);
    });
  });
}
;// CONCATENATED MODULE: ./src/utils/parser.js

const NULP = "https://student.lpnu.ua/";
const TIMETABLE_SUFFIX = "students_schedule";
const PROXY = "https://api.codetabs.com/v1/proxy?quest=";
const FALLBACK_URL = "https://raw.githubusercontent.com/zubiden/nulp-timetable-data/data/";
const TIMEOUT = 3000; //3s

async function fetchHtml(params = {}) {
  let baseUrl = NULP + TIMETABLE_SUFFIX;
  const originalUrl = new URL(baseUrl);

  for (let key in params) {
    originalUrl.searchParams.set(key, params[key]);
  } // let encoded = encodeURIComponent(originalUrl.href);


  const proxiedUrl = PROXY + originalUrl.href;
  return timeout(TIMEOUT, fetch(proxiedUrl)).then(response => {
    if (!response.ok) throw Error(response.statusText);
    return response.text();
  });
}
async function getInstitutes() {
  return fetchHtml().then(html => {
    const select = parseAndGetOne(html, "#edit-departmentparent-abbrname-selective");
    const institutes = Array.from(select.children).map(child => child.value).filter(inst => inst !== "All").sort((a, b) => a.localeCompare(b));
    return institutes;
  }).catch(err => {
    return fetch(FALLBACK_URL + "institutes.json").then(response => {
      if (!response.ok) throw Error(err);
      return response.json();
    });
  });
}
async function getGroups(departmentparent_abbrname_selective = "All") {
  return fetchHtml({
    departmentparent_abbrname_selective
  }).then(html => {
    const select = parseAndGetOne(html, "#edit-studygroup-abbrname-selective");
    const groups = Array.from(select.children).map(child => child.value).filter(inst => inst !== "All").sort((a, b) => a.localeCompare(b));
    return groups;
  }).catch(err => {
    let fallback = FALLBACK_URL + `institutes/${departmentparent_abbrname_selective}.json`;

    if (departmentparent_abbrname_selective === "All") {
      //get all groups
      fallback = FALLBACK_URL + `groups.json`;
    }

    return fetch(fallback).then(response => {
      if (!response.ok) throw Error(err);
      return response.json();
    });
  });
}
async function getTimetable(studygroup_abbrname_selective = "All", departmentparent_abbrname_selective = "All") {
  // group, institute
  return fetchHtml({
    departmentparent_abbrname_selective,
    studygroup_abbrname_selective,
    semestrduration: 1 // Why, NULP?

  }).then(html => {
    const content = parseAndGetOne(html, ".view-content");
    const days = Array.from(content.children).map(parseDay).flat(1);
    return days;
  }).catch(err => {
    return fetch(FALLBACK_URL + `timetables/${studygroup_abbrname_selective}.json`).then(response => {
      if (!response.ok) throw Error(err);
      return response.json();
    });
  });
}
/*
	day
		header
		content
			h3
			stud_schedule
			h3
			stud_schedule
			...
*/

function parseDay(day) {
  const dayText = day.querySelector(".view-grouping-header");

  if (!dayText) {
    throw Error("Got wrong DOM structure for day!");
  }

  const dayNumber = dayToNumber(dayText.textContent);
  const contentChildren = day.querySelector(".view-grouping-content").children;
  let dayLessons = [];
  let currentLessonNumber = 0;

  for (let i = 0; i < contentChildren.length; i++) {
    const child = contentChildren[i];

    if (child.classList.contains("stud_schedule")) {
      const lessons = parsePair(child);
      if (currentLessonNumber === 0) console.warn("Lesson number is 0!", child);
      lessons.forEach(lesson => {
        lesson.day = dayNumber;
        lesson.number = currentLessonNumber;
      });
      dayLessons = dayLessons.concat(lessons);
    } else {
      currentLessonNumber = Number.parseInt(child.textContent);
    }
  }

  return dayLessons;
}

function parsePair(pair) {
  const lessonElements = pair.querySelectorAll(".group_content");
  const lessons = [];

  for (let element of lessonElements) {
    const id = element.parentElement.id;
    const meta = parseLessonId(id);
    const data = parseLessonData(element);
    /*
    	isFirstWeek
    	isSecondWeek
    	isFirstSubgroup
    	isSecondSubgroup
    	type
    	subject
    	lecturer
    	location
    	day
    	number
    */

    const lesson = { ...data,
      type: tryToGetType(data.location),
      ...meta,
      day: -1,
      number: -1
    };
    lessons.push(lesson);
  }

  return lessons;
}

function parseLessonData(element) {
  const texts = [];
  let lessonUrls = [];
  let br = false;

  for (let node of Array.from(element.childNodes)) {
    if (node.nodeName === "BR") {
      if (br) texts.push(""); //sometimes text is skipped with sequenced <br/> 

      br = true;
    } else if (node.nodeName === "SPAN") {
      lessonUrls.push(node.querySelector("a").href);
      br = false;
    } else {
      br = false;
      texts.push(node.textContent);
    }
  }

  return {
    subject: texts[0] || "",
    lecturer: texts[1] || "",
    location: texts[2] || "",
    urls: lessonUrls
  };
}

function parseLessonId(id) {
  const split = id.split("_");
  let subgroup = "all";
  let week = "full";

  if (id.includes("sub")) {
    subgroup = Number.parseInt(split[1]);
  }

  week = split[split.length - 1];
  return {
    isFirstWeek: week === "full" || week === "chys",
    isSecondWeek: week === "full" || week === "znam",
    isFirstSubgroup: subgroup === "all" || subgroup === 1,
    isSecondSubgroup: subgroup === "all" || subgroup === 2
  };
}

function tryToGetType(location) {
  location = location.toLowerCase();
  if (location.includes("практична")) return "practical";
  if (location.includes("лабораторна")) return "lab";
  if (location.includes("конс.")) return "consultation";
  return "lecture";
}

function dayToNumber(day) {
  switch (day?.toLowerCase()) {
    case "пн":
      return 1;

    case "вт":
      return 2;

    case "ср":
      return 3;

    case "чт":
      return 4;

    case "пт":
      return 5;

    case "сб":
      return 6;

    case "нд":
      return 7;

    default:
      return -1;
  }
}

function parseAndGetOne(html, css) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.querySelector(css);
}

const parser = {
  fetchHtml,
  getInstitutes,
  getGroups,
  getTimetable
};
/* harmony default export */ const utils_parser = (parser);
;// CONCATENATED MODULE: ./src/managers/TimetableManager.js


const UPDATE_PERIOD = 3 * 24 * 60 * 60 * 1000; // 3 days

class TimetableManager {
  async init() {
    this.institutes = (await utils_storage.getItem("institutes")) || [];
    this.groups = (await utils_storage.getItem("groups")) || [];
    this.timetables = (await utils_storage.getItem("cached_timetables")) || [];

    if (this.timetables.length > 0) {
      let first = this.timetables[0];

      if (first.institute) {
        // old cache, clearing...
        console.log("Clearing old cache...");
        this.clearCache();
      }
    }

    const institutesUpdated = await utils_storage.getItem("institutes_updated");

    if (this.institutes.length === 0 || needsUpdate(institutesUpdated)) {
      console.log("Downloading institute list...");
      this.requestInstitutes(true);
    }

    const groupsUpdated = await utils_storage.getItem("groups_updated");

    if (this.groups.length === 0 || needsUpdate(groupsUpdated)) {
      console.log("Downloading group list...");
      this.requestGroups(true);
    }
  }

  async requestInstitutes(force) {
    if (this.institutesRequest) return this.institutesRequest;
    return this.institutesRequest = this.getInstitutes(force);
  }

  async getInstitutes(force) {
    if (this.institutes.length > 0 && !force) return this.institutes;
    const institutes = await utils_parser.getInstitutes();
    utils_storage.setItem("institutes", institutes);
    utils_storage.setItem('institutes_updated', Date.now());
    this.institutes = institutes;
    return institutes;
  }

  async requestGroups(force) {
    // only for all
    if (this.groupsRequest) return this.groupsRequest;
    return this.groupsRequest = this.getGroups(undefined, force);
  }

  async getGroups(institute, force) {
    let suffix = institute ? "_" + institute : "";
    if (!institute && this.groups.length > 0 && !force) return this.groups;

    if (institute) {
      const cached = await utils_storage.getItem("groups" + suffix);

      if (cached && !force) {
        const updated = await utils_storage.getItem("groups" + suffix + "_updated");
        if (!needsUpdate(updated)) return cached;
      }
    }

    const groups = await utils_parser.getGroups(institute);

    if (!institute) {
      this.groups = groups;
    }

    utils_storage.setItem("groups" + suffix, groups);
    utils_storage.setItem("groups" + suffix + "_updated", Date.now());
    return groups;
  }

  async getTimetable(group, checkCache = true) {
    const data = this.timetables.find(el => el.group === group);

    if (checkCache && data && !needsUpdate(data.time)) {
      return utils_storage.getItem("timetable_" + group);
    }

    const timetable = await utils_parser.getTimetable(group);

    if (!timetable) {
      throw Error(`Failed to get timetable! Group: ${group}, checkCache: ${checkCache}`);
    }

    this.timetables = this.timetables.filter(el => el.group !== group); // remove previous timetable

    this.timetables.push({
      group,
      time: Date.now()
    });
    utils_storage.setItem("cached_timetables", this.timetables);
    utils_storage.setItem("timetable_" + group, timetable);
    return timetable;
  }

  async deleteTimetable(group) {
    this.timetables = this.timetables.filter(el => el.group !== group);
    utils_storage.deleteItem("timetable_" + group);
    return utils_storage.setItem("cached_timetables", this.timetables);
  }

  getCachedTimetables() {
    return this.timetables;
  }

  getCachedTime(group) {
    const timetable = this.timetables.find(el => el.group === group);
    return timetable?.time;
  }

  clearCache() {
    utils_storage.clear();
    this.timetables = [];
    this.groups = [];
    this.institutes = [];
  }

  getCachedInstitutes() {
    return this.institutes;
  }

  getCachedGroups() {
    return this.groups;
  }

  async updateTimetable(group) {
    return this.getTimetable(group, false);
  }

  searchGroups(query) {
    query = query.toLowerCase().replace("-", "");
    if (!this.groups) return [];
    return this.groups.filter(group => {
      return group.toLowerCase().replace("-", "").startsWith(query);
    });
  }

}

function needsUpdate(timestamp) {
  if (!timestamp) return true;
  return navigator.onLine && Date.now() - UPDATE_PERIOD > timestamp;
}

/* harmony default export */ const managers_TimetableManager = (new TimetableManager());
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(795);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(569);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(565);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(216);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(589);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/RouteButton.scss
var RouteButton = __webpack_require__(770);
;// CONCATENATED MODULE: ./src/components/RouteButton.scss

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(RouteButton/* default */.Z, options);




       /* harmony default export */ const components_RouteButton = (RouteButton/* default */.Z && RouteButton/* default.locals */.Z.locals ? RouteButton/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/RouteButton.js




const RouteButton_RouteButton = ({
  text,
  to,
  className = ""
}) => {
  return /*#__PURE__*/react.createElement(react_router_dom/* Link */.rU, {
    to: to,
    className: `route-button ${className}`
  }, /*#__PURE__*/react.createElement("div", {
    className: "route-button-text"
  }, text));
};

/* harmony default export */ const src_components_RouteButton = (RouteButton_RouteButton);
// EXTERNAL MODULE: ./node_modules/react-search-panel/dist/index.esm.js
var index_esm = __webpack_require__(850);
;// CONCATENATED MODULE: ./src/routes/InstituteSelection.js






const InstituteSelection = () => {
  const [institutes, setInstitutes] = react.useState([]);
  const [isError, setIsError] = react.useState(false);
  const [search, setSearch] = react.useState("");
  const navigate = (0,react_router/* useNavigate */.s0)();
  (0,react.useEffect)(() => {
    managers_TimetableManager.getInstitutes().then(institutes => {
      setInstitutes(institutes);
    }).catch(err => {
      setIsError(true);
    });
  }, []);

  const handleSelect = choices => {
    const selected = choices[0];
    if (!selected) return;
    const group = selected.key;
    navigate(group);
  };

  const choices = managers_TimetableManager.searchGroups(search).map(g => ({
    key: g,
    description: g
  }));
  return /*#__PURE__*/react.createElement("div", {
    className: "institute-selection"
  }, institutes.length === 0 && !isError && /*#__PURE__*/react.createElement("div", {
    className: "loading"
  }, "\u041E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u044F \u0434\u0430\u043D\u0438\u0445 \u0437 lpnu.ua"), isError && /*#__PURE__*/react.createElement("div", {
    className: "error"
  }, "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u0456 \u0434\u0430\u043D\u0438\u0445!"), institutes.length > 0 && /*#__PURE__*/react.createElement("div", {
    className: "search-row"
  }, /*#__PURE__*/react.createElement(index_esm/* SearchPanel */.E, {
    placeholder: "\u0413\u0440\u0443\u043F\u0430...",
    className: "search",
    choices: choices,
    onChange: event => setSearch(event.target.value),
    value: search,
    shadow: true,
    onSelectionChange: handleSelect,
    variant: index_esm/* SearchPanelVariant.link */.j.link,
    float: true,
    width: "100%",
    maximumHeight: 250
  }), /*#__PURE__*/react.createElement(react_router_dom/* Link */.rU, {
    to: '/settings',
    className: "settings-link"
  }, "\u2699\uFE0F")), institutes.map(institute => /*#__PURE__*/react.createElement(src_components_RouteButton, {
    to: `/${institute}`,
    text: institute,
    key: institute
  })));
};

/* harmony default export */ const routes_InstituteSelection = (InstituteSelection);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/CategoryButton.scss
var CategoryButton = __webpack_require__(535);
;// CONCATENATED MODULE: ./src/components/CategoryButton.scss

      
      
      
      
      
      
      
      
      

var CategoryButton_options = {};

CategoryButton_options.styleTagTransform = (styleTagTransform_default());
CategoryButton_options.setAttributes = (setAttributesWithoutAttributes_default());

      CategoryButton_options.insert = insertBySelector_default().bind(null, "head");
    
CategoryButton_options.domAPI = (styleDomAPI_default());
CategoryButton_options.insertStyleElement = (insertStyleElement_default());

var CategoryButton_update = injectStylesIntoStyleTag_default()(CategoryButton/* default */.Z, CategoryButton_options);




       /* harmony default export */ const components_CategoryButton = (CategoryButton/* default */.Z && CategoryButton/* default.locals */.Z.locals ? CategoryButton/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/CategoryButton.js




class CategoryButton_CategoryButton extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: props.opened ?? false
    };
  }

  render() {
    return /*#__PURE__*/react.createElement("div", {
      className: "category-button"
    }, /*#__PURE__*/react.createElement("div", {
      className: "category-button-text",
      onClick: () => this.setState({
        opened: !this.state.opened
      })
    }, /*#__PURE__*/react.createElement("span", {
      className: "icon"
    }, this.state.opened ? "▼" : "►"), this.props.text), this.state.opened && /*#__PURE__*/react.createElement("div", {
      className: "category-contents"
    }, this.props.contents));
  }

}

/* harmony default export */ const src_components_CategoryButton = (CategoryButton_CategoryButton);
;// CONCATENATED MODULE: ./src/routes/GroupSelection.js





class GroupSelection extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      groups: [],
      isError: false
    };
  }

  render() {
    return /*#__PURE__*/react.createElement("div", {
      className: "group-selection"
    }, /*#__PURE__*/react.createElement("div", {
      className: "header"
    }, /*#__PURE__*/react.createElement(src_components_RouteButton, {
      to: "/",
      className: "back",
      text: "\u2190 \u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438\u0441\u044F"
    }), /*#__PURE__*/react.createElement("div", {
      className: "location"
    }, this.props.institute)), this.state.groups.length === 0 && !this.state.isError && /*#__PURE__*/react.createElement("div", {
      className: "loading"
    }, "\u041E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u044F \u0434\u0430\u043D\u0438\u0445 \u0437 lpnu.ua"), this.state.isError && /*#__PURE__*/react.createElement("div", {
      className: "error"
    }, "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u0456 \u0434\u0430\u043D\u0438\u0445!"), this.getCategories());
  }

  componentDidMount() {
    this.fetchData(this.props.institute);
  }

  componentDidUpdate(prevProps) {
    if (this.props.institute !== prevProps.institute) {
      this.setState({
        groups: [] // clear

      });
      this.fetchData(this.props.institute);
    }
  }

  fetchData(institute) {
    managers_TimetableManager.getGroups(institute).then(groups => {
      const categories = new Set();

      for (let group of groups) {
        const category = group.split("-")[0];
        categories.add(category);
      }

      this.setState({
        groups,
        categories: Array.from(categories)
      });
    }).catch(err => {
      this.setState({
        isError: true
      });
    });
  }

  getCategories() {
    if (!this.state.categories) return [];
    const categories = [];

    for (let category of this.state.categories) {
      const groups = this.state.groups.filter(el => el.split("-")[0] === category);
      const subcategories = new Set();
      groups.forEach(group => subcategories.add(getSubcategory(group)));
      const lists = [];

      for (let subcategory of Array.from(subcategories)) {
        lists.push(groups.filter(group => group.startsWith(subcategory)).map(group => /*#__PURE__*/react.createElement(src_components_RouteButton, {
          to: `/${group}`,
          text: group,
          key: group
        })));
      }

      categories.push( /*#__PURE__*/react.createElement(src_components_CategoryButton, {
        key: category,
        text: category,
        contents: lists.map((list, i) => /*#__PURE__*/react.createElement("div", {
          key: i,
          className: "subcategory"
        }, list))
      }));
    }

    return categories;
  }

}

function getSubcategory(group) {
  return group.substring(0, group.indexOf("-") + 2); // КН-1, КН-2 ...
}

/* harmony default export */ const routes_GroupSelection = (GroupSelection);
;// CONCATENATED MODULE: ./src/utils/date.js
const LVIV_TIMEZONE = "Europe/Uzhgorod";
function getCurrentUADate() {
  const offset = new Date().getTimezoneOffset() * 60000;
  const date = new Date(Date.now() + offset + getTimezoneOffset(LVIV_TIMEZONE));
  return date;
}

const getTimezoneOffset = (timeZone, date = new Date()) => {
  const tz = date.toLocaleString("en", {
    timeZone,
    timeStyle: "long"
  }).split(" ").slice(-1)[0];
  const utc = date.toUTCString();
  const dateString = utc.substring(0, utc.length - 4);
  const offset = Date.parse(`${dateString} UTC`) - Date.parse(`${dateString} ${tz}`); // return UTC offset in millis

  return offset;
};
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(184);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/TwoSideButton.scss
var TwoSideButton = __webpack_require__(126);
;// CONCATENATED MODULE: ./src/components/TwoSideButton.scss

      
      
      
      
      
      
      
      
      

var TwoSideButton_options = {};

TwoSideButton_options.styleTagTransform = (styleTagTransform_default());
TwoSideButton_options.setAttributes = (setAttributesWithoutAttributes_default());

      TwoSideButton_options.insert = insertBySelector_default().bind(null, "head");
    
TwoSideButton_options.domAPI = (styleDomAPI_default());
TwoSideButton_options.insertStyleElement = (insertStyleElement_default());

var TwoSideButton_update = injectStylesIntoStyleTag_default()(TwoSideButton/* default */.Z, TwoSideButton_options);




       /* harmony default export */ const components_TwoSideButton = (TwoSideButton/* default */.Z && TwoSideButton/* default.locals */.Z.locals ? TwoSideButton/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/TwoSideButton.js
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class TwoSideButton_TwoSideButton extends react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onResize", throttle(() => {
      this.setState({
        sliderStyles: this._calculateSliderStyles(this.state.side)
      });
    }, 250));

    this.state = {
      side: this.props.default ?? "one",
      sliderStyles: {
        left: 0,
        right: "100%"
      }
    };
    this.oneRef = /*#__PURE__*/react.createRef();
    this.twoRef = /*#__PURE__*/react.createRef();
  }

  render() {
    return /*#__PURE__*/react.createElement("div", {
      className: "two-side-button"
    }, /*#__PURE__*/react.createElement("div", {
      className: "slider",
      style: this.state.sliderStyles
    }), /*#__PURE__*/react.createElement("div", {
      className: classnames_default()({
        "side-button": true,
        "side-one": true,
        "selected": this.state.side === "one"
      }),
      onClick: () => this.select("one"),
      ref: this.oneRef
    }, this.props.one), /*#__PURE__*/react.createElement("div", {
      className: classnames_default()({
        "side-button": true,
        "side-two": true,
        "selected": this.state.side === "two"
      }),
      onClick: () => this.select("two"),
      ref: this.twoRef
    }, this.props.two));
  }

  componentDidMount() {
    this.setState({
      sliderStyles: this._calculateSliderStyles(this.state.side)
    });
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.default !== prevProps.default) {
      this.setState({
        side: this.props.default ?? "one"
      });
    }

    if (this.state.side !== prevState.side) {
      this.setState({
        sliderStyles: this._calculateSliderStyles(this.state.side)
      });
    }
  }

  select(side) {
    this.setState({
      side: side
    });
    if (this.props.onSelect) this.props.onSelect(side);
  }

  _calculateSliderStyles(side) {
    let el = null;

    if (side === "one") {
      el = this.oneRef.current;
    } else {
      el = this.twoRef.current;
    }

    if (!el) return {
      left: 0,
      right: "100%"
    };
    const rootBounds = el.parentElement.getBoundingClientRect();
    const bounds = el.getBoundingClientRect();
    const left = bounds.left - rootBounds.left;
    const right = rootBounds.right - bounds.right;
    return {
      left: `${left}px`,
      right: `${right}px`
    };
  }

}

/* harmony default export */ const src_components_TwoSideButton = (TwoSideButton_TwoSideButton);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/TimetableComponent.scss
var TimetableComponent = __webpack_require__(340);
;// CONCATENATED MODULE: ./src/components/TimetableComponent.scss

      
      
      
      
      
      
      
      
      

var TimetableComponent_options = {};

TimetableComponent_options.styleTagTransform = (styleTagTransform_default());
TimetableComponent_options.setAttributes = (setAttributesWithoutAttributes_default());

      TimetableComponent_options.insert = insertBySelector_default().bind(null, "head");
    
TimetableComponent_options.domAPI = (styleDomAPI_default());
TimetableComponent_options.insertStyleElement = (insertStyleElement_default());

var TimetableComponent_update = injectStylesIntoStyleTag_default()(TimetableComponent/* default */.Z, TimetableComponent_options);




       /* harmony default export */ const components_TimetableComponent = (TimetableComponent/* default */.Z && TimetableComponent/* default.locals */.Z.locals ? TimetableComponent/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/TimetableComponent.js
function TimetableComponent_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





/*
    element:
        day
        position
        content
*/

function timeToDate(time) {
  let date = getCurrentUADate();
  let [hours, minutes] = time.split(':');
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  return date;
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
      return "Не вдалося отримати день";
  }
}

function getHours(num) {
  switch (num) {
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
  };
}

const TimetableComponent_TimetableComponent = ({
  elements,
  onReady
}) => {
  const ref = (0,react.useRef)();
  const sizes = findSize(elements);

  const getActiveLesson = () => {
    let date = getCurrentUADate();
    let currentDay = date.getDay(); // 0 - Sunday

    if (currentDay === 0) currentDay = 7; // костиль

    let prevEnd = null;

    for (let i = 1; i < 9; i++) {
      // 1-8
      let endH = getHours(i)[1];
      let end = timeToDate(endH);

      if (date < end && (!prevEnd || date > prevEnd)) {
        return {
          day: currentDay,
          num: i
        };
      } else {
        prevEnd = end;
      }
    }

    return {
      day: -1,
      num: -1
    };
  };

  const makeTable = (size, elements) => {
    const cells = [];
    let active = getActiveLesson();

    for (let i = 0; i < size.rows + 1; i++) {
      for (let j = 0; j < size.days + 1; j++) {
        // first row
        if (i === 0) {
          if (j === 0) {
            cells.push( /*#__PURE__*/react.createElement(EmptyCell, {
              key: "first"
            })); // first cell always empty
          } else {
            const weekday = getWeekday(j);
            cells.push( /*#__PURE__*/react.createElement(DayCell, {
              weekday: weekday,
              key: weekday
            }));
          }
        } else {
          if (j === 0) {
            cells.push( /*#__PURE__*/react.createElement(NumerationCell, {
              key: i,
              num: i,
              time: getHours(i)
            }));
          } else {
            const lesson = elements.find(el => el.position === i && el.day === j)?.lesson;
            cells.push( /*#__PURE__*/react.createElement(LessonCell, {
              key: i + ":" + j,
              lesson: lesson,
              active: active.day === j && active.num === i
            }));
          }
        }
      }
    }

    return cells;
  };

  (0,react.useEffect)(() => {
    if (elements) onReady?.(ref.current);
  }, [elements]);
  return /*#__PURE__*/react.createElement("div", {
    className: classnames_default()({
      timetable: true,
      "has-saturday": sizes.days === 6,
      "has-sunday": sizes.days === 7 // Не заздрю...

    }),
    ref: ref
  }, makeTable(sizes, elements));
};

const NumerationCell = ({
  num,
  time
}) => {
  return /*#__PURE__*/react.createElement("div", {
    className: classnames_default()({
      "timetable-cell": true,
      "numeration": true
    })
  }, /*#__PURE__*/react.createElement("div", {
    className: "num"
  }, num), /*#__PURE__*/react.createElement("div", {
    className: "hours"
  }, /*#__PURE__*/react.createElement("div", null, time[0]), /*#__PURE__*/react.createElement("div", null, time[1])));
};

const EmptyCell = () => {
  return /*#__PURE__*/react.createElement("div", {
    className: classnames_default()({
      "timetable-cell": true,
      "empty": true
    })
  });
};

const DayCell = ({
  weekday
}) => {
  return /*#__PURE__*/react.createElement("div", {
    className: classnames_default()({
      "timetable-cell": true,
      "date": true
    })
  }, /*#__PURE__*/react.createElement("div", {
    className: "date"
  }, weekday));
};

class LessonCell extends react.Component {
  constructor(props) {
    super(props);

    TimetableComponent_defineProperty(this, "onAnimationEnd", event => {
      if (event.animationName === "fade-out") {
        this.setState({
          fadeIn: true,
          fadeOut: false
        });
      }
    });

    this.state = {
      prevLesson: props.lesson,
      fadeIn: true,
      fadeOut: false
    };
  }

  render() {
    const {
      lesson,
      children,
      active
    } = this.props;
    const {
      fadeIn,
      fadeOut,
      prevLesson
    } = this.state;
    return /*#__PURE__*/react.createElement("div", {
      className: "timetable-cell"
    }, /*#__PURE__*/react.createElement("div", {
      onAnimationEnd: this.onAnimationEnd,
      className: classnames_default()({
        "animation-wrapper": true,
        "fade-in": fadeIn,
        "fade-out": fadeOut,
        "active": active
      })
    }, children, /*#__PURE__*/react.createElement(LessonFragment, {
      lesson: fadeOut ? prevLesson : lesson
    })));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lesson !== this.props.lesson) {
      this.setState({
        prevLesson: prevProps.lesson,
        fadeIn: false,
        fadeOut: true
      });
    }
  }

}

const LessonFragment = ({
  lesson
}) => {
  if (!lesson) return null;
  return /*#__PURE__*/react.createElement("div", {
    className: classnames_default()({
      lesson: true,
      [lesson.type]: true
    })
  }, /*#__PURE__*/react.createElement("div", {
    className: "number"
  }, lesson.number), /*#__PURE__*/react.createElement("div", {
    className: "subject"
  }, lesson.subject), /*#__PURE__*/react.createElement("div", {
    className: "lecturer"
  }, lesson.lecturer), /*#__PURE__*/react.createElement("div", {
    className: "location"
  }, lesson.location.trim()), lesson.urls.map(url => /*#__PURE__*/react.createElement("a", {
    className: "url",
    href: url,
    key: url,
    target: "_blank",
    rel: "noopener"
  }, "\u041F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F")));
};

/* harmony default export */ const src_components_TimetableComponent = (TimetableComponent_TimetableComponent);
;// CONCATENATED MODULE: ./src/routes/Timetable.js









const Timetable = ({
  group,
  subgroup
}) => {
  const [timetable, setTimetable] = react.useState([]);
  const [week, setWeek] = react.useState(getWeek() % 2 === 0 ? 2 : 1);
  const [isError, setIsError] = react.useState(false);
  const navigate = (0,react_router/* useNavigate */.s0)();

  const setSubgroup = subgroup => {
    let hash = getHash();
    let path = hash.split("/");

    if (subgroup) {
      path[1] = subgroup;
    } else {
      path.splice(1, 1);
    }

    navigate(path.join("/"));
  };

  const updateTimetable = (checkCache = false) => {
    setIsError(false);
    setTimetable([]);
    managers_TimetableManager.getTimetable(group, checkCache).then(timetable => {
      setTimetable(timetable);
    }).catch(err => {
      setIsError(true);
    });
  };

  (0,react.useEffect)(() => {
    updateTimetable(true);
  }, [group]);
  (0,react.useEffect)(() => {
    if (subgroup !== 1 && subgroup !== 2) {
      setSubgroup(undefined);
    } else {
      setSubgroup(subgroup);
    }
  }, [subgroup]);
  const filteredTimetable = (0,react.useMemo)(() => {
    return timetable.filter(lesson => testWeek(lesson, week) && testSubgroup(lesson, subgroup)).map(el => ({
      day: el.day,
      position: el.number,
      lesson: el
    }));
  }, [timetable, subgroup, week]);

  const tryToScrollToCurrentDay = el => {
    // yeah, naming!
    const width = el.getBoundingClientRect().width;
    let currentDay = getCurrentUADate().getDay(); // 0 - Sunday

    if (currentDay === 0) currentDay = 7;
    const inTimetable = filteredTimetable.some(({
      day
    }) => Math.max(day, 5) >= currentDay);

    if (inTimetable) {
      el.scrollTo((currentDay - 1) * width, 0);
    }
  };

  const hasSubgroups = timetable.find(el => el.isFirstSubgroup !== el.isSecondSubgroup);
  const hasWeeks = timetable.find(el => el.isFirstWeek !== el.isSecondWeek);
  const time = managers_TimetableManager.getCachedTime(group);
  return /*#__PURE__*/react.createElement("div", {
    className: "timetable-page"
  }, /*#__PURE__*/react.createElement("div", {
    className: "header"
  }, /*#__PURE__*/react.createElement(src_components_RouteButton, {
    className: "back",
    to: "/",
    text: "\u2190 \u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438\u0441\u044F"
  }), /*#__PURE__*/react.createElement("div", {
    className: "location"
  }, group)), /*#__PURE__*/react.createElement("div", {
    className: "controls"
  }, hasSubgroups ? /*#__PURE__*/react.createElement(src_components_TwoSideButton, {
    one: "I \u043F\u0456\u0434\u0433\u0440\u0443\u043F\u0430",
    two: "II \u043F\u0456\u0434\u0433\u0440\u0443\u043F\u0430",
    default: subgroup === 2 ? "two" : "one",
    onSelect: side => setSubgroup(side === "two" ? 2 : 1)
  }) : /*#__PURE__*/react.createElement("div", {
    className: "spreader"
  }), /*#__PURE__*/react.createElement("div", {
    className: "spreader"
  }), hasWeeks ? /*#__PURE__*/react.createElement(src_components_TwoSideButton, {
    one: "\u041F\u043E \u0447\u0438\u0441\u0435\u043B\u044C\u043D\u0438\u043A\u0443",
    two: "\u041F\u043E \u0437\u043D\u0430\u043C\u0435\u043D\u043D\u0438\u043A\u0443",
    default: week === 2 ? "two" : "one",
    onSelect: side => setWeek(side === "two" ? 2 : 1)
  }) : /*#__PURE__*/react.createElement("div", {
    className: "spreader"
  })), timetable.length === 0 && !isError && /*#__PURE__*/react.createElement("div", {
    className: "loading"
  }, "\u041E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u044F \u0434\u0430\u043D\u0438\u0445 \u0437 lpnu.ua"), isError && /*#__PURE__*/react.createElement("div", {
    className: "error"
  }, "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u0456 \u0434\u0430\u043D\u0438\u0445!"), timetable.length > 0 && /*#__PURE__*/react.createElement(src_components_TimetableComponent, {
    onReady: tryToScrollToCurrentDay,
    elements: filteredTimetable
  }), /*#__PURE__*/react.createElement("div", {
    className: "timetable-footer"
  }, /*#__PURE__*/react.createElement("button", {
    className: "reload",
    onClick: () => updateTimetable()
  }, "\u041E\u043D\u043E\u0432\u0438\u0442\u0438"), /*#__PURE__*/react.createElement("div", {
    className: "last-cached"
  }, time ? "Востаннє: " + new Date(time).toLocaleString() : "")));
};

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
  date.setHours(0, 0, 0, 0); // Thursday in current week decides the year.

  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7); // January 4 is always in week 1.

  const week1 = new Date(date.getFullYear(), 0, 4); // Adjust to Thursday in week 1 and count number of weeks from date to week1.

  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

/* harmony default export */ const routes_Timetable = (Timetable);
;// CONCATENATED MODULE: ./src/utils/hooks.js

function useForceUpdate() {
  const [, dispatch] = (0,react.useState)(Object.create(null)); // Turn dispatch(required_parameter) into dispatch().

  const memoizedDispatch = (0,react.useCallback)(() => {
    dispatch(Object.create(null));
  }, [dispatch]);
  return memoizedDispatch;
}
;// CONCATENATED MODULE: ./src/routes/Settings.js






const Settings = () => {
  const forceUpdate = useForceUpdate();
  const items = managers_TimetableManager.getCachedTimetables().map(el => /*#__PURE__*/react.createElement(TimetableFragment, {
    key: JSON.stringify(el),
    cachedTimetable: el,
    onUpdate: () => forceUpdate()
  }));
  return /*#__PURE__*/react.createElement("div", {
    className: "settings"
  }, /*#__PURE__*/react.createElement("div", {
    className: "header"
  }, /*#__PURE__*/react.createElement(src_components_RouteButton, {
    to: "/",
    className: "back",
    text: "\u2190 \u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438\u0441\u044F"
  })), /*#__PURE__*/react.createElement("div", {
    className: "timetables"
  }, items.length > 0 ? items : "Збережені розклади відсутні!"), /*#__PURE__*/react.createElement("div", {
    className: "flex-grow"
  }), /*#__PURE__*/react.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/react.createElement("div", {
    className: "clear",
    onClick: () => {
      managers_TimetableManager.clearCache();
      forceUpdate();
    }
  }, "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0434\u0430\u043D\u0456")));
};

const TimetableFragment = ({
  cachedTimetable,
  onUpdate
}) => {
  const navigate = (0,react_router/* useNavigate */.s0)();
  return /*#__PURE__*/react.createElement("div", {
    className: "cached-timetable"
  }, /*#__PURE__*/react.createElement("div", {
    className: "info",
    onClick: () => {
      navigate(cachedTimetable.group);
    }
  }, /*#__PURE__*/react.createElement("div", {
    className: "name"
  }, cachedTimetable.group), /*#__PURE__*/react.createElement("div", {
    className: "time"
  }, new Date(cachedTimetable.time).toLocaleString())), /*#__PURE__*/react.createElement("div", {
    className: "flex-grow"
  }), /*#__PURE__*/react.createElement("div", {
    className: "refresh",
    onClick: () => {
      managers_TimetableManager.updateTimetable(cachedTimetable.group).then(timetable => {
        if (onUpdate) onUpdate();
      });
    }
  }, "\u041E\u043D\u043E\u0432\u0438\u0442\u0438"), /*#__PURE__*/react.createElement("div", {
    className: "delete",
    onClick: () => {
      managers_TimetableManager.deleteTimetable(cachedTimetable.group).then(() => {
        if (onUpdate) onUpdate();
      });
    }
  }, "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438"));
};

/* harmony default export */ const routes_Settings = (Settings);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/LoadingComponent.scss
var LoadingComponent = __webpack_require__(778);
;// CONCATENATED MODULE: ./src/components/LoadingComponent.scss

      
      
      
      
      
      
      
      
      

var LoadingComponent_options = {};

LoadingComponent_options.styleTagTransform = (styleTagTransform_default());
LoadingComponent_options.setAttributes = (setAttributesWithoutAttributes_default());

      LoadingComponent_options.insert = insertBySelector_default().bind(null, "head");
    
LoadingComponent_options.domAPI = (styleDomAPI_default());
LoadingComponent_options.insertStyleElement = (insertStyleElement_default());

var LoadingComponent_update = injectStylesIntoStyleTag_default()(LoadingComponent/* default */.Z, LoadingComponent_options);




       /* harmony default export */ const components_LoadingComponent = (LoadingComponent/* default */.Z && LoadingComponent/* default.locals */.Z.locals ? LoadingComponent/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/LoadingComponent.js



const LoadingComponent_LoadingComponent = ({
  text
}) => {
  return /*#__PURE__*/react.createElement("div", {
    className: "loading"
  }, text);
};

/* harmony default export */ const src_components_LoadingComponent = (LoadingComponent_LoadingComponent);
;// CONCATENATED MODULE: ./src/app.js










const App = () => {
  const location = (0,react_router/* useLocation */.TH)();
  const hash = getHash(location);
  let path = hash.split("/");
  let root = path[0];
  let content = null;

  if (root) {
    switch (hash.toLowerCase()) {
      case "settings":
        content = /*#__PURE__*/react.createElement(routes_Settings, null);
        break;

      default:
        break;
    }

    if (!content) {
      if (managers_TimetableManager.getCachedInstitutes().length === 0) {
        managers_TimetableManager.requestInstitutes().then(inst => {
          undefined.forceUpdate();
        });
        content = /*#__PURE__*/react.createElement(src_components_LoadingComponent, {
          text: "\u041E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u044F \u0441\u043F\u0438\u0441\u043A\u0443 \u0456\u043D\u0441\u0442\u0438\u0442\u0443\u0442\u0456\u0432..."
        });
      }

      if (managers_TimetableManager.getCachedGroups().length === 0) {
        managers_TimetableManager.requestGroups().then(inst => {
          undefined.forceUpdate();
        });
        content = /*#__PURE__*/react.createElement(src_components_LoadingComponent, {
          text: "\u041E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u044F \u0441\u043F\u0438\u0441\u043A\u0443 \u0433\u0440\u0443\u043F..."
        });
      }

      let institute = managers_TimetableManager.getCachedInstitutes().find(inst => inst.toLowerCase().trim() === root.toLowerCase());

      if (institute) {
        content = /*#__PURE__*/react.createElement(routes_GroupSelection, {
          institute: institute
        });
      } else {
        let group = managers_TimetableManager.getCachedGroups().find(gr => gr.toLowerCase().trim() === root.toLowerCase());

        if (group) {
          content = /*#__PURE__*/react.createElement(routes_Timetable, {
            group: group,
            subgroup: Number.parseInt(path[1] || 1)
          });
        }
      }
    }
  }

  if (!content) {
    content = /*#__PURE__*/react.createElement(routes_InstituteSelection, null);
  }

  return /*#__PURE__*/react.createElement(react_router/* Routes */.Z5, null, /*#__PURE__*/react.createElement(react_router/* Route */.AW, {
    path: "*",
    element: content
  }));
};

const AppWrapper = () => /*#__PURE__*/react.createElement(react_router_dom/* HashRouter */.UT, null, /*#__PURE__*/react.createElement(App, null));

/* harmony default export */ const app = (AppWrapper);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/index.scss
var styles = __webpack_require__(61);
;// CONCATENATED MODULE: ./src/styles/index.scss

      
      
      
      
      
      
      
      
      

var styles_options = {};

styles_options.styleTagTransform = (styleTagTransform_default());
styles_options.setAttributes = (setAttributesWithoutAttributes_default());

      styles_options.insert = insertBySelector_default().bind(null, "head");
    
styles_options.domAPI = (styleDomAPI_default());
styles_options.insertStyleElement = (insertStyleElement_default());

var styles_update = injectStylesIntoStyleTag_default()(styles/* default */.Z, styles_options);




       /* harmony default export */ const src_styles = (styles/* default */.Z && styles/* default.locals */.Z.locals ? styles/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/index.js





managers_TimetableManager.init().then(() => {
  react_dom.render( /*#__PURE__*/react.createElement(app, null), document.getElementById('App'));
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(registration => {//console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

window.timetable = managers_TimetableManager;

/***/ }),

/***/ 535:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".category-button{cursor:pointer}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 778:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".loading{width:100%;text-align:center;padding:20px;font-size:24px;color:var(--textColor)}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 770:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".route-button{display:block;cursor:pointer;color:var(--textColor)}.route-button:hover,.route-button:visited,.route-button:active{color:var(--textColor)}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 340:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root{--textColor: black;--textHoverColor: #454545;--textSelectedColor: green;--contrastTextColor: white;--contrastHoverColor: #DDDDDD;--contrastSelectedColor: #AAAAAA;--hoverColor: rgba(0,0,0, 0.08);--linkColor: green;--backgroundColor: #F6F6F6;--searchBackgroundColor: #DDDDDD;--timetableCellColor: var(--backgroundColor);--timetableCellHighlight: #DDDDDD;--timetableLectureColor: #1DA1F1;--timetablePracticalColor: #FE8C27;--timetableLabColor: #7D6299;--timetableConsultationColor: #6CB859;--timetableBorderColor: #DDDDDD;--timetableOtherBorderColor: #AAAAAA;--scrollbarColor: rgba(0,0,0,0.3);--buttonActive: #DDDDDD;--buttonNonActive: #BFBFBF}@media(prefers-color-scheme: dark){:root{--textColor: white;--textHoverColor: #DDDDDD;--textSelectedColor: green;--contrastTextColor: #0F1E41;--contrastHoverColor: #454545;--contrastSelectedColor: #555555;--hoverColor: rgba(255,255,255, 0.08);--linkColor: #1DB842;--backgroundColor: #0F1E41;--searchBackgroundColor: #222B4F;--timetableCellColor: var(--backgroundColor);--timetableCellHighlight: #203060;--timetableBorderColor: #232D52;--timetableOtherBorderColor: #2A3560;--scrollbarColor: rgba(255, 255, 255, 0.3);--buttonActive: #29335C;--buttonNonActive: black}}.timetable{display:grid;grid-template-columns:auto repeat(5, 1fr);grid-template-rows:max-content;background-color:var(--timetableBorderColor);grid-gap:1px;scroll-snap-type:x mandatory;overflow-x:auto}.timetable.has-saturday{grid-template-columns:auto repeat(6, 1fr)}.timetable.has-sunday{grid-template-columns:auto repeat(7, 1fr)}@media only screen and (max-width: 991.98px){.timetable{grid-template-columns:repeat(5, 1fr)}.timetable.has-saturday{grid-template-columns:repeat(6, 1fr)}.timetable.has-sunday{grid-template-columns:repeat(7, 1fr)}}.timetable .timetable-cell{display:flex;scroll-snap-align:center;background-color:var(--timetableCellColor)}.timetable .timetable-cell.date{min-height:20px;display:flex;align-items:center;justify-content:center;padding:5px;border-bottom:var(--timetableOtherBorderColor) 2px solid;margin-bottom:-1px}.timetable .timetable-cell.date:empty{visibility:hidden}.timetable .timetable-cell.date .animation-wrapper{width:auto;min-height:20px}.timetable .timetable-cell.empty{min-height:0}.timetable .timetable-cell.empty,.timetable .timetable-cell.date{position:sticky;top:0;color:var(--textColor);z-index:1}.timetable .timetable-cell.numeration{padding:5px;color:var(--textColor);border-right:var(--timetableOtherBorderColor) 2px solid;margin-right:-1px;display:flex;flex-direction:row;justify-content:space-between}.timetable .timetable-cell.numeration .hours{margin-left:10px;font-size:12px;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end}@media only screen and (max-width: 991.98px){.timetable .timetable-cell.empty,.timetable .timetable-cell.numeration{display:none}}.timetable .timetable-cell:first-child{border-right:var(--timetableOtherBorderColor) 2px solid;margin-right:-1px;border-bottom:var(--timetableOtherBorderColor) 2px solid;margin-bottom:-1px}.timetable .timetable-cell .animation-wrapper{display:flex;width:100%;min-height:60px}.timetable .timetable-cell .animation-wrapper.fade-in{animation:fade-in .25s ease-in}.timetable .timetable-cell .animation-wrapper.fade-out{animation:fade-out .25s ease-out}.timetable .timetable-cell .animation-wrapper.active{background-color:var(--timetableCellHighlight)}.timetable .timetable-cell .lesson{width:100%;display:flex;flex-direction:column;justify-content:center;padding:5px 5px 5px 10px;position:relative;color:var(--textColor)}@media only screen and (max-width: 991.98px){.timetable .timetable-cell .lesson{padding:5px 5px 5px 15px}}.timetable .timetable-cell .lesson.lecture,.timetable .timetable-cell .lesson.lection{border-left:10px solid var(--timetableLectureColor)}.timetable .timetable-cell .lesson.practical{border-left:10px solid var(--timetablePracticalColor)}.timetable .timetable-cell .lesson.lab{border-left:10px solid var(--timetableLabColor)}.timetable .timetable-cell .lesson.consultation{border-left:10px solid var(--consultationColor)}.timetable .timetable-cell .lesson .number{position:absolute;top:2px;left:2px;color:var(--textColor)}@media(min-width: 992px){.timetable .timetable-cell .lesson .number{display:none}}.timetable .timetable-cell .lesson .subject{margin-bottom:.25rem;font-weight:600}.timetable .timetable-cell .lesson .lecturer{margin-bottom:.15rem}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 126:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".two-side-button{display:flex;position:relative;background-color:var(--buttonNonActive);border-radius:20px;text-align:center;color:var(--textColor)}.two-side-button .slider{position:absolute;height:100%;transition:left .15s ease-in-out,right .15s ease-in-out;background-color:var(--buttonActive);border-radius:20px}.two-side-button .side-button{cursor:pointer;padding:5px 10px;transition:color .15s ease-in-out;z-index:1}.two-side-button .side-button.selected{cursor:default}.two-side-button .side-button:not(.selected):hover{color:var(--textHoverColor)}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 61:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root{--textColor: black;--textHoverColor: #454545;--textSelectedColor: green;--contrastTextColor: white;--contrastHoverColor: #DDDDDD;--contrastSelectedColor: #AAAAAA;--hoverColor: rgba(0,0,0, 0.08);--linkColor: green;--backgroundColor: #F6F6F6;--searchBackgroundColor: #DDDDDD;--timetableCellColor: var(--backgroundColor);--timetableCellHighlight: #DDDDDD;--timetableLectureColor: #1DA1F1;--timetablePracticalColor: #FE8C27;--timetableLabColor: #7D6299;--timetableConsultationColor: #6CB859;--timetableBorderColor: #DDDDDD;--timetableOtherBorderColor: #AAAAAA;--scrollbarColor: rgba(0,0,0,0.3);--buttonActive: #DDDDDD;--buttonNonActive: #BFBFBF}@media(prefers-color-scheme: dark){:root{--textColor: white;--textHoverColor: #DDDDDD;--textSelectedColor: green;--contrastTextColor: #0F1E41;--contrastHoverColor: #454545;--contrastSelectedColor: #555555;--hoverColor: rgba(255,255,255, 0.08);--linkColor: #1DB842;--backgroundColor: #0F1E41;--searchBackgroundColor: #222B4F;--timetableCellColor: var(--backgroundColor);--timetableCellHighlight: #203060;--timetableBorderColor: #232D52;--timetableOtherBorderColor: #2A3560;--scrollbarColor: rgba(255, 255, 255, 0.3);--buttonActive: #29335C;--buttonNonActive: black}}html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:\"\";content:none}table{border-collapse:collapse;border-spacing:0}a{text-decoration:none;outline:0}*,*:before,*:after{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box}html{font-family:sans-serif}html,body{height:100%;overflow:hidden}#App{overflow-y:auto;background-color:var(--backgroundColor);width:100%;height:100%;position:relative}.grid-center{display:grid;place-items:center}.flex-grow{flex-grow:1}.flex-shrink{flex-shrink:1}.relative{position:relative}a,a:hover,a:visited,a:active{color:var(--linkColor)}@media(min-width: 992px){.mobile-only{display:none}}@media only screen and (max-width: 991.98px){.desktop-only{display:none}}::-webkit-scrollbar{width:5px;height:5px;border-radius:5px}::-webkit-scrollbar-track{background:rgba(0,0,0,0);border:solid 3px rgba(0,0,0,0)}::-webkit-scrollbar-thumb{background:var(--scrollbarColor);border:solid 3px rgba(0,0,0,0);border-radius:5px;min-height:50px;height:50px;max-height:50px}::-webkit-scrollbar-thumb:hover{background:var(--scrollbarColor)}*{scrollbar-color:rgba(var(--scrollbarColor), 0.3) rgba(0,0,0,0);scrollbar-width:thin}@keyframes fade-in{from{opacity:0}to{opacity:1}}@keyframes fade-out{from{opacity:1}to{opacity:0}}.institute-selection,.group-selection{padding:15px;animation:fade-in .15s ease-in-out}.institute-selection .loading,.institute-selection .error,.group-selection .loading,.group-selection .error{font-size:20px;text-align:center;grid-column:1/3;align-self:center;color:var(--textColor)}.institute-selection .error,.group-selection .error{color:red}.institute-selection{display:grid;grid-template-columns:1fr 1fr;align-items:center;grid-gap:10px}.institute-selection .search-row{grid-column:1/3;display:flex}.institute-selection .search-row>div:first-child{flex-grow:1;align-self:center;position:relative}.institute-selection .search-row>div:first-child form>div:first-child{background-color:var(--searchBackgroundColor);border:1px solid var(--searchBackgroundColor)}.institute-selection .search-row>div:first-child form>div:first-child input{color:var(--textColor)}.institute-selection .search-row>div:first-child #ResultContainer{width:100%}.institute-selection .search-row>div:first-child #ResultContainer fieldset{overflow-y:overlay;overflow-x:hidden;background-color:var(--searchBackgroundColor)}.institute-selection .search-row>div:first-child #ResultContainer fieldset div{margin:6px 0;width:100%}.institute-selection .search-row>div:first-child #ResultContainer fieldset div>a{display:block;width:100%;color:var(--textColor);font-weight:bold}.institute-selection .search-row .settings-link{height:44px;width:44px;display:flex;align-items:center;justify-content:center;font-size:1.75rem;margin-left:.5rem}.institute-selection .route-button{min-width:50px;min-height:50px;display:flex;align-items:center;justify-content:center;border:1px solid var(--textHoverColor);animation:fade-in .15s ease-in-out;transition:background-color .15s ease-in-out}.institute-selection .route-button:hover{background-color:var(--hoverColor)}.institute-selection .route-button .route-button-text{font-size:20px;font-weight:bold}.group-selection{display:flex;flex-direction:column;align-items:start}.group-selection .header{display:flex;justify-content:space-between;width:100%;margin-bottom:10px}.group-selection .header .back{cursor:pointer;font-size:20px;font-weight:bold}.group-selection .header .back:hover{color:var(--textHoverColor)}.group-selection .header .location{font-size:20px;font-weight:bold;color:var(--textColor);margin-left:10px}.group-selection .category-button{margin:10px 0;animation:fade-in .15s ease-in-out;color:var(--textColor)}.group-selection .category-button .category-button-text{font-size:20px;font-weight:bold}.group-selection .category-button .category-button-text .icon{font-size:14px}.group-selection .category-button .category-contents{padding-left:20px;display:flex;flex-direction:row;animation:fade-in .15s ease-in-out}.group-selection .category-button .category-contents .subcategory{margin-right:30px}.group-selection .category-button .category-contents .subcategory .route-button{margin:2px;padding:5px;border-radius:5px;transition:background-color .15s ease-in-out,color .15s ease-in-out}.group-selection .category-button .category-contents .subcategory .route-button:hover{background-color:var(--hoverColor);color:var(--textHoverColor)}.group-selection .category-button .category-contents .subcategory .route-button .route-button-text{font-weight:16px}.timetable-page{display:flex;flex-direction:column;height:100%;padding:15px;animation:fade-in .15s ease-in-out}.timetable-page .header{display:flex;justify-content:space-between;width:100%;margin-bottom:10px}.timetable-page .header .back{cursor:pointer;font-size:20px;font-weight:bold}.timetable-page .header .back:hover{color:var(--textHoverColor)}.timetable-page .header .location{font-size:20px;font-weight:bold;color:var(--textColor);margin-left:10px}.timetable-page .controls{display:flex;justify-content:center}@media only screen and (max-width: 991.98px){.timetable-page .controls{flex-wrap:wrap}}@media(min-width: 992px){.timetable-page .controls .spreader{flex-grow:1}}.timetable-page .controls .two-side-button{margin:10px}.timetable-page .loading,.timetable-page .error{align-self:center;font-size:20px;color:var(--textColor)}.timetable-page .error{color:red}.timetable-page .timetable{flex-grow:1;margin:10px 0;overflow-y:overlay}@media only screen and (max-width: 991.98px){.timetable-page .timetable .timetable-cell{width:calc(100vw - 30px)}}.timetable-page .timetable-footer{display:flex;flex-direction:column;align-items:center}.timetable-page .timetable-footer .reload{background-color:var(--buttonActive);color:var(--textColor);cursor:pointer;padding:5px 10px;border-radius:20px;outline:none;border:none;margin:5px;font-size:14px;transition:background-color .25s ease-in-out}.timetable-page .timetable-footer .reload:hover{background-color:var(--buttonNonActive)}.timetable-page .timetable-footer .last-cached{font-size:12px;color:var(--textHoverColor)}.settings{display:flex;flex-direction:column;height:100%;color:var(--textColor)}.settings .header{display:flex;justify-content:space-between;width:100%;padding:10px}.settings .header .back{cursor:pointer;font-size:20px;font-weight:bold}.settings .header .back:hover{color:var(--textHoverColor)}.settings .timetables{display:flex;flex-direction:column;padding:10px}.settings .timetables .cached-timetable{display:flex;align-items:center;padding:5px 10px;margin:5px 0;border:1px solid var(--textHoverColor);border-radius:5px}.settings .timetables .cached-timetable .info{display:flex;flex-direction:column;color:var(--textColor);cursor:pointer}.settings .timetables .cached-timetable .delete{color:red}.settings .timetables .cached-timetable .refresh{color:var(--textColor)}.settings .timetables .cached-timetable .delete,.settings .timetables .cached-timetable .refresh{padding:5px;margin:5px;font-weight:bold;cursor:pointer;border-radius:5px;transition:background-color .25s ease-in-out}.settings .timetables .cached-timetable .delete:hover,.settings .timetables .cached-timetable .refresh:hover{background-color:var(--contrastHoverColor)}.settings .footer{display:flex;align-items:center;justify-content:center}.settings .footer .clear{padding:10px;margin:5px;font-size:20px;color:red;cursor:pointer;border-radius:10px;transition:background-color .25s ease-in-out}.settings .footer .clear:hover{background-color:var(--contrastHoverColor)}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunknulp_timetable"] = self["webpackChunknulp_timetable"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [751], () => (__webpack_require__(587)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;