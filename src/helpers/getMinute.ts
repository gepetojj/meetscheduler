import dayjs from "dayjs";

dayjs.locale("pt-br");

export function getMinute(): string {
	const minute = dayjs().minute();
	return `${minute < 10 ? `0${minute}` : minute}`;
}
