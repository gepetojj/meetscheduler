import { Day } from "./Day";

export interface Appointment {
	id: string;
	name: string;
	link: string;
	time: string;
	day: Day;
}
