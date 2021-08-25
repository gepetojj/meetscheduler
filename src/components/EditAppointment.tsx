import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { RiCloseFill, RiEditLine } from "react-icons/ri";
import styled from "styled-components";
import uniqid from "uniqid";
import Modal from "reactjs-popup";

import { useMSContext } from "./MSContext";
import { Storage } from "../helpers";
import { Appointment as EAppointment, Day, Schedule } from "../entities";
import { theme } from "../styles/theme";
import Appointment from "./Appointment";
import Input from "./Input";
import Button from "./Button";

const AppointmentModalArea = styled(Modal)`
	&-overlay {
		background-color: #00000035;
	}

	&-content {
		background-color: ${({ theme }) => theme.colors.secondary.main};
		width: 30rem;
		height: fit-content;
		padding: 1rem;
		border-radius: ${({ theme }) => theme.borderRadius};
	}
`;

const AppointmentModalHeader = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	height: fit-content;
	margin-bottom: 1rem;

	& svg {
		cursor: pointer;
	}
`;

const AppointmentModalTitle = styled.h1`
	font-size: 1.5rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.font.main};
	user-select: none;
`;

const AppointmentModalForm = styled.form`
	display: flex;
	flex-direction: column;
	margin: 0.7rem 0.5rem;
`;

export default function EditAppointment({
	appointment,
	deleteAppointment,
}: {
	appointment: EAppointment;
	deleteAppointment: (day: Day, id: string) => void;
}) {
	const [days] = useState([
		{ day: "Segunda", value: "monday" },
		{ day: "Terça", value: "tuesday" },
		{ day: "Quarta", value: "wednesday" },
		{ day: "Quinta", value: "thursday" },
		{ day: "Sexta", value: "friday" },
		{ day: "Sábado", value: "saturday" },
		{ day: "Domingo", value: "sunday" },
	]);
	const [isModalOpen, setModalOpen] = useState(false);
	const [aName, setAName] = useState("");
	const [aLink, setALink] = useState("");
	const [aTime, setATime] = useState("");
	const { enqueueSnackbar } = useSnackbar();
	const { schedule } = useMSContext();

	useEffect(() => {
		setAName(appointment.name);
		setALink(appointment.link);
		setATime(appointment.time);
	}, [appointment]);

	const handleAppointmentEdit = (
		name: string,
		link: string,
		time: string,
		close: () => void
	) => {
		if (!name || !link || !time) {
			enqueueSnackbar("Nenhum campo pode ser nulo.", {
				variant: "error",
			});
			return;
		}
		if (name.length > 30) {
			enqueueSnackbar("O nome não pode ter mais que 30 caracteres.", {
				variant: "error",
			});
			return;
		}
		let newAppointment: EAppointment = {
			...appointment,
		};
		if (name.length > 0 && name !== newAppointment.name) {
			newAppointment.name = name;
		}
		if (link.length > 0 && link !== newAppointment.link) {
			newAppointment.link = link;
		}
		if (time.length > 0 && time !== newAppointment.time) {
			newAppointment.time = time;
		}
		if (JSON.stringify(appointment) !== JSON.stringify(newAppointment)) {
			newAppointment.id = uniqid();
			const appointmentIndex = schedule[appointment.day].findIndex(
				(app) => {
					return app.id === appointment.id;
				}
			);
			let newSchedule: Schedule = { ...schedule };
			newSchedule[appointment.day][appointmentIndex] = newAppointment;
			new Storage("schedule").write(newSchedule);
			schedule.update(newSchedule);
			enqueueSnackbar("Compromisso editado.", {
				variant: "success",
			});
			close();
			return;
		}
		enqueueSnackbar("Compromisso não alterado.", {
			variant: "warning",
		});
		close();
	};

	return (
		<AppointmentModalArea
			trigger={
				<Appointment
					key={appointment.id}
					appointment={appointment}
					changeModalState={setModalOpen}
					deleteAppointment={deleteAppointment}
				/>
			}
			open={isModalOpen}
			onClose={() => {
				setModalOpen(false);
			}}
			modal
			nested
			closeOnDocumentClick
			repositionOnResize
		>
			{(close: () => void) => (
				<>
					<AppointmentModalHeader>
						<RiCloseFill
							color={theme.colors.font.mOne}
							size={30}
							onClick={() => {
								close();
							}}
						/>
					</AppointmentModalHeader>
					<div>
						<AppointmentModalTitle>
							Edite seu compromisso.
						</AppointmentModalTitle>
						<AppointmentModalForm
							onSubmit={(event) => {
								event.preventDefault();
								const appointmentName = event.target[0].value;
								const appointmentLink = event.target[1].value;
								const appointmentTime = event.target[2].value;
								handleAppointmentEdit(
									appointmentName,
									appointmentLink,
									appointmentTime,
									close
								);
							}}
						>
							<Input
								fullWidth
								label="Nome da atividade"
								variant="standard"
								value={aName}
								onChange={(event) => {
									setAName(event.target.value);
								}}
							/>
							<Input
								fullWidth
								label="Link da atividade"
								variant="standard"
								type="url"
								value={aLink}
								onChange={(event) => {
									setALink(event.target.value);
								}}
							/>
							<Input
								fullWidth
								label="Início da atividade"
								variant="standard"
								inputProps={{
									inputMode: "numeric",
									pattern: "[0-2][0-9]:[0-5][0-9]",
								}}
								helperText="Formato 24h, exemplo: 14:30"
								value={aTime}
								onChange={(event) => {
									setATime(event.target.value);
								}}
							/>
							<Input
								fullWidth
								label="Dia da atividade"
								variant="standard"
								disabled
								value={
									days.find((dayObj) => {
										return dayObj.value === appointment.day;
									}).day
								}
							/>
							<Button
								fullWidth
								type="primary"
								text="Editar"
								icon={
									<RiEditLine
										size={30}
										color={theme.colors.font.main}
									/>
								}
							/>
						</AppointmentModalForm>
					</div>
				</>
			)}
		</AppointmentModalArea>
	);
}
