import { Day } from "../entities/Day";
import dayjs from "dayjs";

dayjs.locale("pt-br");

export function getDayOfWeek(): Day {
	const dayOfWeek = dayjs().day();
	switch (dayOfWeek) {
		case 0:
			return "sunday";
		case 1:
			return "monday";
		case 2:
			return "tuesday";
		case 3:
			return "wednesday";
		case 4:
			return "thursday";
		case 5:
			return "friday";
		case 6:
			return "saturday";
	}
}
