import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	DroppableProvided,
	DraggableProvided,
} from "react-beautiful-dnd";
import styled from "styled-components";

import { Day, Schedule as ESchedule } from "../entities";
import { useMSContext } from "./MSContext";
import { Storage } from "../helpers/storage";
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

	const reorder = (day: Day, startIndex: number, endIndex: number) => {
		let newSchedule: ESchedule = { ...schedule };
		const [removed] = newSchedule[day].splice(startIndex, 1);
		newSchedule[day].splice(endIndex, 0, removed);
		return newSchedule;
	};

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) {
			return;
		}

		const newSchedule = reorder(
			result.destination.droppableId as Day,
			result.source.index,
			result.destination.index
		);
		new Storage("schedule").write(newSchedule);
		schedule.update(newSchedule);
	};

	const AppointmentDnD = ({ targetDay }: { targetDay: Day }) => {
		return (
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId={targetDay}>
					{(provided: DroppableProvided) => (
						<>
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{schedule[targetDay].map(
									(appointment, index) => (
										<Draggable
											key={appointment.id}
											draggableId={appointment.id}
											index={index}
										>
											{(
												providedDraggable: DraggableProvided
											) => (
												<div
													ref={
														providedDraggable.innerRef
													}
													{...providedDraggable.draggableProps}
													{...providedDraggable.dragHandleProps}
												>
													<Appointment
														appointment={
															appointment
														}
														deleteAppointment={
															deleteAppointment
														}
													/>
												</div>
											)}
										</Draggable>
									)
								)}
							</div>
							{provided.placeholder}
						</>
					)}
				</Droppable>
			</DragDropContext>
		);
	};

	return (
		<ScheduleArea>
			{!settings.useMondayAsFirstDay && (
				<DayArea>
					<DayName marked={day === "sunday"}>Domingo</DayName>
					{!schedule.sunday.length ? (
						<NoAppointment />
					) : (
						<AppointmentDnD targetDay={"sunday"} />
					)}
				</DayArea>
			)}
			<DayArea>
				<DayName marked={day === "monday"}>Segunda</DayName>
				{!schedule.monday.length ? (
					<NoAppointment />
				) : (
					<AppointmentDnD targetDay={"monday"} />
				)}
			</DayArea>
			<DayArea>
				<DayName marked={day === "tuesday"}>Terça</DayName>
				{!schedule.tuesday.length ? (
					<NoAppointment />
				) : (
					<AppointmentDnD targetDay={"tuesday"} />
				)}
			</DayArea>
			<DayArea>
				<DayName marked={day === "wednesday"}>Quarta</DayName>
				{!schedule.wednesday.length ? (
					<NoAppointment />
				) : (
					<AppointmentDnD targetDay={"wednesday"} />
				)}
			</DayArea>
			<DayArea>
				<DayName marked={day === "thursday"}>Quinta</DayName>
				{!schedule.thursday.length ? (
					<NoAppointment />
				) : (
					<AppointmentDnD targetDay={"thursday"} />
				)}
			</DayArea>
			<DayArea>
				<DayName marked={day === "friday"}>Sexta</DayName>
				{!schedule.friday.length ? (
					<NoAppointment />
				) : (
					<AppointmentDnD targetDay={"friday"} />
				)}
			</DayArea>
			<DayArea>
				<DayName marked={day === "saturday"}>Sábado</DayName>
				{!schedule.saturday.length ? (
					<NoAppointment />
				) : (
					<AppointmentDnD targetDay={"saturday"} />
				)}
			</DayArea>
			{settings.useMondayAsFirstDay && (
				<DayArea>
					<DayName marked={day === "sunday"}>Domingo</DayName>
					{!schedule.sunday.length ? (
						<NoAppointment />
					) : (
						<AppointmentDnD targetDay={"sunday"} />
					)}
				</DayArea>
			)}
		</ScheduleArea>
	);
}
