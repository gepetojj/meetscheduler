import { useSnackbar } from "notistack";
import { FC, useEffect, useState } from "react";
import { RiCloseFill, RiEditLine } from "react-icons/ri";
import Modal from "reactjs-popup";
import styled from "styled-components";
import uniqid from "uniqid";

import { Day, Appointment as EAppointment } from "../entities";
import { Storage } from "../helpers";
import { theme } from "../styles/theme";
import Appointment from "./Appointment";
import Button from "./Button";
import Input from "./Input";
import { useMSContext } from "./MSContext";

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

export interface IEditAppointmentProps {
	appointment: EAppointment;
	deleteAppointment: (day: Day, id: string) => void;
}

export const EditAppointment: FC<IEditAppointmentProps> = ({
	appointment,
	deleteAppointment,
}) => {
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
	const { schedule, settings } = useMSContext();

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
		let newAppointment = appointment;
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
			let newSchedule = schedule;
			newSchedule[appointment.day][appointmentIndex] = newAppointment;
			new Storage("schedule").write(newSchedule);
			schedule.update(newSchedule);
			enqueueSnackbar("Compromisso editado.", {
				variant: "success",
			});
			return close();
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
			onClose={() => setModalOpen(false)}
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
							onClick={close}
						/>
					</AppointmentModalHeader>
					<div>
						<AppointmentModalTitle>
							Edite seu compromisso.
						</AppointmentModalTitle>
						<AppointmentModalForm
							onSubmit={({ preventDefault, target }) => {
								preventDefault();
								handleAppointmentEdit(
									target[0].value,
									target[1].value,
									target[2].value,
									close
								);
							}}
						>
							<Input
								fullWidth
								label="Nome da atividade"
								variant="standard"
								value={aName}
								onChange={({ target }) =>
									setAName(target.value)
								}
							/>
							<Input
								fullWidth
								label={`Link da atividade ${
									settings.linkSuffix ? "(sufixo ativo)" : ""
								}`}
								variant="standard"
								type="url"
								value={aLink}
								onChange={({ target }) =>
									setALink(target.value)
								}
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
								onChange={({ target }) =>
									setATime(target.value)
								}
							/>
							<div
								style={{
									marginBottom: "2rem",
								}}
							>
								<Input
									fullWidth
									label="Dia da atividade"
									variant="standard"
									disabled
									value={
										days.find(({ value }) => {
											return value === appointment.day;
										}).day
									}
								/>
							</div>
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
};
