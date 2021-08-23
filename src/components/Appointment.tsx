import { Delete } from "@material-ui/icons";
import styled from "styled-components";

import { theme } from "../styles/theme";
import { Appointment as EAppointment, Day } from "../entities";

export interface IAppointment {
	appointment: EAppointment;
	changeModalState: (state: boolean) => void;
	deleteAppointment: (day: Day, id: string) => void;
}

const AppointmentArea = styled.div`
	display: flex;
	flex-direction: row;
	width: 170px;
	height: 70px;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.primary.main};
	cursor: pointer;
	padding: 0.2rem;
	margin-bottom: 0.7rem;
`;

const AppointmentAction = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: ${({ theme }) => theme.borderRadius};
	padding: 0 0.3rem;
	background-color: ${({ theme }) => theme.colors.primary.main};
	transition: 0.2s;

	&:hover {
		filter: brightness(95%);

		& svg {
			filter: brightness(140%);
			transition: 0.2s;
		}
	}
`;

const AppointmentData = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	width: 100%;
	max-width: 76%;
	border-radius: ${({ theme }) => theme.borderRadius};
	padding: 0.2rem 0.5rem 0.2rem 0.2rem;
	background-color: ${({ theme }) => theme.colors.primary.main};
	transition: 0.2s;

	&:hover {
		filter: brightness(95%);
	}
`;

const AppointmentLabel = styled.span`
	font-weight: 500;
	text-align: right;
	color: ${({ theme }) => theme.colors.font.main};
	max-width: 100%;
	user-select: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const AppointmentTime = styled.span`
	font-weight: 400;
	text-align: right;
	color: ${({ theme }) => theme.colors.font.mOne};
	user-select: none;
`;

export default function Appointment({
	appointment,
	changeModalState,
	deleteAppointment,
}: IAppointment) {
	return (
		<AppointmentArea>
			<AppointmentAction
				onClick={() => {
					deleteAppointment(appointment.day, appointment.id);
				}}
			>
				<Delete
					style={{ color: theme.colors.font.main, fontSize: 30 }}
				/>
			</AppointmentAction>
			<AppointmentData
				onClick={() => {
					changeModalState(true);
				}}
			>
				<AppointmentLabel>{appointment.name}</AppointmentLabel>
				<AppointmentTime>{appointment.time}</AppointmentTime>
			</AppointmentData>
		</AppointmentArea>
	);
}
