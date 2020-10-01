import storage from "../utils/storage"
import parser from "../utils/parser"

const ALL = "All";

class TimetableManager {

	async init() {
		this.institutes = (await storage.getItem("institutes")) || [];
		this.groups = (await storage.getItem("groups_"+ALL)) || [];
		this.timetables = (await storage.getItem("cached_timetables")) || [];

		if(!this.institutes) {
			this.institutes = await this.getInstitutes();
		}

		if(!this.groups) {
			this.groups = await this.getGroups();
		}
	}

	async getInstitutes() {
		if(this.institutes.length > 0) return this.institutes;
		const institutes = await parser.getInstitutes();
		storage.setItem("institutes", institutes)
		this.institutes = institutes;
		return institutes;
	}

	async getGroups(institute = ALL) {
		if(institute === ALL && this.groups.length > 0) return this.groups;
		const cached = await storage.getItem("groups_"+institute);
		if(cached) return cached;

		const groups = await parser.getGroups(institute);
		storage.setItem("groups_"+institute, groups)
		if(institute === ALL) {
			this.groups = groups;
		}
		return groups;
	}

	async getTimetable(institute, group, checkCache = true) {
		if(checkCache && this.timetables.find(el => el.institute === institute && el.group === group)) {
			return storage.getItem("timetable_"+institute+"_"+group);
		}

		const timetable = await parser.getTimetable(institute, group);
		this.timetables = this.timetables.filter(el => el.institute !== institute && el.group !== group)
		this.timetables.push({
			institute,
			group,
			time: Date.now()
		})
		storage.setItem("cached_timetables", this.timetables);
		storage.setItem("timetable_"+institute+"_"+group, timetable);
		return timetable;
	}

	async getCachedTimetables() {
		return this.timetables;
	}

	clearCache() {
		storage.clear();
		this.timetables = [];
		this.groups = [];
		this.institutes = [];
	}

	async updateTimetable(institute, group) {
		this.getTimetable(institute, group, false);
	}
}

export default new TimetableManager();