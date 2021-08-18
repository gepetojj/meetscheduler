import dayjs from "dayjs";

dayjs.locale("pt-br");

export function getHour(): string {
	const hour = dayjs().hour();
	return `${hour < 10 ? `0${hour}` : hour}`;
}
