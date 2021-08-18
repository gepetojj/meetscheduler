import { useState } from "react";
import { styled as MUIStyled } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { RiAddFill, RiCloseFill } from "react-icons/ri";
import styled from "styled-components";
import uniqid from "uniqid";
import Modal from "reactjs-popup";
import {
	TextField,
	InputLabel,
	MenuItem,
	FormControl,
	Select,
	Input,
} from "@material-ui/core";

import { useMSContext } from "./MSContext";
import { Appointment, Day } from "../entities";
import { Storage } from "../helpers";
import { theme } from "../styles/theme";

const AddAppointmentModalArea = styled(Modal)`
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

const AddAppointmentModalHeader = styled.div`
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

const AddAppointmentModalTitle = styled.h1`
	font-size: 1.5rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.font};
	user-select: none;
`;

const AddAppointmentModalForm = styled.form`
	display: flex;
	flex-direction: column;
	margin: 0.7rem 0.5rem;
	overflow-y: auto;
`;

const AddAppointmentModalInput = MUIStyled(TextField)({
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

const AddAppointmentModalFormControl = MUIStyled(FormControl)({
	margin: "1rem 0",
	"& label": {
		fontFamily: "'Poppins', sans-serif",
		color: theme.colors.font,
		paddingLeft: "0.3rem",
		userSelect: "none",
	},
	"& svg": {
		color: theme.colors.fontDarker,
	},
	"& .MuiInputBase-input": {
		color: theme.colors.fontDark,
	},
	"& .MuiFormLabel-root.Mui-focused": {
		color: theme.colors.font,
	},
	"& .MuiInput-root:before": {
		borderBottom: `1px solid ${theme.colors.fontDark}`,
	},
	"& .MuiInput-root:after": {
		borderBottom: `1px solid ${theme.colors.fontDarker}`,
	},
	"& .MuiInput-root:hover:not(.Mui-disabled):before": {
		borderBottom: `1px solid ${theme.colors.fontDark}`,
		filter: "brightness(130%)",
	},
});

const AddButton = styled.button`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 10rem;
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

export default function AddAppointmentModal() {
	const [days] = useState([
		{ day: "Selecione", value: "" },
		{ day: "Segunda", value: "monday" },
		{ day: "Terça", value: "tuesday" },
		{ day: "Quarta", value: "wednesday" },
		{ day: "Quinta", value: "thursday" },
		{ day: "Sexta", value: "friday" },
		{ day: "Sábado", value: "saturday" },
		{ day: "Domingo", value: "sunday" },
	]);
	const [selectedDay, setSelectedDay] = useState<Day | unknown>("");
	const { enqueueSnackbar } = useSnackbar();
	const { schedule } = useMSContext();

	const handleAppointmentCreation = async (
		name: string,
		link: string,
		time: string,
		day: Day,
		close: () => void
	) => {
		if (!name || !link || !time || !day) {
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
		const newAppointment: Appointment = {
			id: uniqid(),
			time,
			name,
			link,
			day,
		};
		let newSchedule = schedule;
		newSchedule[day].push(newAppointment);
		new Storage("schedule").write(newSchedule);
		enqueueSnackbar("Compromisso criado.", {
			variant: "success",
		});
		setSelectedDay("");
		schedule.update(newSchedule);
		close();
	};

	return (
		<AddAppointmentModalArea
			trigger={
				<AddButton>
					<ButtonIcon>
						<RiAddFill size={21} />
					</ButtonIcon>
					<ButtonText>Adicionar</ButtonText>
				</AddButton>
			}
			modal
			nested
			closeOnDocumentClick
			repositionOnResize
		>
			{(close: () => void) => (
				<>
					<AddAppointmentModalHeader>
						<RiCloseFill
							color={theme.colors.fontDark}
							size={24}
							onClick={() => {
								close();
							}}
						/>
					</AddAppointmentModalHeader>
					<div>
						<AddAppointmentModalTitle>
							Adicione um novo compromisso.
						</AddAppointmentModalTitle>
						<AddAppointmentModalForm
							onSubmit={(event) => {
								event.preventDefault();
								const appointmentName = event.target[0].value;
								const appointmentLink = event.target[1].value;
								const appointmentTime = event.target[2].value;
								const appointmentDay = event.target[3].value;
								handleAppointmentCreation(
									appointmentName,
									appointmentLink,
									appointmentTime,
									appointmentDay,
									close
								);
							}}
						>
							<AddAppointmentModalInput
								fullWidth
								label="Nome da atividade"
								variant="standard"
							/>
							<AddAppointmentModalInput
								fullWidth
								label="Link da atividade"
								variant="standard"
								type="url"
							/>
							<AddAppointmentModalInput
								fullWidth
								label="Início da atividade"
								variant="standard"
								inputProps={{
									inputMode: "numeric",
									pattern: "[0-2][0-9]:[0-5][0-9]",
								}}
								helperText="Formato 24h, exemplo: 14:30"
							/>
							<AddAppointmentModalFormControl>
								<InputLabel id="selectLabel">
									Dia da atividade
								</InputLabel>
								<Select
									labelId="selectLabel"
									value={selectedDay}
									onChange={(day) => {
										setSelectedDay(day.target.value);
									}}
									input={<Input />}
								>
									{days.map((day) => (
										<MenuItem
											key={day.value}
											value={day.value}
										>
											{day.day}
										</MenuItem>
									))}
								</Select>
							</AddAppointmentModalFormControl>
							<ConfirmButton type="submit">
								<ButtonIcon>
									<RiAddFill size={21} />
								</ButtonIcon>
								<ButtonText>Adicionar</ButtonText>
							</ConfirmButton>
						</AddAppointmentModalForm>
					</div>
				</>
			)}
		</AddAppointmentModalArea>
	);
}
