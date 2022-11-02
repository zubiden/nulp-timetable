import {timeout} from "./func"

const NULP = "https://student.lpnu.ua/";
const TIMETABLE_SUFFIX = "students_schedule";
const PROXY = "https://api.codetabs.com/v1/proxy?quest=";

const FALLBACK_URL = "https://raw.githubusercontent.com/zubiden/nulp-timetable-data/data/";

const TIMEOUT = 3000; //3s

export async function fetchHtml(params = {}) {
	let baseUrl = NULP + TIMETABLE_SUFFIX;
	const originalUrl = new URL(baseUrl);
	for(let key in params) {
		originalUrl.searchParams.set(key, params[key])
	}
	// let encoded = encodeURIComponent(originalUrl.href);
	const proxiedUrl = PROXY + originalUrl.href;

	return timeout(TIMEOUT, fetch(proxiedUrl)).then(response => {
		if(!response.ok) throw Error(response.statusText);
		return response.text()
	})
}

export async function getInstitutes() {
	return fetchHtml().then(html => {
		const select = parseAndGetOne(html, "#edit-departmentparent-abbrname-selective");
		const institutes = Array.from(select.children)
								.map(child => child.value)
								.filter(inst => inst !== "All")
								.sort((a, b) => a.localeCompare(b));
		return institutes;
	}).catch(err => {
		return fetch(FALLBACK_URL+"institutes.json").then(response => {
			if(!response.ok) throw Error(err);
			return response.json();
		})
	})
}

export async function getGroups(departmentparent_abbrname_selective = "All") {
	return fetchHtml({departmentparent_abbrname_selective}).then(html => {
		const select = parseAndGetOne(html, "#edit-studygroup-abbrname-selective");
		const groups = Array.from(select.children)
							.map(child => child.value)
							.filter(inst => inst !== "All")
							.sort((a, b) => a.localeCompare(b));
		return groups;
	}).catch(err => {
		let fallback = FALLBACK_URL+`institutes/${departmentparent_abbrname_selective}.json`;
		if(departmentparent_abbrname_selective === "All") { //get all groups
			fallback = FALLBACK_URL+`groups.json`;
		}
		return fetch(fallback).then(response => {
			if(!response.ok) throw Error(err);
			return response.json();
		})
	})
}

export async function getTimetable(studygroup_abbrname_selective="All", departmentparent_abbrname_selective = "All" ) { // group, institute
	return fetchHtml({
		departmentparent_abbrname_selective,
	 	studygroup_abbrname_selective,
	  	semestrduration: 1, // Why, NULP?
	}).then(html => {
		const content = parseAndGetOne(html, ".view-content");
		const days = Array.from(content.children)
							.map(parseDay)
							.flat(1);
		return days;
	}).catch(err => {
		return fetch(FALLBACK_URL+`timetables/${studygroup_abbrname_selective}.json`).then(response => {
			if(!response.ok) throw Error(err);
			return response.json();
		})
	})
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
	if(!dayText) {
		throw Error("Got wrong DOM structure for day!");
	}
	const dayNumber = dayToNumber(dayText.textContent);
	const contentChildren = day.querySelector(".view-grouping-content").children;

	let dayLessons = [];

	let currentLessonNumber = 0;
	for(let i = 0; i < contentChildren.length; i++) {
		const child = contentChildren[i];
		if(child.classList.contains("stud_schedule")) {
			const lessons = parsePair(child);
			if(currentLessonNumber === 0) console.warn("Lesson number is 0!", child)
			lessons.forEach(lesson => {
				lesson.day = dayNumber;
				lesson.number = currentLessonNumber;
			})
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

	for(let element of lessonElements) {
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

		const lesson = {
			...data, 
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
	const texts = []
	let lessonUrls = [];
	let br = false;
	for(let node of Array.from(element.childNodes)) {
		if(node.nodeName === "BR") {
			if(br) texts.push(""); //sometimes text is skipped with sequenced <br/> 
			br = true;
		} else if(node.nodeName==="SPAN") {
			lessonUrls.push(node.querySelector("a").href);
			br = false;
		} else {
			br = false;
			texts.push(node.textContent)
		}
	}
	return {
		subject: texts[0] || "",
		lecturer: texts[1] || "",
		location: texts[2] || "",
		urls: lessonUrls,
	}
}

function parseLessonId(id) {
	const split = id.split("_");
	let subgroup = "all";
	let week = "full";
	if(id.includes("sub")) {
		subgroup = Number.parseInt(split[1]);
	}
	week = split[split.length-1];
	return {
		isFirstWeek: week === "full" || week==="chys",
		isSecondWeek: week === "full" || week==="znam",
		isFirstSubgroup: subgroup === "all" || subgroup === 1,
		isSecondSubgroup: subgroup === "all" || subgroup === 2,
	}
}

function tryToGetType(location) {
	location = location.toLowerCase();
	if(location.includes("практична")) return "practical";
	if(location.includes("лабораторна")) return "lab";
	if(location.includes("конс.")) return "consultation";
	return "lecture";
}

export function dayToNumber(day) {
	switch(day?.toLowerCase()) {
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
}

export default parser;
