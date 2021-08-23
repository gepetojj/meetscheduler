import { useState } from "react";
import { styled as MUIStyled } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { RiAddFill, RiCloseFill } from "react-icons/ri";
import styled from "styled-components";
import uniqid from "uniqid";
import Modal from "reactjs-popup";
import {
	InputLabel,
	MenuItem,
	FormControl,
	Select,
	Input as MUIInput,
} from "@material-ui/core";

import { useMSContext } from "./MSContext";
import { Appointment, Day } from "../entities";
import { Storage } from "../helpers";
import { theme } from "../styles/theme";
import Input from "./Input";
import Button from "./Button";

const AddAppointmentModalArea = styled(Modal)`
	&-overlay {
		background-color: #00000035;
	}

	&-content {
		background-color: ${({ theme }) => theme.colors.secondary.main};
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
	color: ${({ theme }) => theme.colors.font.main};
	user-select: none;
`;

const AddAppointmentModalForm = styled.form`
	display: flex;
	flex-direction: column;
	margin: 0.7rem 0.5rem;
	overflow-y: auto;
`;

const AddAppointmentModalFormControl = MUIStyled(FormControl)({
	margin: "0.5rem 0 2rem 0",
	"& label": {
		fontFamily: "'Poppins', sans-serif",
		color: theme.colors.font.main,
		paddingLeft: "0.3rem",
		userSelect: "none",
	},
	"& svg": {
		color: theme.colors.font.mTwo,
	},
	"& .MuiInputBase-input": {
		color: theme.colors.font.mOne,
	},
	"& .MuiFormLabel-root.Mui-focused": {
		color: theme.colors.font.main,
	},
	"& .MuiInput-root:before": {
		borderBottom: `1px solid ${theme.colors.font.mOne}`,
	},
	"& .MuiInput-root:after": {
		borderBottom: `1px solid ${theme.colors.font.mTwo}`,
	},
	"& .MuiInput-root:hover:not(.Mui-disabled):before": {
		borderBottom: `1px solid ${theme.colors.font.mTwo}`,
		filter: "brightness(130%)",
	},
});

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

	const handleAppointmentCreation = (
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
				<Button
					type="primary"
					text="Adicionar"
					icon={
						<RiAddFill color={theme.colors.font.mOne} size={30} />
					}
				/>
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
							color={theme.colors.font.mOne}
							size={30}
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
							<Input
								fullWidth
								label="Nome da atividade"
								variant="standard"
							/>
							<Input
								fullWidth
								label="Link da atividade"
								variant="standard"
								type="url"
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
									input={<MUIInput />}
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
							<Button
								fullWidth
								type="primary"
								text="Adicionar"
								icon={
									<RiAddFill
										size={30}
										color={theme.colors.font.main}
									/>
								}
							/>
						</AddAppointmentModalForm>
					</div>
				</>
			)}
		</AddAppointmentModalArea>
	);
}
