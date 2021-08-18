import { useEffect, useState } from "react";
import { styled as MUIStyled } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { RiCloseFill, RiEditLine } from "react-icons/ri";
import styled from "styled-components";
import uniqid from "uniqid";
import Modal from "reactjs-popup";
import TextField from "@material-ui/core/TextField";

import { useMSContext } from "./MSContext";
import { Storage } from "../helpers";
import { Appointment, Day, Schedule } from "../entities";
import { theme } from "../styles/theme";

const AppointmentModalArea = styled(Modal)`
	&-overlay {
		background-color: #00000035;
	}

	&-content {
		background-color: ${({ theme }) => theme.colors.background};
		width: 30rem;
		height: fit-content;
		padding: 1rem;
		border: 1px solid ${({ theme }) => theme.colors.font + "10"};
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
	color: ${({ theme }) => theme.colors.font};
	user-select: none;
`;

const AppointmentModalForm = styled.form`
	display: flex;
	flex-direction: column;
	margin: 0.7rem 0.5rem;
`;

const AppointmentModalInput = MUIStyled(TextField)({
	margin: "1rem 0",
	"& label": {
		fontFamily: "'Poppins', sans-serif",
		color: theme.colors.font,
		paddingLeft: "0.3rem",
		userSelect: "none",
	},
	"& input": {
		fontFamily: "'Poppins', sans-serif",
		color: theme.colors.fontDark,
	},
	"& .MuiInputLabel-root": {
		"&.Mui-focused": {
			color: theme.colors.fontDark,
		},
	},
	"& .MuiInput-root:before": {
		borderBottom: `1px solid ${theme.colors.fontDark}`,
	},
	"& .MuiInput-root:after": {
		borderBottom: `1px solid ${theme.colors.fontDarker}`,
	},
	"& .MuiInput-root:hover:not(.Mui-disabled):before": {
		borderBottom: `1px solid ${theme.colors.fontDarker}`,
		filter: "brightness(130%)",
	},
	"& .MuiFormHelperText-root": {
		color: theme.colors.fontDarker,
		marginTop: "0.3rem",
	},
});

const ButtonIcon = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 0.5rem;
`;

const ButtonText = styled.p`
	display: flex;
	text-align: center;
	justify-content: center;
	align-items: center;
	color: ${({ theme }) => theme.colors.fontDark};
	user-select: none;
`;

const ConfirmButton = styled.button`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100%;
	background-color: ${({ theme }) => theme.colors.primary};
	color: ${({ theme }) => theme.colors.font};
	border: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	padding: 0.8rem;
	margin-top: 2rem;
	cursor: pointer;
	user-select: none;
	transition: 0.2s;

	&:hover {
		filter: brightness(115%);
	}

	&:active {
		filter: brightness(120%);
	}
`;

const DayAppointment = styled.div`
	display: flex;
	flex-direction: row;
	width: 10rem;
	height: fit-content;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.primary};
	cursor: pointer;
	padding: 0.2rem;
	margin-bottom: 0.7rem;
`;

const DayAppointmentClose = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: ${({ theme }) => theme.borderRadius};
	padding: 0 0.3rem;
	background-color: ${({ theme }) => theme.colors.primary};
	transition: 0.2s;

	&:hover {
		filter: brightness(90%);
	}
`;

const DayAppointmentDesc = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	width: 100%;
	max-width: 83%;
	border-radius: ${({ theme }) => theme.borderRadius};
	padding: 0.2rem 0.5rem 0.2rem 0.2rem;
	background-color: ${({ theme }) => theme.colors.primary};
	transition: 0.2s;

	&:hover {
		filter: brightness(90%);
	}
`;

const DayAppointmentLabel = styled.p`
	text-align: right;
	color: ${({ theme }) => theme.colors.fontDark};
	max-width: 100%;
	user-select: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export default function AppointmentModal({
	appointment,
	deleteAppointment,
}: {
	appointment: Appointment;
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

	const Appointment = ({ appointment }: { appointment: Appointment }) => {
		return (
			<DayAppointment>
				<DayAppointmentClose
					onClick={() => {
						deleteAppointment(appointment.day, appointment.id);
					}}
				>
					<RiCloseFill color={theme.colors.fontDark} />
				</DayAppointmentClose>
				<DayAppointmentDesc
					onClick={() => {
						setModalOpen(true);
					}}
				>
					<DayAppointmentLabel>
						{appointment.name}
					</DayAppointmentLabel>
					<DayAppointmentLabel>
						{appointment.time}
					</DayAppointmentLabel>
				</DayAppointmentDesc>
			</DayAppointment>
		);
	};

	const handleAppointmentEdit = (
		name: string,
		link: string,
		time: string,
		close: () => void
	) => {
		if (name.length > 30) {
			enqueueSnackbar("O nome não pode ter mais que 30 caracteres.", {
				variant: "error",
			});
			return;
		}
		let newAppointment: Appointment = {
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
				<Appointment appointment={appointment} key={appointment.id} />
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
							color={theme.colors.fontDark}
							size={24}
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
							<AppointmentModalInput
								fullWidth
								label="Nome da atividade"
								variant="standard"
								value={aName}
								onChange={(event) => {
									setAName(event.target.value);
								}}
							/>
							<AppointmentModalInput
								fullWidth
								label="Link da atividade"
								variant="standard"
								type="url"
								value={aLink}
								onChange={(event) => {
									setALink(event.target.value);
								}}
							/>
							<AppointmentModalInput
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
							<AppointmentModalInput
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
							<ConfirmButton type="submit">
								<ButtonIcon>
									<RiEditLine size={21} />
								</ButtonIcon>
								<ButtonText>Editar</ButtonText>
							</ConfirmButton>
						</AppointmentModalForm>
					</div>
				</>
			)}
		</AppointmentModalArea>
	);
}
