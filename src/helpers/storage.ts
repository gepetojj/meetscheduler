import { SETTINGS, Setting } from "../components/MSContext";

export type IStorageBucket = "schedule" | "settings" | Setting;

export interface IStorageWriteManyProps {
	key: Setting;
	value: string | boolean;
}

export class Storage {
	bucket: string;
	standardSchedule: string;

	constructor(bucket: IStorageBucket) {
		this.bucket = bucket;
		this.standardSchedule = JSON.stringify({
			monday: [],
			tuesday: [],
			wednesday: [],
			thursday: [],
			friday: [],
			saturday: [],
			sunday: [],
		});

		if (!localStorage.getItem(bucket) && bucket !== "settings") {
			localStorage.setItem(
				bucket,
				bucket === "schedule" ? this.standardSchedule : ""
			);
		}
	}

	refresh() {
		try {
			return JSON.parse(localStorage.getItem(this.bucket));
		} catch (err) {
			console.error(err);
			return {};
		}
	}

	write(data: unknown) {
		try {
			localStorage.setItem(this.bucket, JSON.stringify(data));
			return;
		} catch (err) {
			console.error(err);
			return;
		}
	}

	refreshMany() {
		if (this.bucket !== "settings") {
			console.error("Invalid bucket.");
			return;
		}
		try {
			let settingsValues: IStorageWriteManyProps[] = [];
			SETTINGS.forEach((setting) => {
				const settingValue = localStorage.getItem(setting);
				settingsValues.push({
					key: setting,
					value: JSON.parse(settingValue),
				});
			});
			return settingsValues;
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	writeMany(query: IStorageWriteManyProps[]) {
		if (this.bucket !== "settings") {
			console.error("Invalid bucket.");
			return;
		}
		try {
			query.forEach((item) => {
				localStorage.setItem(item.key, JSON.stringify(item.value));
			});
			return;
		} catch (err) {
			console.error(err);
			return;
		}
	}
}
