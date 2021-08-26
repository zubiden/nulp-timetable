import storage from "../utils/storage"
import parser from "../utils/parser"

const UPDATE_PERIOD = 3 * 24 * 60 * 60 * 1000; // 3 days

class TimetableManager {

	async init() {
		this.institutes = (await storage.getItem("institutes")) || [];
		this.groups = (await storage.getItem("groups")) || [];
		this.timetables = (await storage.getItem("cached_timetables")) || [];

		if (this.timetables.length > 0) {
			let first = this.timetables[0];
			if (first.institute) { // old cache, clearing...
				console.log("Clearing old cache...");
				this.clearCache();
			}
		}

		const institutesUpdated = await storage.getItem("institutes_updated");
		if (this.institutes.length === 0 || needsUpdate(institutesUpdated)) {
			console.log("Downloading institute list...");
			this.requestInstitutes(true);
		}

		const groupsUpdated = await storage.getItem("groups_updated");
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
		const institutes = await parser.getInstitutes();
		storage.setItem("institutes", institutes);
		storage.setItem('institutes_updated', Date.now());
		this.institutes = institutes;
		return institutes;
	}

	async requestGroups(force) { // only for all
		if (this.groupsRequest) return this.groupsRequest;
		return this.groupsRequest = this.getGroups(undefined, force);
	}

	async getGroups(institute, force) {
		let suffix = institute ? ("_" + institute) : "";
		if (!institute && this.groups.length > 0 && !force) return this.groups;
		if (institute) {
			const cached = await storage.getItem("groups" + suffix);
			if (cached && !force) {
				const updated = await storage.getItem("groups" + suffix + "_updated");
				if (!needsUpdate(updated)) return cached;
			}
		}

		const groups = await parser.getGroups(institute);

		if (!institute) {
			this.groups = groups;
		}

		storage.setItem("groups" + suffix, groups);
		storage.setItem("groups" + suffix + "_updated", Date.now());
		return groups;
	}

	async getTimetable(group, checkCache = true) {
		const data = this.timetables.find(el => el.group === group);
		if (checkCache && data && !needsUpdate(data.time)) {
			return storage.getItem("timetable_" + group);
		}

		const timetable = await parser.getTimetable(group);
		if (!timetable) {
			throw Error(`Failed to get timetable! Group: ${group}, checkCache: ${checkCache}`);
		}
		this.timetables = this.timetables.filter(el => el.group !== group) // remove previous timetable
		this.timetables.push({
			group,
			time: Date.now()
		})
		storage.setItem("cached_timetables", this.timetables);
		storage.setItem("timetable_" + group, timetable);
		return timetable;
	}

	async deleteTimetable(group) {
		this.timetables = this.timetables.filter(el => el.group !== group);
		storage.deleteItem("timetable_" + group);
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
		if (!this.groups) return [];
		return this.groups.filter(group => {
			return group.toLowerCase().replace("-", "").startsWith(query);
		})
	}
}

function needsUpdate(timestamp) {
	if (!timestamp) return true;
	return navigator.onLine && (Date.now() - UPDATE_PERIOD > timestamp);
}

export default new TimetableManager();