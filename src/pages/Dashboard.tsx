import { useState, useEffect } from "react";
import { withSnackbar, useSnackbar } from "notistack";
import { MoreVert, Refresh } from "@material-ui/icons";
import styled from "styled-components";
import dayjs from "dayjs";

import { Day } from "../entities";
import { getDayOfWeek, getMinute, getHour, Storage } from "../helpers";
import { useMSContext } from "../components/MSContext";
import AddAppointmentModal from "../components/AddAppointment";
import Appointment from "../components/AppointmentModal";
import NoAppointment from "../components/NoAppointment";
import Button from "../components/Button";
import { theme } from "../styles/theme";

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
		let cooldown = ONE_SECOND;
		refreshSchedule();
		const dayInterval = setInterval(() => {
			if (day === getDayOfWeek()) {
				cooldown < 10 && cooldown++;
			}
			setDay(getDayOfWeek());
			refreshSchedule();
		}, ONE_SECOND * cooldown);
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

	const deleteAppointment = async (day: Day, appointmentId: string) => {
		const newAppointments = schedule[day].filter((appointment) => {
			return appointment.id !== appointmentId;
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
			<ScheduleArea>
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
			</ScheduleArea>
		</Fullpage>
	);
}

export default withSnackbar(Dashboard);
