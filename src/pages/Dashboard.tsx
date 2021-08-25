import { useState, useEffect } from "react";
import { withSnackbar, useSnackbar } from "notistack";
import { MoreVert, Refresh } from "@material-ui/icons";
import styled from "styled-components";
import dayjs from "dayjs";

import { Day } from "../entities";
import { theme } from "../styles/theme";
import { useMSContext } from "../components/MSContext";
import { getDayOfWeek, getMinute, getHour, Storage } from "../helpers";
import Button from "../components/Button";
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

const Options = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.secondary.main};
	border-radius: ${({ theme }) => theme.borderRadius};
	transition: 0.2s;
	cursor: pointer;

	&:hover {
		filter: brightness(115%);
	}
`;

function Dashboard() {
	const [storage] = useState(new Storage("schedule"));
	const [day, setDay] = useState<Day>("monday");
	const [appointmentCache, setAppointmentCache] = useState<string[]>([]);
	const { enqueueSnackbar } = useSnackbar();
	const { schedule } = useMSContext();

	const refreshSchedule = () => {
		schedule.update(storage.refresh());
	};

	useEffect(() => {
		const dayInterval = setInterval(() => {
			setDay(getDayOfWeek());
			refreshSchedule();
		}, ONE_SECOND);
		return () => clearInterval(dayInterval);
		// eslint-disable-next-line
	}, []);

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
					electron.shell.openExternal(appointment.link);
					let newAppointmentCache = appointmentCache;
					newAppointmentCache.push(appointment.id);
					setAppointmentCache(newAppointmentCache);
					enqueueSnackbar(message, { variant: "info" });
					new electron.remote.Notification({
						title: "Compromisso iniciado!",
						body: message,
					}).show();
				});
			}
		}, ONE_SECOND);
		return () => clearInterval(checkInterval);
		// eslint-disable-next-line
	}, [schedule]);

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
					enqueueSnackbar("Horário e cache recarregados.", {
						variant: "success",
					});
				}}
			/>
		);
	};

	const MoreOptions = () => {
		return (
			<Options>
				<MoreVert
					style={{ color: theme.colors.font.main, fontSize: 30 }}
				/>
			</Options>
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
				<MoreOptions />
			</Buttons>
			<Schedule day={day} deleteAppointment={deleteAppointment} />
		</Fullpage>
	);
}

export default withSnackbar(Dashboard);
