import { useState, useEffect, useCallback } from "react";
import { withSnackbar, useSnackbar } from "notistack";
import { Refresh } from "@material-ui/icons";
import { Button as MUIButton } from "@material-ui/core";
import styled from "styled-components";
import dayjs from "dayjs";

import { Day } from "../entities";
import { theme } from "../styles/theme";
import { useMSContext } from "../components/MSContext";
import { getDayOfWeek, getMinute, getHour, Storage } from "../helpers";
import Button from "../components/Button";
import Options from "../components/Options";
import Schedule from "../components/Schedule";
import AddAppointmentModal from "../components/AddAppointment";

const ONE_SECOND = 1000;
const electron = window.require("electron");
dayjs.locale("pt-br");

const Fullpage = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	padding: 5rem 3rem 0 3rem;
`;

const PageTitle = styled.h1`
	font-size: 2.5rem;
	text-align: left;
	color: ${({ theme }) => theme.colors.font.main};
	user-select: none;
`;

const PageSubTitle = styled.p`
	width: 60%;
	text-align: left;
	color: ${({ theme }) => theme.colors.font.mOne};
	user-select: none;

	@media (max-width: 843px) {
		width: 80%;
	}
	@media (max-width: 650px) {
		width: 90%;
	}
	@media (max-width: 450px) {
		width: 100%;
	}
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 1.5rem;

	& button {
		margin-right: 1.4rem;
	}
`;

function Dashboard() {
	const [storage] = useState(new Storage("schedule"));
	const [day, setDay] = useState<Day>("monday");
	const [appointmentCache, setAppointmentCache] = useState<string[]>([]);
	const { enqueueSnackbar } = useSnackbar();
	const { schedule, settings } = useMSContext();

	const refreshSchedule = useCallback(() => {
		schedule.update(storage.refresh());
	}, [schedule, storage]);

	const refreshSettings = useCallback(() => {
		const settingsValues = new Storage("settings").refreshMany();
		settingsValues.forEach((setting) => {
			settings.update(setting.key, setting.value);
		});
	}, [settings]);

	useEffect(() => {
		const dayInterval = setInterval(() => {
			const newDay = getDayOfWeek();
			if (day !== newDay) {
				setDay(newDay);
				refreshSchedule();
				refreshSettings();
			}
		}, ONE_SECOND);
		return () => clearInterval(dayInterval);
	}, [day, refreshSchedule, refreshSettings]);

	useEffect(() => {
		const checkInterval = setInterval(() => {
			const time = `${getHour()}:${getMinute()}`;

			if (schedule[day].length) {
				const appointments = schedule[day].filter((appointment) => {
					return (
						appointment.time === time &&
						!appointmentCache.includes(appointment.id)
					);
				});
				appointments.forEach((appointment) => {
					const message = `Seu compromisso '${appointment.name}' começou!`;
					const link = `${appointment.link}${
						settings.linkSuffix ? settings.linkSuffix : ""
					}`;
					if (settings.autoOpenAppointments) {
						electron.shell.openExternal(link);
					}
					let newAppointmentCache = appointmentCache;
					newAppointmentCache.push(appointment.id);
					setAppointmentCache(newAppointmentCache);
					enqueueSnackbar(message, {
						variant: "info",
						autoHideDuration: ONE_SECOND * 10,
						action: (
							<MUIButton
								onClick={() => {
									electron.shell.openExternal(link);
								}}
								style={{ color: theme.colors.font.main }}
							>
								Abrir
							</MUIButton>
						),
					});
					new electron.remote.Notification({
						title: "Compromisso iniciado!",
						body: message,
					}).show();
				});
			}
		}, ONE_SECOND);
		return () => clearInterval(checkInterval);
	}, [schedule, day, settings, enqueueSnackbar, appointmentCache]);

	const deleteAppointment = (day: Day, id: string) => {
		const newAppointments = schedule[day].filter((appointment) => {
			return appointment.id !== id;
		});
		const newSchedule = { ...schedule, [day]: newAppointments };
		storage.write(newSchedule);
		refreshSchedule();
	};

	const RefreshAppointments = () => {
		return (
			<Button
				type="secondary"
				text="Recarregar"
				icon={
					<Refresh
						style={{ color: theme.colors.font.main, fontSize: 30 }}
					/>
				}
				onClick={() => {
					setAppointmentCache([]);
					refreshSchedule();
					refreshSettings();
					enqueueSnackbar(
						"Horário, configurações e cache recarregados.",
						{
							variant: "success",
						}
					);
				}}
			/>
		);
	};

	return (
		<Fullpage>
			<PageTitle>Dashboard</PageTitle>
			<PageSubTitle>
				Aqui estão seus compromissos agendados. Você pode adicionar eles
				em cada dia, seus horários e mais.
			</PageSubTitle>
			<Buttons>
				<AddAppointmentModal />
				<RefreshAppointments />
				<Options />
			</Buttons>
			<Schedule day={day} deleteAppointment={deleteAppointment} />
		</Fullpage>
	);
}

export default withSnackbar(Dashboard);
