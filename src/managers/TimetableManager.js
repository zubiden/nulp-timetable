import storage from "../utils/storage"
import parser from "../utils/parser"

class TimetableManager {

	async init() {
		this.institutes = (await storage.getItem("institutes")) || [];
		this.groups = (await storage.getItem("groups")) || [];
		this.timetables = (await storage.getItem("cached_timetables")) || [];

		if(this.timetables.length > 0) {
			let first = this.timetables[0];
			if(first.institute) { // old cache, clearing...
				console.log("Clearing old cache...");
				this.clearCache();
			}
		}

		if(!this.institutes.length === 0) {
			console.log("Downloading institute list...");
			this.institutes = await this.getInstitutes(); // need to test...
		}

		if(this.groups.length === 0) {
			console.log("Downloading group list...");
			this.groups = await this.getGroups(); // need to test...
		}
	}

	async getInstitutes() {
		if(this.institutes.length > 0) return this.institutes;
		const institutes = await parser.getInstitutes();
		storage.setItem("institutes", institutes)
		this.institutes = institutes;
		return institutes;
	}

	async getGroups(institute) {
		let suffix = institute ? ("_"+institute) : ""; 
		if(!institute && this.groups.length > 0) return this.groups;
		if(institute) {
			const cached = await storage.getItem("groups"+suffix);
			if(cached) return cached;
		}

		const groups = await parser.getGroups(institute);
		
		if(!institute) {
			this.groups = groups;
		}
		
		storage.setItem("groups"+suffix, groups);
		return groups;
	}

	async getTimetable(group, checkCache = true) {
		if(checkCache && this.timetables.find(el => el.group === group)) {
			return storage.getItem("timetable_"+group);
		}

		const timetable = await parser.getTimetable(group);
		this.timetables = this.timetables.filter(el => el.group !== group) // remove previous timetable
		this.timetables.push({
			group,
			time: Date.now()
		})
		storage.setItem("cached_timetables", this.timetables);
		storage.setItem("timetable_"+group, timetable);
		return timetable;
	}

	async deleteTimetable(group) {
		this.timetables = this.timetables.filter(el => el.group !== group);
		storage.deleteItem("timetable_"+group);
		return storage.setItem("cached_timetables", this.timetables);
	}

	getCachedTimetables() {
		return this.timetables;
	}

	getCachedTime(group) {
		const timetable = this.timetables.find(el => el.group === group);
		return timetable?.time;
	}

	clearCache() {
		storage.clear();
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
		if(!this.groups) return [];
		return this.groups.filter(group => {
			return group.toLowerCase().replace("-","").startsWith(query);
		})
	}
}

export default new TimetableManager();