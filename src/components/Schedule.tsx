import styled from "styled-components";

import { Day } from "../entities";
import { useMSContext } from "./MSContext";
import Appointment from "./EditAppointment";
import NoAppointment from "./NoAppointment";

export interface ISchedule {
	day: Day;
	deleteAppointment: (day: Day, id: string) => void;
}

const ScheduleArea = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	width: 100%;
	max-width: 100%;
	height: fit-content;
	min-height: fit-content;
	margin: 2rem 0;
	padding-bottom: 1rem;
	overflow-x: auto;

	&::-webkit-scrollbar {
		width: 7px;
		height: 8px;
	}
	&::-webkit-scrollbar-track {
		background-color: ${({ theme }) => theme.colors.secondary.mOne};
		border-radius: 10px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.secondary.pTwo};
		border-radius: 10px;
	}
`;

const DayArea = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0 1rem;
`;

const DayName = styled.h2<{ marked: boolean }>`
	font-size: 1.7rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.font.main};
	user-select: none;
	margin-bottom: 1rem;
	text-decoration: ${(props) => (props.marked ? "underline" : "none")};
`;

export default function Schedule({ day, deleteAppointment }: ISchedule) {
	const { schedule, settings } = useMSContext();

	return (
		<ScheduleArea>
			{!settings.useMondayAsFirstDay && (
				<DayArea>
					<DayName marked={day === "sunday"}>Domingo</DayName>
					{!schedule.sunday.length ? (
						<NoAppointment />
					) : (
						schedule.sunday.map((appointment) => (
							<Appointment
								key={appointment.id}
								appointment={appointment}
								deleteAppointment={deleteAppointment}
							/>
						))
					)}
				</DayArea>
			)}
			<DayArea>
				<DayName marked={day === "monday"}>Segunda</DayName>
				{!schedule.monday.length ? (
					<NoAppointment />
				) : (
					schedule.monday.map((appointment) => (
						<Appointment
							key={appointment.id}
							appointment={appointment}
							deleteAppointment={deleteAppointment}
						/>
					))
				)}
			</DayArea>
			<DayArea>
				<DayName marked={day === "tuesday"}>Terça</DayName>
				{!schedule.tuesday.length ? (
					<NoAppointment />
				) : (
					schedule.tuesday.map((appointment) => (
						<Appointment
							key={appointment.id}
							appointment={appointment}
							deleteAppointment={deleteAppointment}
						/>
					))
				)}
			</DayArea>
			<DayArea>
				<DayName marked={day === "wednesday"}>Quarta</DayName>
				{!schedule.wednesday.length ? (
					<NoAppointment />
				) : (
					schedule.wednesday.map((appointment) => (
						<Appointment
							key={appointment.id}
							appointment={appointment}
							deleteAppointment={deleteAppointment}
						/>
					))
				)}
			</DayArea>
			<DayArea>
				<DayName marked={day === "thursday"}>Quinta</DayName>
				{!schedule.thursday.length ? (
					<NoAppointment />
				) : (
					schedule.thursday.map((appointment) => (
						<Appointment
							key={appointment.id}
							appointment={appointment}
							deleteAppointment={deleteAppointment}
						/>
					))
				)}
			</DayArea>
			<DayArea>
				<DayName marked={day === "friday"}>Sexta</DayName>
				{!schedule.friday.length ? (
					<NoAppointment />
				) : (
					schedule.friday.map((appointment) => (
						<Appointment
							key={appointment.id}
							appointment={appointment}
							deleteAppointment={deleteAppointment}
						/>
					))
				)}
			</DayArea>
			<DayArea>
				<DayName marked={day === "saturday"}>Sábado</DayName>
				{!schedule.saturday.length ? (
					<NoAppointment />
				) : (
					schedule.saturday.map((appointment) => (
						<Appointment
							key={appointment.id}
							appointment={appointment}
							deleteAppointment={deleteAppointment}
						/>
					))
				)}
			</DayArea>
			{settings.useMondayAsFirstDay && (
				<DayArea>
					<DayName marked={day === "sunday"}>Domingo</DayName>
					{!schedule.sunday.length ? (
						<NoAppointment />
					) : (
						schedule.sunday.map((appointment) => (
							<Appointment
								key={appointment.id}
								appointment={appointment}
								deleteAppointment={deleteAppointment}
							/>
						))
					)}
				</DayArea>
			)}
		</ScheduleArea>
	);
}
