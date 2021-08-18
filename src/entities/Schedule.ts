import { Appointment } from "./Appointment";

export interface Schedule {
	monday: Appointment[];
	tuesday: Appointment[];
	wednesday: Appointment[];
	thursday: Appointment[];
	friday: Appointment[];
	saturday: Appointment[];
	sunday: Appointment[];
}
