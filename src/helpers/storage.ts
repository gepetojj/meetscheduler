export class Storage {
	bucket: string;

	constructor(bucket: string) {
		this.bucket = bucket;
		if (!localStorage.getItem(bucket)) {
			localStorage.setItem(
				bucket,
				bucket === "schedule"
					? JSON.stringify({
							monday: [],
							tuesday: [],
							wednesday: [],
							thursday: [],
							friday: [],
							saturday: [],
							sunday: [],
					  })
					: ""
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

	write(data: any) {
		try {
			localStorage.setItem(this.bucket, JSON.stringify(data));
			return;
		} catch (err) {
			console.error(err);
			return;
		}
	}
}
